document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const taskName = document.getElementById('taskName').value.trim();
    const verified = document.getElementById('verified').checked; // Get checked value (true/false)

    if (!taskName) {
        alert('Nama tugas harus diisi.');
        document.getElementById('taskName').focus();
        return;
    }

    const apiToken = 'pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N';
    const listId = '901602772763';

    try {
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: taskName,
                description: 'Task with verified field',
                custom_fields: [
                    { 
                        id: '78dc236e-2f0b-4e70-82d1-0ccd7926fb88', // Verified checkbox field ID
                        value: verified // Send true/false based on the checkbox
                    }
                ]
            })
        });

        if (!createTaskResponse.ok) {
            const error = await createTaskResponse.json();
            console.error('Error:', error);
            throw new Error('Kesalahan saat membuat tugas: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        const taskData = await createTaskResponse.json(); // Get the response body
        alert('Tugas berhasil dibuat dengan ID: ' + taskData.id);

    } catch (error) {
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    }
});