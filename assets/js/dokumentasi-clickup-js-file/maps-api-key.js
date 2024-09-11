async function generateAddress() {
    const addressInput = document.getElementById("address").value.trim();
    const resultElement = document.getElementById("result");

    if (!addressInput) {
        resultElement.textContent = "Silakan masukkan alamat.";
        return;
    }

    const apiKey = 'AIzaSyCN0_WorGxXDRt_eL92mzdirt4ASWzpueo'; // Ganti dengan API key Anda
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressInput)}&key=${apiKey}`;

    try {
        const response = await fetch(geocodingUrl);
        const data = await response.json();

        if (data.status === "OK") {
            const formattedAddress = data.results[0].formatted_address;
            document.getElementById("formattedAddress").value = formattedAddress;
            resultElement.textContent = JSON.stringify(data, null, 2);
        } else {
            resultElement.textContent = "Alamat tidak ditemukan.";
        }
    } catch (error) {
        resultElement.textContent = "Terjadi kesalahan: " + error.message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('uploadForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const taskName = document.getElementById('taskName').value.trim();
        const location = document.getElementById('formattedAddress').value.trim();

        if (!taskName) {
            alert('Nama tugas harus diisi.');
            return;
        }

        if (!location) {
            alert('Alamat harus diisi.');
            return;
        }

        const apiToken = 'pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N';
        const listId = '901602772763'; // Ganti dengan ID list ClickUp yang sesuai

        try {
            const createTaskResponse = await fetch(`http://localhost:3000/api/clickup/api/v2/list/${listId}/task`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: taskName,
                    description: 'Task dengan field maps',
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
});
