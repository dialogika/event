$(document).on('click','.send_contact', function(){
    var input_blanter = document.getElementById('names');

    /* Whatsapp Settings */
    var walink = 'https://web.whatsapp.com/send',
        phone = '6285162992597',
        walink2 = 'Halo kak saya berminat ikut workshop. Boleh *kirimkan nomor rekening* untuk kami transfer' + '%0A%0A' 
                + 'Berikut data diri saya: ',
        text_yes = 'Terkirim.',
        text_no = 'Isi semua Formulir lalu klik Send.';

    /* Smartphone Support */
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    var walink = 'whatsapp://send';
    }

    if("" != input_blanter.value){

     /* Call Input Form */
    var input_name2     = $("#names").val(),
        input_domisili2 = $("#locations").val(),
        input_job2      = $("#works").val(),
        input_cv2       = $("#cvinggris :selected").text(),
        input_mocking2  = $("#mockingint :selected").text(),
        input_total2    = $("#totalharga").val(),
        input_program2  = $("#programs :selected").text(),
        input_message2  = $("#messages").val();

    /* Final Whatsapp URL */
    var blanter_whatsapp = walink + '?phone=' + phone + '&text=' + walink2 + '%0A%0A' +
        '*Name*               : ' + input_name2 + '%0A' +
        '*Domisili*           : ' + input_domisili2 + '%0A' +
        '*Program*            : ' + input_program2 + '%0A' +
        '*Perkerjaan*         : ' + input_job2 + '%0A' +
        '*Include CV          : ' + input_cv2 + '%0A' + 
        '*Mocking Interview   : ' + input_mocking2 + '%0A' + 
        '*Total Harga         : ' + input_total2 + '%0A' +
        '*Isi Message*        : ' + input_message2 + '%0A';

    /* Whatsapp Window Open */
    window.open(blanter_whatsapp,'_blank');
    document.getElementById("text-info").innerHTML = '<span class="yes">'+text_yes+'</span>';
    } else {
    document.getElementById("text-info").innerHTML = '<span class="no">'+text_no+'</span>';
    }
});