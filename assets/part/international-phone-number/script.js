const input = document.querySelector("#whatsapp-number");
const iti = window.intlTelInput(input, {
  initialCountry: "id",
  utilsScript:
    "./utils.js",
});

// Guard Clause untuk event form

