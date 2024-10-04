$(document).on("click", ".submitBtn", function () {
  window.open("https://chat.whatsapp.com/HMvvH97Mj4p5HSQYDbRnPM", "_blank");
});

document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const taskName = document.getElementById("name").value.trim();
    const whatsapp = iti.getNumber();
    const motivate = document.getElementById("motivate").value.trim();
    const location = document.getElementById("location").value.trim();
    const jobInputs = document.querySelectorAll("#job");
    const jobs = Array.from(jobInputs)
      .map((input) => input.value.trim())
      .filter((value) => value);
    const loading = document.getElementById("loading");
    const success = document.getElementById("success");

    if (!taskName) {
      alert("Nama tugas harus diisi.");
      return;
    }
    if (!jobs.length) {
      alert("Profesi harus dipilih.");
      return;
    }
    if (!whatsapp) {
      alert("Nomor Whatsapp harus diisi.");
      return;
    }

    const apiToken = "pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N";
    const listId = "900302342659";
    let taskId = null; // Variabel untuk menyimpan task ID

    try {
      loading.style.display = "flex";

      // Langkah 1: Send GET Request ke Clickup
      const checkTaskResponse = await fetch(
        `https://api.clickup.com/api/v2/list/${listId}/task?subtasks=true`,
        {
          method: "GET",
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkTaskResponse.ok) {
        throw new Error("Gagal memeriksa duplikasi tugas.");
      }

      const tasks = await checkTaskResponse.json(); // response data dari clickup

      // Variable sementara untuk menyimpan nomor whatsapp dan task yang sama.
      let existingWA = null;
      let matchedTask = null;

      tasks.tasks.forEach((task) => {
        task.custom_fields.forEach((field) => {
          if (field.name === "Whatsapp" && field.value === whatsapp) {
            existingWA = field.value; // Simpan nomor whatsapp yang sama
            matchedTask = task; // Simpan task clickup yang sama
          }
        });
      });

      if (matchedTask) {
        // Hapus matched task/data yang sama
        taskId = matchedTask.id;
        const deleteTaskResponse = await fetch(
          `https://api.clickup.com/api/v2/task/${taskId}`,
          {
            method: "DELETE",
            headers: {
              Authorization: apiToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!deleteTaskResponse.ok) {
          throw new Error("Gagal menghapus tugas lama.");
        }
      }

      // Langkah 2: Buat task baru setelah task lama dihapus (atau jika task tidak ada)
      const createTaskResponse = await fetch(
        `https://api.clickup.com/api/v2/list/${listId}/task`,
        {
          method: "POST",
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: taskName,
            description: "Task dengan field channels",
            custom_fields: [
              {
                id: "218de446-5037-4d3a-9f85-96c047453fe9", // ID untuk field "motivate"
                value: motivate,
              },
              {
                id: "4d4ea89a-2c98-467a-8452-a6d1794036ab", // ID untuk field "location"
                value: location, // Lokasi baru
              },
              {
                id: "41fe905e-8974-4bf3-a871-daddd8c4307a", // ID untuk field "jobs"
                value: jobs,
              },
              {
                id: "562e180b-6664-483e-8f44-28902bfe4fbe", // ID untuk field "whatsapp"
                value: whatsapp,
              },
            ],
          }),
        }
      );

      if (!createTaskResponse.ok) throw new Error("Gagal membuat tugas baru.");

      const createdTaskData = await createTaskResponse.json();
      taskId = createdTaskData.id; // Simpan task ID yang baru dibuat

      loading.style.display = "none";
      success.style.display = "flex";
      setTimeout(() => {
        success.style.display = "none";
      }, 3000);
    } catch (error) {
      console.error("Kesalahan:", error);
      alert(
        "Terjadi kesalahan: " + (error.message || "Kesalahan tidak diketahui.")
      );
      loading.style.display = "none";
      success.style.display = "none";
    }
  });

// Function untuk cek id custom field clickup
document
  .getElementById("getClickupData")
  .addEventListener("click", async (event) => {
    const apiToken = "pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N";
    const listId = "14355106";
    let taskId = null; // Variabel untuk menyimpan task ID

    try {
      loading.style.display = "flex";

      // Langkah 1: Send GET Request ke Clickup
      const checkTaskResponse = await fetch(
        `https://api.clickup.com/api/v2/list/${listId}/field`,
        {
          method: "GET",
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkTaskResponse.ok) {
        throw new Error("Gagal memeriksa duplikasi tugas.");
      }

      const tasks = await checkTaskResponse.json(); // response data dari clickup

      // Variable sementara untuk menyimpan nomor whatsapp dan task yang sama.
      let existingWA = null;
      let matchedTask = null;
      console.log("ini response:", checkTaskResponse);
      console.log("ini tasks :", tasks);
    } catch {}
  });
