document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    // Mencegah submit default
    event.preventDefault();

    // Mengambil referensi elemen form dan input
    const form = document.getElementById('uploadForm');
    const submitButton = form.querySelector('button[type="submit"]'); // Mengambil referensi tombol submit
    const name = document.getElementById('name').value.trim();
    const umur = document.getElementById('umur').value.trim();
    const email = document.getElementById('email').value.trim();
    const linkedin = document.getElementById('linkedin').value.trim();
    const channelCheckboxes = document.querySelectorAll('input[name="channel"]:checked');
    const location = document.getElementById('location').value.trim();
    const workType = document.getElementById('workType').value;
    const position = document.getElementById('position').value;
    const motivate = document.getElementById('motivate').value.trim();
    const fileInput = document.getElementById('pdfUpload'); // Sesuaikan ID ke "pdfUpload"
    const file = fileInput.files[0];
    const birthDate = document.getElementById('birthDate').value;
    const loading = document.getElementById('loading');
    const success = document.getElementById('success');

    // Mengambil semua checkbox channel yang dicentang
    const channels = Array.from(channelCheckboxes).map(checkbox => checkbox.value);

    // Validasi sederhana
    if (!name || !umur || !email || channels.length === 0 || !location || !position || !motivate || !linkedin || !birthDate) {
        alert('Semua kolom harus diisi.');
        return;
    }

    // Validasi file harus berformat PDF
    if (!file || file.type !== 'application/pdf') {
        alert('Silakan unggah file PDF.');
        return;
    }

    // Validasi ukuran file maksimal 2 MB (2 MB = 2 * 1024 * 1024 byte)
    const maxFileSize = 2 * 1024 * 1024; // 2 MB
    if (file.size > maxFileSize) {
        alert('Ukuran file tidak boleh lebih dari 2 MB.');
        return;
    }

    // Konversi tanggal lahir ke timestamp
    const birthDateObject = new Date(birthDate);
    if (isNaN(birthDateObject.getTime())) {
        alert('Tanggal lahir tidak valid.');
        return;
    }
    const birthDateTimestamp = birthDateObject.getTime(); 

    // Tampilkan loading dan sembunyikan success
    loading.style.display = 'flex';
    success.style.opacity = '0'; // Sembunyikan dengan opacity
    success.style.display = 'none'; // Tetap sembunyikan secara awal

    // Disable tombol submit selama proses upload
    submitButton.disabled = true;
    submitButton.textContent = 'Mengunggah...'; // Ubah teks tombol

    // API Token dan List ID ClickUp
    const apiToken = 'pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N';
    const listId = '901602772763';

    try {
        // Membuat task baru di ClickUp
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                custom_fields: [
                    { id: '8e9befe8-ae88-496f-b80b-fa87c83c2ea1', value: parseInt(umur) },
                    { id: '0928d307-37dc-47e3-9ed4-ddc1bf73e4e7', value: channels },
                    { id: 'aa774e5f-da8b-43c7-8a6f-f0cf731a6631', value: location },
                    { id: 'f3c74d35-738f-4d34-bf63-eecaf8e57b84', value: position },
                    { id: '38d27a98-8543-42ac-a039-5763d180d06e', value: workType },
                    { id: '50dc4d2b-8674-4ac3-a8e6-ed6383754dd5', value: email },
                    { id: '218de446-5037-4d3a-9f85-96c047453fe9', value: motivate },
                    { id: 'e8a64004-57d9-45b7-8d00-3c6959befca4', value: linkedin },
                    { id: '5b0638e0-fdde-4f7d-b722-fe2500401c7f', value: birthDateTimestamp },
                    { id: '08063cb2-73f3-46d2-8d8e-0294bc714d52', value: name }
                ]
            })
        });

        if (!createTaskResponse.ok) {
            const error = await createTaskResponse.json();
            throw new Error('Kesalahan saat membuat tugas: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        const createdTask = await createTaskResponse.json();
        const taskId = createdTask.id;

        // Menambahkan komentar ke task
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

        // Mengunggah file PDF ke task
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
            // Sembunyikan form dan tampilkan pesan sukses
            form.style.display = 'none';
            success.style.display = 'block'; // Tampilkan elemen sukses
            success.style.opacity = '1'; // Animasi fade in
        } else {
            const error = await uploadFileResponse.json();
            alert('Kesalahan saat mengunggah file: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

    } catch (error) {
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        loading.style.display = 'none'; // Sembunyikan loading
        submitButton.disabled = false; // Aktifkan kembali tombol setelah selesai
        submitButton.textContent = 'Submit'; // Kembalikan teks tombol
    }
});
