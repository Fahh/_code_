
(function($) {
  $('nav li').click(function() {
    $(this).addClass('active').siblings('li').removeClass('active');
    $('section:nth-of-type(' + $(this).data('rel') + ')').stop().fadeIn(400, 'linear').siblings('section').stop().fadeOut(0, 'linear');
  // 'linear').siblings('section').stop().fadeOut(400, 'linear');
  });
})(jQuery);




// Button switch grille homme / femme dans clothes
document.getElementById('combo').addEventListener("click", deleCircle);

function deleCircle() {
  document.getElementById('combo').style.display = 'none';
}

$(document).ready(function() {
  $("#hommeButton").click(function() {
    if ($("#grid-homme").toggle()) {
      $(".one").animate();
      $("#grid-homme").show()
      $("#grid-femme").hide()
      $("#grid-homme").addClass("activeButton");

    } else if ($("#grid-femme").toggle()) {
      $("#grid-homme").show()
    }
  });

  $("#femmeButton").click(function() {
    if ($("#grid-femme").toggle()) {
      $("#grid-femme").show()
      $("#grid-homme").hide()
      $("#grid-femme").addClass("activeButton");

    } else if ($("#grid-femme").toggle()) {
      $("#grid-homme").show()
    }
  });
});
