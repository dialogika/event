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

    // Validasi ukuran file maksimal 2 MB (2 * 1024 * 1024 byte)
    const maxFileSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxFileSize) {
        alert('Ukuran file tidak boleh lebih dari 2 MB.');
        return;
    }

    // API Token dan List ID ClickUp
    const apiToken = 'pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N';
    const listId = '901602772763'; // Ganti dengan ID list ClickUp yang sesuai

    try {
        // Membuat task baru di ClickUp dengan nama tugas dan file ID
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: taskName, // Nama tugas yang diambil dari input
                description: 'Tugas dengan lampiran PDF',
                custom_fields: [
                    {
                        id: '5a17b2b7-49e3-42d9-992b-c5e5dc7f50cf', // ID custom field untuk file
                        value: null // Di sini kita akan unggah file nanti
                    }
                ]
            })
        });

        if (!createTaskResponse.ok) {
            const error = await createTaskResponse.json();
            throw new Error('Kesalahan saat membuat tugas: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        const createdTask = await createTaskResponse.json();
        const taskId = createdTask.id; // Ambil ID task yang baru dibuat

        // Mengunggah file PDF ke custom field 'Files' di task yang baru dibuat
        const formData = new FormData();
        formData.append('attachment', file, file.name);

        const uploadFileResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken
            },
            body: formData
        });

        if (uploadFileResponse.ok) {
            alert('File berhasil diunggah dan task berhasil dibuat.');
        } else {
            const error = await uploadFileResponse.json();
            alert('Kesalahan saat mengunggah file: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

    } catch (error) {
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
});
