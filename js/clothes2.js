//$(function() {

var svgNS = "http://www.w3.org/2000/svg";
var svg = document.getElementById("vector-canvas");

var firstId;
var previousId;
var result = {};
var selectLine;

var maxRotation = 180;
var rotation = 0;
var maxRotationSelection = 360;
var rotationSel = 0;

var Swiperr;

var touchstart = false;
var touchmove = false;

/*****************************************************************
 *
 * Utilities functions
 *
 *****************************************************************/

function resetState() {
  ////console.log("resetState");
  firstId = undefined;
  previousId = undefined;
  result = {};
}

function hideOnClickOutside(selector) {
  var outsideClickListener = function(event) {
    //if (!$(event.target).closest(selector).length) {
    //if ($(selector).is(':visible')) {
    $(selector).hide();
    if (!$(".orderForm").is(':visible')) {
      $(".selection-container").show();
    }
    resetState();
    removeClickListener();
  //}
  //}
  }

  // var outsideClickListener = function(event) {
  //   $(selector).hide();
  //   if (!$("#sent").is(':visible')) {
  //     $(".selection-container").show();
  //   }
  //   resetState();
  //   removeClickListener();
  // }

  var removeClickListener = function() {
    resetState();
    document.removeEventListener('click', outsideClickListener)
  }

  document.addEventListener('click', outsideClickListener)
}

function is_touch_device() {
  return 'ontouchstart' in window;
}

/*****************************************************************
 *
 * Event handler for touch devices
 *
 *****************************************************************/

var delta = 0;
var x = 0;
var lX = 0;
var y = 0;
var ly = 0;

$(".interactive").on("touchstart", function(e) {
  //console.log("TOUCHSTART .interactive");
  // console.log("Mobile : touchstart")

  var clientX = e.originalEvent.touches[0].clientX;
  var clientY = e.originalEvent.touches[0].clientY;

  x = clientX;
  y = clientY;
  lX = clientX;
  lY = clientY;
  delta = 0;

  selectStart(clientX, clientY);
  e.preventDefault(); //dsesactive le scroll move par défaut du mobile

});

$(".interactive").on("touchmove", function(e) {

  //console.log("touchmove .interactive");
  // console.log("Mobile : touchmove")
  var clientX = e.originalEvent.touches[0].clientX;
  var clientY = e.originalEvent.touches[0].clientY;

  // Check that the user move enough to trigger selectMove (pour chequer zone de touch pour ouvrir l'image)
  x = clientX;
  y = clientY;

  delta += Math.sqrt(Math.pow(x - lX, 2) + Math.pow(y - lY, 2));

  lX = x;
  lY = y;

  if (delta > 60) {
    selectMove(clientX, clientY);
  }
  // CHECK ICI SI C'EST MOBILE ET FAIT CA SINON FAIT PAS
  if (isMobile()) {
    e.preventDefault();
  }

});

$(".interactive").on("touchcancel", function(e) {
  //console.log("touchcancel .interactive");

  if (selectLine) {
    svg.removeChild(selectLine);
    selectLine = null;
  }
});

$(".interactive").on("touchend", function(e) {

  // console.log("Mobile : touchend")

  selectEnd(document.elementFromPoint(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY));
});

document.addEventListener("touchend", function(e) {}, false);

/*****************************************************************
 *
 * Event handler for mouse devices
 *
 *****************************************************************/

var mouseDowned = false;
$(".interactive").on("mousedown", function(e) {
  //console.log("Desktop : mousedown")
  mouseDowned = true;
  var clientX = e.clientX;
  var clientY = e.clientY;
  selectStart(clientX, clientY);

});

$(".interactive").on("mousemove", function(e) {

  if (mouseDowned) {
    //console.log("Desktop : mousemove")
    var clientX = e.clientX;
    var clientY = e.clientY;
    selectMove(clientX, clientY);
  }


});
$(".interactive").on("mouseup", function(e) {
  //console.log("Desktop : mouseup")
  var clientX = e.clientX;
  var clientY = e.clientY;
  //selectEnd(clientX, clientY);
  mouseDowned = false;
  selectEnd(document.elementFromPoint(e.clientX, e.clientY));

});

/*****************************************************************
 *
 * Generic event handler for both devices types
 *
 *****************************************************************/

