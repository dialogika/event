// Scroll animation
var iti;
var iti_webinar;
var iti_presensi;
var iti_senam;
var subFooterIti; //varibel untuk number di subscribe/connect now footer
document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#whatsapp-number-webinar");
  if (input) {
    iti_webinar = window.intlTelInput(input, {
      utilsScript: "./utils.js",
      separateDialCode: true,
      preferredCountries: ["id"],
      initialCountry: "id",
    });
  }

  const inputPresensi = this.documentElement.querySelector("#whatsapp-number-presensi");
  if (inputPresensi) {
    iti_presensi = window.intlTelInput(inputPresensi, {
      utilsScript: "./utils.js",
      separateDialCode: true,
      preferredCountries: ["id"],
      initialCountry: "id",
    });
  }

  const inputWASenam = document.querySelector("#whatsapp-number-senam");
  if (inputWASenam) {
    iti_senam = window.intlTelInput(inputWASenam, {
      utilsScript: "./utils.js",
      separateDialCode: true,
      preferredCountries: ["id"],
      initialCountry: "id",
    });
  }

  // varibel untuk number di subscribe/connect now footer
  const inputSubFooterWhatsapp = document.querySelector("#inputSubFooterWhatsapp");
  if (inputSubFooterWhatsapp) {
    subFooterIti = window.intlTelInput(inputSubFooterWhatsapp, {
      utilsScript: "./utils.js",
      separateDialCode: true,
      preferredCountries: ["id"],
      initialCountry: "id",
    });
  }

  document.querySelectorAll("#scroll-link").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      const offset = parseInt(this.getAttribute("data-scroll-offset")) || 0;
      const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    });
  });
});
