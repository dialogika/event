document
  .getElementById("uploadForm")
  .addEventListener("submit", async function (event) {
    // Mencegah submit default
    event.preventDefault();

    // Mengambil referensi elemen form dan input
    const taskName = document.getElementById("name").value.trim(); // Ambil nama tugas
    const whatsapp = iti.getNumber(); // Valuenya mengambil dari part/international-phone-number/script.js
    const motivate = document.getElementById("motivate").value.trim();
    const location = document.getElementById("location").value.trim();
    const jobInputs = document.querySelectorAll("#job"); // Ambil profesi
    const jobs = Array.from(jobInputs)
      .map((input) => {
        const optionId = input.value.trim();
        return optionId; // Gunakan ID opsi yang valid
      })
      .filter((value) => value);
    const loading = document.getElementById("loading");
    const success = document.getElementById("success");

    // Validasi input
    if (!taskName) {
      alert("Nama tugas harus diisi.");
      return;
    }
    if (!jobs) {
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
      loading.style.display = "flex";
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
        // Check if response is in JSON format
        let errorDetails;
        try {
          errorDetails = await createTaskResponse.json();
        } catch (jsonParseError) {
          errorDetails = { err: "Response is not a valid JSON." };
        }

        // Handle specific HTTP status codes and provide more information
        switch (createTaskResponse.status) {
          case 400:
            throw new Error(
              "Bad Request: Terdapat data yang tidak valid.Tolong cek ulang data yang anda masukkan."
            );
          case 401:
            throw new Error(
              "Unauthorized: Invalid API token. Please check your API key and permissions."
            );
          case 403:
            throw new Error(
              "Forbidden: You do not have permission to create a task in this list. Verify your access rights."
            );
          case 404:
            throw new Error(
              "Not Found: The list ID is incorrect or the resource could not be found."
            );
          case 429:
            throw new Error(
              "Too Many Requests: You have hit the rate limit. Please wait a while before trying again."
            );
          case 500:
            throw new Error(
              "Internal Server Error: There was a problem on Server's side. Please try again later."
            );
          default:
            throw new Error(
              `Unexpected Error: ${createTaskResponse.status}. ${
                errorDetails.err || "No additional details available."
              }`
            );
        }
      }
      loading.style.display = "none";
      success.style.display = "flex";
      setTimeout(() => {
        success.style.display = "none";
      }, 3000);
    } catch (error) {
      console.error("Kesalahan:", error);
      alert(
        "Terjadi kesalahan saat membuat tugas: " +
          (error.message || "Kesalahan tidak diketahui. Silakan coba lagi.")
      );
      loading.style.display = "none";
      success.style.display = "none";
    }
  });