// Called when touch or mouse start
function selectStart(clientX, clientY) {
  //console.log("Select start");
  touchstart = true;
  resetState();

  var firstImg = document.elementFromPoint(clientX, clientY);
  if (!firstImg.classList.contains("interactive")) {
    return;
  }

  firstId = firstImg.dataset.id;

  var type = firstImg.dataset.type;
  // Not a good element or "uniq" for women
  if (!firstId || !type) {
    return;
  }

  if (type === "uniq") {
    result["uniq"] = firstId;
    displayClothe();
    return;
  }

  $("[data-type=" + type + "]").addClass("selected");
  $("[data-id=" + firstId + "]").addClass("bordered");

  if (type == "haut" || type == "bas") {
    $("[data-id=" + firstId + "]").removeClass("selected");
    $("[data-type=uniq]").addClass("selected");

  } else {
    $("[data-type=haut]").addClass("selected");
    $("[data-type=bas]").addClass("selected");
  }

  result[firstImg.dataset.type] = firstImg.dataset.id;
  selectLine = document.createElementNS(svgNS, "line");
  selectLine.setAttributeNS(null, "x1", clientX); // mouse
  selectLine.setAttributeNS(null, "y1", clientY);
  selectLine.setAttributeNS(null, "x2", clientX); // mouse
  selectLine.setAttributeNS(null, "y2", clientY);
  selectLine.setAttributeNS(null, "stroke-linecap", "round");
  selectLine.setAttributeNS(null, "stroke-width", "0");
  selectLine.setAttributeNS(null, "stroke", "black");
  svg.appendChild(selectLine);
}

// Called when move (mouse or touch)
function selectMove(x, y) {
  touchmove = true;
  //console.log("selectmove");
  if (selectLine) { // Draw only if selectLine already exists
    $(".box").hide();

    selectLine.setAttributeNS(null, "stroke-width", "5");
    selectLine.setAttributeNS(null, "x2", x);
    selectLine.setAttributeNS(null, "y2", y);

    var currentElement = document.elementFromPoint(x, y);

    if (currentElement) {
      var currentId = currentElement.dataset.id;
      var col = currentElement.dataset.id && !result.hasOwnProperty(
        currentElement.dataset.type) ? "black" : "#D3D3D3";
      if (col == "black") {
        $("[data-id=" + currentId + "]").addClass("bordered");
      }

      if (previousId != -1 && previousId != currentId && previousId != firstId) {
        $("[data-id=" + previousId + "]").removeClass("bordered");
      }
      previousId = currentId;
      selectLine.setAttributeNS(null, "stroke", col);
    }
  }
}

function selectEnd(currentElement) {
  // console.log("selectEnd");

  if (touchstart) {
    if (!touchmove) {
      $(".box").hide();

      console.log("Normal touch");
      if (previousId != -1 && previousId != firstId) {

        $("[data-id=" + previousId + "]").removeClass("bordered");
      }
      $(".selected").removeClass("selected");

      $("[data-id=" + firstId + "]").removeClass("bordered");
      displayClotheSimple();

    } else {
      // console.log("Interactive touch");

      //console.log("selectEnd");
      if (!firstId || !currentElement.classList.contains("interactive")) {

        return;
      }

      if (previousId != -1 && previousId != firstId) {

        $("[data-id=" + previousId + "]").removeClass("bordered");
      }
      $(".selected").removeClass("selected");

      $("[data-id=" + firstId + "]").removeClass("bordered");

      if (currentElement.dataset.id && !result.hasOwnProperty(currentElement.dataset.type)) {

        result[currentElement.dataset.type] = currentElement.dataset.id;
        displayClothe();
      } else {
        // alert("combinaison impossible");
      }

      if (selectLine) {
        // Remove selection line
        svg.removeChild(selectLine);
        selectLine = null;
      }
    }
  }
  touchstart = false;
  touchmove = false;
  //console.log("TOUCH END");

/*___________________*/
}

function displayClotheSimple() {

  //console.log("Normal touch");
  // console.log("Open Image   " + firstId);

  var goodside = "img_vet_full/" + firstId + ".jpg";
  var reversedside = "img_vet_full_reverse/" + firstId + "_reverse.jpg";

  document.getElementById("combo-img").src = goodside;
  document.getElementById("combo-img-reverse").src = reversedside;

  document.getElementById("combo").style.display = "block";

  rotation = 0;
  requestAnimationFrame(function() {
    animateCombo(goodside, reversedside);
  });

}

function displayClothe() {

  //console.log("displayClothe, " + result);
  var isUniq = result.hasOwnProperty('uniq');
  var comboName = isUniq ? result['uniq'] : "combo" + result['haut'] + result['bas'];
  var comboNameReverse = comboName + "_reverse";

  document.getElementById("combo").style.display = "block";
  //console.log(document.getElementById("combo").style.display);

  var goodside = (isUniq ? "img_vet_full/" : "img_comb/") + comboName + ".jpg";
  var reversedside = (isUniq ? "img_vet_full_reverse/" : "img_comb_reverse/") + comboNameReverse + ".jpg";

  document.getElementById("combo-img").src = goodside;
  document.getElementById("combo-img-reverse").src = reversedside;

  rotation = 0;
  requestAnimationFrame(function() {

    animateCombo(goodside, reversedside);
  });

//hideOnClickOutside("#combo");
}

