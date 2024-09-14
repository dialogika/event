const input = document.querySelector("#whatsapp-number");
const iti = window.intlTelInput(input, {
  initialCountry: "id",
  utilsScript: "./utils.js",
});

// Guard Clause untuk event form

// Scroll animation
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("#scroll-link").forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      const offset = parseInt(this.getAttribute("data-scroll-offset")) || 0;
      const elementPosition =
        targetElement.getBoundingClientRect().top + window.pageYOffset;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    });
  });
});
