// Scroll animation
var iti;
document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#whatsapp-number");
  iti = window.intlTelInput(input, {
    initialCountry: "id",
    utilsScript: "./utils.js",
  });
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
