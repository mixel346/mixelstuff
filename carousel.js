document.addEventListener('DOMContentLoaded', () => {
  const carouselItems = document.querySelectorAll('.image-carousel-item');
  let currentIndex = 0;

  function showNextItem() {
    carouselItems[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % carouselItems.length;
    carouselItems[currentIndex].classList.add('active');
  }

  // Change slide every 5 seconds
  setInterval(showNextItem, 5000);
});