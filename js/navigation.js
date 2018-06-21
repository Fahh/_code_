(function($) {

  $('#scrollTop').click(function() {
    var $el = $(this);
    $('.container-scroll').scrollTop(0)
  })
  $('nav li').click(function() {
    var $el = $(this);
    $el.addClass('active').siblings('li').removeClass('active');
    $('section:nth-of-type(' + $el.data('rel') + ')')
      .stop().fadeIn(400, 'linear')
      .siblings('section')
      .stop().fadeOut(0, 'linear');
      // 'linear').siblings('section').stop().fadeOut(400, 'linear');

    var isPlay = $el.hasClass('item2');

    if (isPlay) {
      // hammerDoc.on('panv', checkPosition); --> laisser sur desktop / commenter phone
      hammerDoc.on('panl', checkPanL);
      hammerDoc.on('panr', checkPanR);
    } else {
      hammerDoc.off('panv');
      hammerDoc.off('panl');
      hammerDoc.off('panr');
    }
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
