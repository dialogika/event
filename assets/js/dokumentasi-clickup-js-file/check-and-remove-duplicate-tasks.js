// Menambahkan event listener ke form dengan ID "uploadForm"
// Ketika form disubmit, fungsi async akan dipanggil
document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Mencegah perilaku default form submission

    // Mengambil nilai dari input form
    const taskName = document.getElementById("name").value.trim();
    const whatsapp = iti.getNumber(); // Mengambil nomor WhatsApp yang valid
    const motivate = document.getElementById("motivate").value.trim();
    const location = document.getElementById("location").value.trim();
    const jobInputs = document.querySelectorAll("#job");
    
    // Mengambil nilai pekerjaan dan mengubahnya menjadi array yang tidak kosong
    const jobs = Array.from(jobInputs)
      .map((input) => input.value.trim())
      .filter((value) => value);

    // Mengambil elemen loading dan success dari DOM untuk indikator status
    const loading = document.getElementById("loading");
    const success = document.getElementById("success");

    // Validasi input - memastikan taskName, jobs, dan whatsapp tidak kosong
    if (!taskName) {
      alert("Nama tugas harus diisi.");
      return; // Hentikan jika taskName kosong
    }
    if (!jobs.length) {
      alert("Profesi harus dipilih.");
      return; // Hentikan jika tidak ada profesi yang dipilih
    }
    if (!whatsapp) {
      alert("Nomor Whatsapp harus diisi.");
      return; // Hentikan jika nomor WhatsApp kosong
    }

    // Token API ClickUp dan ID list tempat tugas akan disimpan
    const apiToken = "pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N";
    const listId = "900302342659";
    let taskId = null; // Variabel untuk menyimpan ID tugas jika ditemukan duplikat

    try {
      // Menampilkan elemen loading saat request sedang berlangsung
      loading.style.display = "flex";

      // Langkah 1: Kirim permintaan GET ke API ClickUp untuk memeriksa tugas yang ada
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

      // Jika respons dari API tidak berhasil, lempar error
      if (!checkTaskResponse.ok) {
        throw new Error("Gagal memeriksa duplikasi tugas.");
      }

      // Parsing JSON respons dari API ClickUp
      const tasks = await checkTaskResponse.json(); 

      // Variabel untuk menyimpan tugas dan nomor WhatsApp yang cocok
      let existingWA = null;
      let matchedTask = null;

      // Loop melalui semua tugas dan cari tugas dengan nomor WhatsApp yang cocok
      tasks.tasks.forEach((task) => {
        task.custom_fields.forEach((field) => {
          if (field.name === "Whatsapp" && field.value === whatsapp) {
            existingWA = field.value; // Simpan nomor WhatsApp yang cocok
            matchedTask = task; // Simpan tugas yang cocok
          }
        });
      });

      // Jika ada tugas yang cocok dengan nomor WhatsApp
      if (matchedTask) {
        // Hapus tugas yang ada dengan nomor WhatsApp yang sama
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

        // Jika penghapusan gagal, lempar error
        if (!deleteTaskResponse.ok) {
          throw new Error("Gagal menghapus tugas lama.");
        }
      }

      // Langkah 2: Buat tugas baru setelah tugas lama dihapus atau jika tidak ada duplikat
      const createTaskResponse = await fetch(
        `https://api.clickup.com/api/v2/list/${listId}/task`,
        {
          method: "POST",
          headers: {
            Authorization: apiToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: taskName, // Nama tugas baru
            description: "Task dengan field channels",
            custom_fields: [
              {
                id: "218de446-5037-4d3a-9f85-96c047453fe9", // ID untuk field "motivate"
                value: motivate, // Isi field motivate
              },
              {
                id: "4d4ea89a-2c98-467a-8452-a6d1794036ab", // ID untuk field "location"
                value: location, // Isi field lokasi
              },
              {
                id: "41fe905e-8974-4bf3-a871-daddd8c4307a", // ID untuk field "jobs"
                value: jobs, // Array pekerjaan yang dipilih
              },
              {
                id: "562e180b-6664-483e-8f44-28902bfe4fbe", // ID untuk field "whatsapp"
                value: whatsapp, // Nomor WhatsApp pengguna
              },
            ],
          }),
        }
      );

      // Jika respons untuk pembuatan tugas tidak berhasil, lempar error
      if (!createTaskResponse.ok) {
        throw new Error("Gagal membuat tugas baru.");
      }

      // Ambil data tugas yang baru dibuat dari respons
      const createdTaskData = await createTaskResponse.json();
      taskId = createdTaskData.id; // Simpan task ID yang baru dibuat

      // Sembunyikan elemen loading dan tampilkan elemen success
      loading.style.display = "none";
      success.style.display = "flex";
      setTimeout(() => {
        success.style.display = "none"; // Sembunyikan elemen success setelah 3 detik
      }, 3000);
    } catch (error) {
      // Jika terjadi kesalahan, tampilkan pesan error dan sembunyikan loading/success
      console.error("Kesalahan:", error);
      alert(
        "Terjadi kesalahan: " + (error.message || "Kesalahan tidak diketahui.")
      );
      loading.style.display = "none";
      success.style.display = "none";
    }
  });
