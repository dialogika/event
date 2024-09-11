document.getElementById('uploadForm').addEventListener('submit', async function (event) {
    // Mencegah submit default
    event.preventDefault();

    // Mengambil referensi elemen form dan input
    const taskName = document.getElementById('taskName').value.trim(); // Ambil nama tugas
    let price = document.getElementById('price').value.trim(); // Ambil harga (price)

    // Validasi input untuk nama tugas dan harga
    if (!taskName || !price) {
        alert('Nama tugas dan harga harus diisi.');
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

    // Format harga menjadi IDR untuk tampilan
    const formattedPrice = parsedPrice.toLocaleString('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });

    // API Token dan List ID ClickUp
    const apiToken = 'pk_3640079_B56O8X0HW6FAEIZJFFJAQW99IAHQMF8N';
    const listId = '901602772763'; // Ganti dengan ID list ClickUp yang sesuai

    try {
        // Membuat task baru di ClickUp dengan nama tugas dan custom field price
        const createTaskResponse = await fetch(`https://api.clickup.com/api/v2/list/${listId}/task`, {
            method: 'POST',
            headers: {
                'Authorization': apiToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: taskName, // Nama tugas yang diambil dari input
                description: 'Task dengan field price',
                custom_fields: [
                    { 
                        id: 'c402e41b-8013-4383-aa3d-f87e78322adc', // ID custom field untuk Price
                        value: parsedPrice // Mengirim harga sebagai float
                    }
                ]
            })
        });

        // Periksa apakah request berhasil
        if (!createTaskResponse.ok) {
            const error = await createTaskResponse.json();
            throw new Error('Kesalahan saat membuat tugas: ' + (error.err || 'Kesalahan tidak diketahui'));
        }

        alert(`Tugas berhasil dibuat dengan harga ${formattedPrice}.`);

    } catch (error) {
        console.error('Kesalahan:', error);
        alert('Terjadi kesalahan saat membuat tugas. Silakan coba lagi.');
    }
});
