document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    // Mencegah submit default
    event.preventDefault();

    // Mengambil referensi elemen form dan input
    const taskName = document.getElementById('taskName').value.trim(); // Ambil nama tugas
    const rating = document.getElementById('rating').value; // Ambil rating

    // Validasi input
    if (!taskName || rating === '') {
        alert('Nama tugas dan rating harus diisi.');
        return;
    }

    // API Token dan List ID ClickUp
    const apiToken = 'pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N';
    const listId = '901602772763'; // Ganti dengan ID list ClickUp yang sesuai

    try {
        // Membuat task baru di ClickUp dengan nama tugas dan custom field rating
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: taskName, // Nama tugas yang diambil dari input
                description: 'Task dengan field rating',
                custom_fields: [
                    { 
                        id: '42d9a4fc-e8a3-49bc-9f41-4ef76c6dae94', 
                        value: parseInt(rating) // Mengonversi rating menjadi integer
                    }
                ]
            })
        });

        if (!createTaskResponse.ok) {
            const error = await createTaskResponse.json();
            throw new Error('Kesalahan saat membuat tugas: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        alert('Tugas berhasil dibuat.');

    } catch (error) {
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
});
