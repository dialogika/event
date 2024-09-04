document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const form = document.getElementById('uploadForm');
    const name = document.getElementById('name').value.trim(); 
    const umur = document.getElementById('umur').value.trim();
    const email = document.getElementById('email').value.trim();
    const linkedin = document.getElementById('linkedin').value.trim();
    const channelCheckboxes = document.querySelectorAll('input[name="channel"]:checked');
    const location = document.getElementById('location').value.trim();
    const workType = document.getElementById('workType').value;
    const position = document.getElementById('position').value;
    const motivate = document.getElementById('motivate').value.trim();
    const fileInput = document.getElementById('pdf');
    const file = fileInput.files[0];
    const birthDate = document.getElementById('birthDate').value;
    const loading = document.getElementById('loading');
    const success = document.getElementById('success');

    // ---------------------Take checkbox array ---------------------
    const channels = Array.from(channelCheckboxes).map(checkbox => checkbox.value);

    // ---------------------Validasi all ---------------------
    if (!name || !umur || !email || channels.length === 0 || !location || !position || !motivate || !linkedin || !birthDate) {
        alert('Semua kolom harus diisi.');
        return;
    }

    if (!file || file.type !== 'application/pdf') {
        alert('Silakan unggah file PDF.');
        return;
    }

    // --------------------- Konversi tgl lahir ---------------------
    const birthDateObject = new Date(birthDate);
    if (isNaN(birthDateObject.getTime())) {
        alert('Tanggal lahir tidak valid.');
        return;
    }
    const birthDateTimestamp = birthDateObject.getTime(); 

    // --------------------- Animasi loading ---------------------
    loading.style.display = 'flex';
    success.style.display = 'none';

    const apiToken = 'pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N';
    const listId = '901602772763';

    try {
        // --------------------- Make task ---------------------
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                custom_fields: [
                    {
                        id: '8e9befe8-ae88-496f-b80b-fa87c83c2ea1', // Umur
                        value: parseInt(umur)
                    },
                    {
                        id: '0928d307-37dc-47e3-9ed4-ddc1bf73e4e7', // Channel
                        value: channels 
                    },
                    {
                        id: 'aa774e5f-da8b-43c7-8a6f-f0cf731a6631', // Lokasi (Maps)
                        value: location
                    },
                    {
                        id: 'f3c74d35-738f-4d34-bf63-eecaf8e57b84', // Posisi
                        value: position
                    },
                    {
                        id: '38d27a98-8543-42ac-a039-5763d180d06e', // WFO/WFH
                        value: workType
                    },
                    {
                        id: '50dc4d2b-8674-4ac3-a8e6-ed6383754dd5', // Email
                        value: email
                    },
                    {
                        id: '218de446-5037-4d3a-9f85-96c047453fe9', // Motivasi
                        value: motivate
                    },
                    {
                        id: 'e8a64004-57d9-45b7-8d00-3c6959befca4', // LinkedIn
                        value: linkedin
                    },
                    {
                        id: '5b0638e0-fdde-4f7d-b722-fe2500401c7f', // Tanggal Lahir
                        value: birthDateTimestamp
                    },
                    {
                        id: '08063cb2-73f3-46d2-8d8e-0294bc714d52', // Username
                        value: name // Simpan nama pengguna sebagai Username
                    }
                ]
            })
        });

        const createdTask = await createTaskResponse.json();
        
        if (!createTaskResponse.ok) {
            const error = await createTaskResponse.json();
            throw new Error('Kesalahan saat membuat tugas: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        const taskId = createdTask.id;

        // --------------------- Menambahkan komentar dengan detail lainnya ---------------------
        const commentResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/comment`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment_text: `Nama: ${name}\nUmur: ${umur}\nEmail: ${email}\nMotivasi: ${motivate}\nLinkedIn: ${linkedin}\nTanggal Lahir: ${birthDate}`
            })
        });

        if (!commentResponse.ok) {
            const error = await commentResponse.json();
            throw new Error('Kesalahan saat menambahkan komentar: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        // --------------------- Mengunggah file ke tugas yang baru dibuat ---------------------
        const formData = new FormData();
        formData.append('attachment', file, file.name);

        const uploadFileResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken
            },
            body: formData
        });

        // --------------------- Hide animasi loading setelah selesai ---------------------
        loading.style.display = 'none';

        if (uploadFileResponse.ok) {
            // --------------------- Sembunyikan formulir ---------------------
            form.style.display = 'none';
            // --------------------- coment sukses---------------------
            success.style.display = 'block';
        } else {
            const error = await uploadFileResponse.json();
            alert('Kesalahan saat mengunggah file: ' + (error.err || 'Kesalahan tidak diketahui'));
        }
    } catch (error) {
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
        loading.style.display = 'none';
    }
});
