document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    // Mencegah submit default
    event.preventDefault();

    // Mengambil referensi elemen form dan input
    const taskName = document.getElementById('taskName').value.trim(); // Ambil nama tugas
    const fileInput = document.getElementById('pdfUpload'); // Ambil file PDF yang diunggah
    const file = fileInput.files[0];

    // Validasi input
    if (!taskName) {
        alert('Nama tugas harus diisi.');
        return;
    }

    if (!file || file.type !== 'application/pdf') {
        alert('Silakan unggah file PDF.');
        return;
    }

    // Validasi ukuran file maksimal 2 MB
    const maxFileSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxFileSize) {
        alert('Ukuran file tidak boleh lebih dari 2 MB.');
        return;
    }

    try {
        // Bagian 1: Unggah file ke Google Drive terlebih dahulu
        const reader = new FileReader();
        reader.onloadend = async function () {
            const base64File = reader.result.split(',')[1]; // Ambil bagian base64

            const formData = new FormData();
            const originalFileName = file.name;
            const fileExtension = originalFileName.split('.').pop(); // Ekstensi file (pdf)
            const newFileName = `${taskName}_${originalFileName.replace(/\.[^/.]+$/, "")}.${fileExtension}`; // Nama baru dengan taskName
            formData.append("fileName", newFileName); // Nama file baru yang berisi taskName
            formData.append("mimeType", file.type); // Tipe MIME
            formData.append("binaryData", base64File); // Data file PDF dalam base64

            const uploadFileResponse = await fetch("https://script.google.com/macros/s/AKfycbzo6lUqc2QIMArrX3K6fiaK6UHpCVuFdhyXBURUb8zf9Pv9AdW7Gc14ZSXPF_3ZK0psog/exec", {
                method: 'POST',
                body: formData
            });

            if (uploadFileResponse.ok) {
                const uploadResult = await uploadFileResponse.text();
                console.log('File berhasil diunggah ke Google Drive:', uploadResult);

                // Ambil link Google Drive dari hasil unggahan
                let driveLink = `https://drive.google.com/file/d/${uploadResult}/view?usp=drivesdk/view?usp=sharing`;

                // Bagian 2: Setelah file berhasil diunggah, buat tugas di ClickUp dengan memasukkan link Drive ke dalam custom_fields
                const apiToken = 'pk_276677813_5LZTC2L1TYHRVBRRRK5BKXBZDVUU2X7E'; // Ganti dengan token API ClickUp yang sesuai
                const listId = '901602772763'; // Ganti dengan ID list ClickUp yang sesuai

                const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
                    method: 'POST',
                    headers: {
                        'Authorization': apiToken,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: taskName, // Nama tugas yang diambil dari input
                        description: 'Tugas dengan lampiran PDF yang diunggah ke Google Drive',
                        custom_fields: [
                            {
                                id: '218de446-5037-4d3a-9f85-96c047453fe9', // Ganti dengan ID custom field yang sesuai
                                value: driveLink // Link Google Drive dimasukkan ke custom field
                            }
                        ]
                    })
                });

                if (!createTaskResponse.ok) {
                    const error = await createTaskResponse.json();
                    throw new Error('Kesalahan saat membuat tugas di ClickUp: ' + (error.err || 'Kesalahan tidak diketahui'));
                }

                const createdTask = await createTaskResponse.json();
                alert('Tugas berhasil dibuat di ClickUp dengan nama tugas: ' + taskName);
            } else {
                throw new Error('Gagal mengunggah file ke Google Drive.');
            }
        };

        reader.readAsDataURL(file); // Konversi file menjadi base64
    } catch (error) {
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
});
