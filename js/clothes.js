var svgNS = "http://www.w3.org/2000/svg";
var svg = document.getElementById("vector-canvas");
var currentLine;
var lastMove;
var result = {}

var step1 = "";
var step2 = "";
var front = "";
var back = "";
var frontB = "";
var backB = "";
var firstId;
var previousId = -1;

var touchStarted = false;
var touchMoved = false;
var interactive = false;

function hideOnClickOutside(selector) {
    const outsideClickListener = (event) => {
        if (!$(event.target).closest(selector).length) {
            if ($(selector).is(':visible')) {
                $(selector).hide()
                removeClickListener()
            }
        }
    }

    const removeClickListener = () => {
        document.removeEventListener('click', outsideClickListener)
    }

    document.addEventListener('click', outsideClickListener)
}

function is_touch_device() {
  return 'ontouchstart' in window;
}

// Pointer data or ontouch data
function interactionStart(interactionData) {

}

/*****************************************************************
 *
 * Event handler for touch devices
 *
 *****************************************************************/
if( is_touch_device() ){
    document.addEventListener("touchstart", function(e) {
        var clientX = e.touches[0].clientX;
        var clientY = e.touches[0].clientY;

        var firstImg = document.elementFromPoint(clientX, clientY);

        var type = firstImg.dataset.type;
        if( type && type === 'uniq'){
            e.preventDefault();
            return;
        }
    });

    document.addEventListener("touchmove", function(e) {

    });

    document.addEventListener("touchcancel", function(e) {

    });

    document.addEventListener("touchmove", function(e) {

    });
}

/*****************************************************************
 *
 * Event handler for mouse devices
 *
 *****************************************************************/

if( !is_touch_device() ){

}

/*****************************************************************
 *
 * Generic event handler for both devices types
 *
 *****************************************************************/

// -------------------- TOUCH START -----------------------
function touchStart(clientX, clientY, firstImg) {

  firstId = firstImg.dataset.id;
  // si l'element n'a pas de data-id, on termine sans commencer à tracer la ligne
  if (!firstId) {
    return;
  }
  const type = firstImg.dataset.type;

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
  currentLine = document.createElementNS(svgNS, "line");
  currentLine.setAttributeNS(null, "x1", clientX); // mouse
  currentLine.setAttributeNS(null, "y1", clientY);
  currentLine.setAttributeNS(null, "x2", clientX); // mouse
  currentLine.setAttributeNS(null, "y2", clientY);
  currentLine.setAttributeNS(null, "stroke-linecap", "round");
  currentLine.setAttributeNS(null, "stroke-width", "0");
  currentLine.setAttributeNS(null, "stroke", "black");
  svg.appendChild(currentLine);
}

// -------------------- TOUCH MOVE -----------------------

function touchMove(x, y, currentElement) {
  if (currentLine) {
    //console.log(result);
    //console.log("TOUCH MOVE");

    currentLine.setAttributeNS(null, "stroke-width", "5");
    currentLine.setAttributeNS(null, "x2", x); // mouse
    currentLine.setAttributeNS(null, "y2", y);


    if (currentElement) {
      //console.log(currentElement);
      let currentId = currentElement.dataset.id;
      //console.log(currentId);
      var col = currentElement.dataset.id && !result.hasOwnProperty(
        currentElement.dataset.type) ? "black" : "red";
      if (col == "black") {
        $("[data-id=" + currentId + "]").addClass("bordered");
      }

      if (previousId != -1 && previousId != currentId && previousId != firstId) {
        $("[data-id=" + previousId + "]").removeClass("bordered");
      }
      previousId = currentId;

      // bas + haut = OK
      // uniq va avec rien

      currentLine.setAttributeNS(null, "stroke", col);
    }
  }
}

// -------------------- TOUCH END -----------------------

