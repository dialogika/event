document.addEventListener('DOMContentLoaded', () => {
    
    const buttonLink = document.querySelector('.button__link');
    const buttonLinkYellow = document.querySelector('.button__linkyellow');
  
    
    buttonLink.addEventListener('mouseenter', () => {
      buttonLinkYellow.style.backgroundColor = '#FFFFFF'; 
    });
  
    
    buttonLink.addEventListener('mouseleave', () => {
      buttonLinkYellow.style.backgroundColor = '#F6B12B'; 
    });
  });