// var elButtonBuy = document.querySelector("#buy");
// elButtonBuy.addEventListener('click', displayOrderForm);

$('#buy').click(function() {
  displayOrderForm();
})
$('#backButton').click(function() {
  displayBack();
})
$('.item1, .item2, .item3, .item4').click(function() {
  // console.log("click back");
  displayBack();
})

function displayOrderForm() {
  //console.log("displayClothe, " + result);
  $(".selection-container").hide();
  var isUniq = result.hasOwnProperty('uniq');
  $("#combo").hide();
  $("#orderBottom").hide();

  $("#orderTop").attr("src", "img_vet/" + result[isUniq ? 'uniq' : 'haut'] + ".jpg");
  if (!isUniq) {
    $("#orderBottom").attr("src", "img_vet/" + result['bas'] + ".jpg");
    $("#orderBottom").show();
  }

  $("#topImage").val(getImageAsBase64("orderTop"));
  $("#bottomImage").val(getImageAsBase64("orderBottom"));

  $("#orderForm").show();
}

function displayBack() {
  $(".selection-container").show();
  $("#orderForm").hide();
  $("#combo").hide();
}

function displayMessageSent() {
  $(".sentMessage").show();
}

var closeButton = document.querySelector("#backButton");
closeButton.addEventListener('click', displayBack);


function getImageAsBase64(imageId) {
  var c = document.createElement('canvas');
  var img = document.getElementById(imageId);
  c.height = img.naturalHeight;
  c.width = img.naturalWidth;
  var ctx = c.getContext('2d');

  ctx.drawImage(img, 0, 0, c.width, c.height, 0, 0, c.width, c.height);
  return c.toDataURL();
}

function sendOrderForm() {
  $("#orderForm").hide();

  try {
    //emailjs.sendForm('gmail', 'formulaire', document.forms["formulaire_contact"]);

  } catch (Error) {}

  resetState();

  $("#selection-container").show();
}

function validateForm() {
  var form = document.forms["formulaire_contact"];
  var valid = true;
  // Validate name
  $('#name').removeClass('error');
  var name = form['name'];
  if (name.value == '') {
    valid = false;
    $('#name').addClass('error');
  }

  // Validate email
  $('#email').removeClass('error');
  var email = form['email'];
  if (!validateEmail(email.value)) {
    valid = false;
    $('#email').addClass('error');
  }

  // Validate message
  $('#message').removeClass('error');
  var message = form['message'];
  if (message.value.length < 10) {
    valid = false;
    $('#message').addClass('error');
  }

  $('#submitButton').attr('disabled', !valid);
  $('#sentButton').attr('disabled', !valid);

}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function animateCombo(step2, step1) {
  //console.log("debug");

  Swiperr = new Swiper('.swiper-container-combo', {
    direction: 'horizontal',
    effect: 'flip',
    loop: true,
    grabCursor: true,
    flipEffect: {
      rotate: 30,
      slideShadows: false,
    },
  })

  document.getElementById("buy").style.visibility = "hidden";
  document.getElementById("backButton").style.visibility = "block";

  // document.getElementById("backButton").style.visibility = "hidden";

  if (rotation == 0) {
    //console.log("replace first image");

    document.getElementById("combo-img").src = step1;
  ////console.log(document.getElementById("combo-img").src);
  }

  if (rotation == 90) {
    //console.log("replace second image");
    document.getElementById("combo-img").src = step2;
    ////console.log(document.getElementById("combo-img").src);
    document.getElementById("buy").style.transform = 'rotate3d(0,1,0,180deg)';
  }

  if (rotation < maxRotation) {
    ////console.log("animate");
    rotation += 5;
    document.getElementById("combo").style.transform = 'rotate3d(0,1,0,' + rotation + 'deg)';
    setTimeout(function() {
      animateCombo(step1, step2);
    }, 5); //5
  } else {
    document.getElementById("buy").style.visibility = "visible";

    var elements = document.getElementsByClassName("combo-img");
    ////console.log("elements");

    elements[0].src = step2;
    if (elements.length == 2) {
      ////console.log(elements[1]);
      elements[1].src = step2;

    }

    var elementsreversed = $('.combo-img-reverse');
    var elementsreversed = document.getElementsByClassName("combo-img-reverse");

    ////console.log(step2);
    elementsreversed[0].src = step1;
    //elementsreversed[1].src = step2;

    if (elementsreversed.length == 2) {
      ////console.log(elementsreversed[1]);
      elementsreversed[1].src = step1;

    }
  }
}


function isMobile() {
  var check = false;
  (function(a) {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
}
;
//});