function touchEnd() {
  if (previousId != -1 && previousId != firstId) {
    $("[data-id=" + previousId + "]").removeClass("bordered");
  }
  $(".selected").removeClass("selected");

  $("[data-id=" + firstId + "]").removeClass("bordered");
  // console.log(e);
  if (currentLine) {
    const currentElement = document.elementFromPoint(lastMove.touches[0].clientX, lastMove.touches[0].clientY);
      //console.log(currentElement);

    svg.removeChild(currentLine);
    currentLine = null;
    var combinaison = null;
    if (currentElement.dataset.id && !result.hasOwnProperty(currentElement.dataset.type)) {
      result[currentElement.dataset.type] = currentElement.dataset.id;
      //console.log("img combo")
      // ---------------- img combo ----------------
      combinaison = "combo" + result['haut'] + result['bas'];
      combinaisonReverse = "combo" + result['haut'] + result['bas'] + "_reverse";
      // alert("combinaison " + combinaison);

      document.getElementById("combo").style.display = 'block';
      //$('#combo').show();

      front = "img_comb/" + combinaison.toString() + ".jpg";
      back = "img_comb_reverse/" + combinaisonReverse.toString() + ".jpg";

      step1 = back;
      step2 = front;

      rotation = 5;
      requestAnimationFrame(animate);
      // Set next page images
      document.getElementById("orderTop").src = "img_vet/" + result["haut"] + ".jpg";
      document.getElementById("orderBottom").src = "img_vet/" + result["bas"] + ".jpg";
      result = {};

    } else {
      // alert("combinaison impossible");
    }
  }
}
/*
document.addEventListener("touchstart", function(e) {
  touchStarted = true;

    var firstImg = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);

    var type = firstImg.dataset.type;
    if( type && type === 'uniq'){
        e.preventDefault();
        return;
    }

  //console.log("TOUCH START");
  result = {};
  // --------- variable avec la référence de la première image --------------

  let clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let clientY = e.touches ? e.touches[0].clientY : e.clientY;
  //console.log(firstImg);
  console.log(firstImg.className);
  if (firstImg.className == "interactive") {
    touchStart(clientX, clientY, firstImg);
    interactive = true;
  }

}, false);

document.addEventListener("touchmove", function(e) {
  touchMoved = true;
  if (interactive) {
    lastMove = e;
    var x = e.touches ? e.touches[0].clientX : e.clientX;
    var y = e.touches ? e.touches[0].clientY : e.clientY;
    let currentElement = document.elementFromPoint(e.touches[0].pageX,
      e.touches[0].pageY);
    touchMove(x, y, currentElement);
  }
}, false);

document.addEventListener("touchcancel", function(e) {
  touchStarted = false;
  touchMoved = false;
  //console.log("TOUCH cancelled");
  if (previousId != -1 && previousId != firstId) {
    $("[data-id=" + previousId + "]").removeClass("bordered");
  }

  // cleaup
  svg.removeChild(currentLine);
  currentLine = null;
  interactive = false;
})

document.addEventListener("touchend", function(e) {
  if (touchStarted) {
    if (!touchMoved) {
      console.log("Normal touch");

      if (interactive) {

        console.log("Open Image");
        frontB = "img_vet_full/" + firstId + ".jpg";
        backB = "img_vet_full_reverse/" + firstId + ".jpg";

        step1b = back;
        step2b = front;

        rotation = 5;
        requestAnimationFrame(animate);
        document.getElementById("imgVet").src = "img_vet_full/" + firstId + ".jpg";
        document.getElementById("piece").style.visibility = "visible";
        hideOnClickOutside(document.getElementById("piece"));
        result = {};

      }

    } else {
      // console.log("Interactive touch");
    }
  }
  touchStarted = false;
  touchMoved = false;
  console.log("TOUCH END");
  if (interactive) {
    touchEnd();
  }
  interactive = false;

}, false);*/

var maxRotation = 180;
var rotation = 0;

function animate() {
  if (rotation == 0) {
    document.getElementById("combo-img").src = step1;
    document.getElementById("imgVet").src = step1;

  }

  if (rotation == 90) {
    document.getElementById("combo-img").src = step2;
    document.getElementById("buy").style.transform = 'rotate3d(0,1,0,180deg)';

    document.getElementById("imgVet").src = step2;
    document.getElementById("buy").style.transform = 'rotate3d(0,1,0,180deg)';
  }

  if (rotation < maxRotation) {
    rotation += 5;
    document.getElementById("combo").style.transform = 'rotate3d(0,1,0,' + rotation + 'deg)';
    document.getElementById("piece").style.transform = 'rotate3d(0,1,0,' + rotation + 'deg)';
    setTimeout(animate, 5);
  }
}

// Open the complete clothe
function openClothe(){

}

// Open the order form
function openOrderForm() {
  result = {};
  $("#orderForm").show();
}



