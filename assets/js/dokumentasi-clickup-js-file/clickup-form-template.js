document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    // Prevent default form submission
    event.preventDefault();

    // ==================== Mengambil nilai dari berbagai input form ==================== 
 
    const taskName = document.getElementById('taskName').value.trim(); // Nama tugas
    const umur = document.getElementById('umur').value.trim(); // Umur (dalam bentuk teks, pastikan ini adalah angka valid)
    const verified = document.getElementById('verified').checked; // Status verifikasi (true/false dari checkbox)
    const channelCheckboxes = document.querySelectorAll('input[name="channel"]:checked'); // Checkbox yang dipilih (multiple)
    const channels = Array.from(channelCheckboxes).map(checkbox => checkbox.value); // Mengubah checkbox yang dipilih menjadi array nilai
    const birthDate = document.getElementById('birthDate').value;
    const workType = document.getElementById('workType').value; // Tipe pekerjaan yang dipilih dari dropdown
    const position = document.getElementById('position').value;
    const email = document.getElementById('email').value.trim(); // Alamat email
    const location = document.getElementById('location').value.trim(); // Lokasi pengguna
    const linkedin = document.getElementById('linkedin').value.trim(); // URL LinkedIn
    let price = document.getElementById('price').value.trim(); // Ubah dari 'const' menjadi 'let'
    const rating = document.getElementById('rating').value; // Nilai rating (misalnya, dari 1 sampai 5)

    const motivate = document.getElementById('motivate').value.trim(); // Motivasi atau alasan dari pengguna
    const priority = document.getElementById('priority').value; // Ambil priority
    const fileInput = document.getElementById('pdfUpload'); // Input elemen untuk unggah file PDF
    const file = fileInput.files[0]; // File PDF yang diunggah

    // ==================== Mengambil nilai dari berbagai input form ==================== 

    //==================== Input validation ====================

    if (!taskName) {
        alert('Nama tugas harus diisi.');
        document.getElementById('taskName').focus();
        return;
    }

    // Konversi tanggal lahir ke timestamp
    const birthDateObject = new Date(birthDate);
    if (isNaN(birthDateObject.getTime())) {
        alert('Tanggal lahir tidak valid.');
        return;
    }
    const birthDateTimestamp = birthDateObject.getTime(); 

    // Validasi tipe file PDF
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

    // Hapus simbol 'Rp' dan format angka pada harga agar hanya angka tersisa
    price = price.replace(/[^,\d]/g, '').replace(',', '.'); // Mengganti koma desimal dengan titik

    // Konversi harga menjadi float
    const parsedPrice = parseFloat(price);

    // Validasi apakah harga yang dimasukkan adalah angka valid
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        alert('Harga yang dimasukkan tidak valid. Masukkan angka yang benar.');
        return;
    }

    //==================== End Input validation ====================


    //==================== API Token and ClickUp List ID ====================

    const apiToken = 'pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N';
    const listId = '901602772763'; // Replace with the correct ClickUp List ID

    //==================== End API Token and ClickUp List ID ====================

    try {
        // Mengirim permintaan POST untuk membuat task baru di ClickUp dengan berbagai custom fields
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: taskName, // Task name from input
                description: 'Task with multiple fields and PDF attachment',
                priority: parseInt(priority), // Menambahkan priority ke dalam body
                custom_fields: [
                    {
                        id: '8e9befe8-ae88-496f-b80b-fa87c83c2ea1', // ID for age field
                        value: parseInt(umur) // Age value from input
                    },
                    {
                        id: '78dc236e-2f0b-4e70-82d1-0ccd7926fb88', // ID for verified checkbox field
                        value: verified // Verified checkbox value (true/false)
                    },
                    {
                        id: '0928d307-37dc-47e3-9ed4-ddc1bf73e4e7', // ID for channels field
                        value: channels.length > 0 ? channels : '' // Handle empty channels
                    },
                    {
                        id: '38d27a98-8543-42ac-a039-5763d180d06e', // ID for workType dropdown
                        value: workType // Work type value from dropdown
                    },
                    {
                        id: 'f3c74d35-738f-4d34-bf63-eecaf8e57b84', // ID for Position dropdown
                        value: position // Position type value from dropdown
                    },
                    {
                        id: '50dc4d2b-8674-4ac3-a8e6-ed6383754dd5', // ID for email field
                        value: email // Email value from input
                    },
                    {
                        id: 'aa774e5f-da8b-43c7-8a6f-f0cf731a6631', // ID for location field
                        value: location // Location value from input
                    },
                    {
                        id: 'e8a64004-57d9-45b7-8d00-3c6959befca4', // ID for LinkedIn URL field
                        value: linkedin // LinkedIn URL value from input
                    },
                    {
                        id: 'c402e41b-8013-4383-aa3d-f87e78322adc', // ID custom field untuk Price
                        value: parsedPrice // Mengirim harga sebagai float
                    },
                    {
                        id: '42d9a4fc-e8a3-49bc-9f41-4ef76c6dae94', // ID for rating field
                        value: parseInt(rating) // Rating value from input
                    },
                    {
                        id: '218de446-5037-4d3a-9f85-96c047453fe9', // ID for motivation field
                        value: motivate // Motivation text area value
                    },
                    { 
                        id: '5b0638e0-fdde-4f7d-b722-fe2500401c7f', 
                        value: birthDateTimestamp
                    }
                ]
            })
        });

        if (!createTaskResponse.ok) {
            // Jika respons dari API ClickUp tidak OK, ambil pesan error dari respons JSON
            const error = await createTaskResponse.json();
            throw new Error('Kesalahan saat membuat tugas: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        const createdTask = await createTaskResponse.json();
        const taskId = createdTask.id; // Ambil ID task yang baru dibuat

        // Mengunggah file PDF ke custom field 'Files' di task yang baru dibuat
        const formData = new FormData();
        formData.append('attachment', file, file.name);

        // Mengirim permintaan POST untuk mengunggah file ke ClickUp
        const uploadFileResponse = await fetch(`https://api.clickup.com/api/v2/task/${taskId}/attachment`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken
            },
            body: formData
        });

        //  ==================== Menangani pengunggahan file dan memberikan respons sesuai hasilnya. ====================
        if (uploadFileResponse.ok) {
            // Jika pengunggahan file berhasil, tampilkan pesan sukses
            alert('File berhasil diunggah dan task berhasil dibuat.');
        } else {
            // Jika pengunggahan file gagal, ambil pesan error dari respons API
            const error = await uploadFileResponse.json();
            alert('Kesalahan saat mengunggah file: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        // ==================== Menampilkan detail kesalahan di konsol. ====================
    } catch (error) {
        // Jika terjadi kesalahan umum (misalnya, kesalahan jaringan atau lainnya), tampilkan pesan kesalahan
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');

    }
});
