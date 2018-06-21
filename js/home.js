$(document).ready(function() {

  //initialize swiper when document ready
  var mySwiper = new Swiper('.swiper-container', {
    direction: 'vertical',
    loop: true,
    effect: 'cube',
    grabCursor: true,
    cubeEffect: {
      shadow: true,
      slideShadows: true,
      shadowOffset: 20,
      shadowScale: 0.94,
    },
  })
});
