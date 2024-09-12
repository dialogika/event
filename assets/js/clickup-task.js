document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    // Mencegah submit default
    event.preventDefault();

    // Mengambil referensi elemen form dan input
    const taskName = document.getElementById("name").value.trim(); // Ambil nama tugas
    const motivate = document.getElementById("motivate").value.trim();
    const location = document.getElementById("location").value.trim();
    const whatsapp = iti.getNumber();   // Valuenya mengambil dari part/international-phone-number/script.js
    const jobInputs = document.querySelectorAll("#job"); // Ambil profesi
    const jobs = Array.from(jobInputs)
      .map((input) => {
        const optionId = input.value.trim();
        return optionId; // Gunakan ID opsi yang valid
      })
      .filter((value) => value);

    console.log(whatsapp);

    // Validasi input
    if (!taskName) {
      alert("Nama tugas harus diisi.");
      return;
    }
    if (!job) {
      alert("Profesi harus dipilih.");
      return;
    }
    if (!whatsapp) {
      alert("Nomor Whatsapp harus diisi.");
      return;
    }

    // API Token dan List ID ClickUp
    const apiToken = "pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N";
    const listId = "900302342659"; // Ganti dengan ID list ClickUp yang sesuai

    try {
      // Membuat task baru di ClickUp dengan nama tugas dan custom field channels
      const createTaskResponse = await fetch(
        `https://api.clickup.com/api/v2/list/${listId}/task`,
        {
          method: "POST",
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: taskName, // Nama tugas yang diambil dari input
            description: "Task dengan field channels",
            custom_fields: [
              {
                id: "218de446-5037-4d3a-9f85-96c047453fe9",
                value: motivate,
              },
              {
                id: "4d4ea89a-2c98-467a-8452-a6d1794036ab",
                value: location,
              },
              {
                id: "41fe905e-8974-4bf3-a871-daddd8c4307a",
                value: jobs,
              },
              {
                id: "562e180b-6664-483e-8f44-28902bfe4fbe",
                value: whatsapp,
              },
            ],
          }),
        }
      );

      if (!createTaskResponse.ok) {
        const error = await createTaskResponse.json();
        throw new Error(
          "Kesalahan saat membuat tugas: " +
            (error.err || "Kesalahan tidak diketahui")
        );
      }

      alert("Tugas berhasil dibuat.");
    } catch (error) {
      console.error("Kesalahan:", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  });
