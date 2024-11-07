document.addEventListener("DOMContentLoaded", function () {
 
// javascript untuk handle stars di review event
  // ! Start of custom stars functions
  const stars = document.querySelectorAll(".star");
  const ratingInput = document.getElementById("inputRating");

  stars.forEach((star, index) => {
    star.addEventListener("mouseover", function () {
      resetStars();
      highlightStars(index + 1);
    });

    star.addEventListener("click", function () {
      ratingInput.value = star.getAttribute("data-value");
      highlightStars(index + 1, true);
    });

    star.addEventListener("mouseout", function () {
      resetStars(ratingInput.value);
    });
  });

  function highlightStars(count, permanent = false) {
    stars.forEach((star, index) => {
      if (index < count) {
        star.classList.add(permanent ? "selected" : "hover");
      }
    });
  }

  function resetStars(rating = 0) {
    stars.forEach((star) => {
      star.classList.remove("hover", "selected");
    });
    if (rating > 0) {
      highlightStars(rating, true);
    }
  }
  // ! End of custom stars functions
});

 // Function to close/hide an element
 const btnClose = (elementId) => {
  const element = document.getElementById(`${elementId}`);

  element.style.display = "none";
};