document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    // Mencegah submit default
    event.preventDefault();

    // Mengambil referensi elemen form dan input
    const taskName = document.getElementById('taskName').value.trim(); // Ambil nama tugas
    const location = document.getElementById('location').value.trim();

    // Validasi input
    if (!taskName) {
        alert('Nama tugas harus diisi.');
        return;
    }


    // API Token dan List ID ClickUp
    const apiToken = 'pk_276677813_5LZTC2L1TYHRVBRRRK5BKXBZDVUU2X7E';
    const listId = '901602772763'; // Ganti dengan ID list ClickUp yang sesuai

    try {
        // Membuat task baru di ClickUp dengan nama tugas dan custom field channels
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: taskName, // Nama tugas yang diambil dari input
                description: 'Task dengan field channels',
                custom_fields: [
                    { 
                        id: 'aa774e5f-da8b-43c7-8a6f-f0cf731a6631', 
                        value: location
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
