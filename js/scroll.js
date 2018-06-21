/**
 * @description a box with the standard size
 * @type {jQuery|HTMLElement}
 */
var $container = $('.container-scroll');

/**
 * @description accelerate the rounded animation
 * @type {number}
 */
var speed_coeff = 1.5;

/**
 * @description list of element with class square
 * @type {jQuery|HTMLElement}
 */
var $squares = $('.square');

/**
 * @description list of element with class rounded
 * @type {jQuery|HTMLElement}
 */
var $rounds = $('.rounded');

/**
 * @description Glogal var for check actual screen
 * @type {number}
 */
var screen_number = 1;

/**
 * @description Glogal var for define the maximal number of screen
 * @type {number}
 */
var screen_total = 13;

/**
 * @description fix bug with infinite scroll ?
 * @type {number}
 */
LAST_SCROLL_TOP = 0;


function animateSquares() {
  $squares.each(function(index) {
    var el = $(this);
    fixPositionAndSize(el, true);
    var start = el.data('start');
    animateSquare(el, start);
  })
}

function animateRounds() {
  $rounds.each(function(index) {
    var el = $(this);
    fixPositionAndSize(el);
    var start = el.data('start');
    var position = el.data('position');
    var delay = el.data('delay');
    delay = delay || 0;
    animateRound(el, start, position, delay);
  });
}


/**
 * @description keep the div element at the good place
 * @param $el
 * @param isSquare
 */
function fixPositionAndSize($el, isSquare) {
  isSquare = isSquare !== undefined;
  var top = isSquare
    ? $container.scrollTop() + (($container.height() - $el.find('img').height()) / 2)
    : $container.scrollTop();
  $el.css({
    'top': top,
    'height': $container.height()
  });
}

/**
 * @description check the parameter for a div with class rounded
 * @param roundElem
 * @param startScreen
 * @param direction
 * @param delay
 */
function animateRound(roundElem, startScreen, direction, delay) {
  var scrollForScreen = getScrollForScreen(startScreen);
  var v = scrollForScreen * speed_coeff;
  if (delay) {
    v = v - ($container.height() / 100) * delay;
  }
  var position = getRoundPosition(direction);
  if (screen_number >= startScreen) {
    roundElem.find('img').css({
      'clip-path': 'ellipse(' + v + 'px ' + v + 'px at ' + position + ')'
    });
  } else if (screen_number < startScreen) {
    roundElem.find('img').css({
      'clip-path': 'ellipse(' + 0 + 'px ' + 0 + 'px at ' + position + ')'
    });
  }
}

/**
 * @description check the parameter for a div with class square
 * @param squareElem
 * @param startScreen
 */
function animateSquare(squareElem, startScreen) {
  var end = squareElem.data('end');
  end = end === undefined ? true : end;
  var scrollForScreen = getScrollForScreen(startScreen);
  var percent = getPercent(scrollForScreen);
  if (screen_number >= startScreen && screen_number < startScreen + 2) {
    percent = percent / 2;
    percent = percent < 0 ? 0 : percent > 50 ? 50 : percent;
    percent = 50 - percent;
    squareElem.find('img').css({
      'clip-path': 'inset(' + percent + '% ' + percent + '% ' + percent + '% ' + percent + '% )'
    });
  } else if (screen_number === startScreen + 2 && end) {
    percent = percent - 200;
    percent = percent / 2;
    percent = percent < 0 ? 0 : percent > 50 ? 50 : percent;
    squareElem.find('img').css({
      'clip-path': 'inset(' + percent + '% ' + percent + '% ' + percent + '% ' + percent + '% )'
    });
  } else if (screen_number < startScreen || (screen_number > startScreen + 2 && end)) {
    squareElem.find('img').css({
      'clip-path': 'inset(' + 50 + '% ' + 50 + '% ' + 50 + '% ' + 50 + '% )'
    });
  } else if (startScreen + 2 && !end || screen_number < startScreen) {
    squareElem.find('img').css({
      'clip-path': 'inset(' + 0 + '% ' + 0 + '% ' + 0 + '% ' + 0 + '% )'
    });
  }
}

function checkScreenNumber() {
  return Math.floor($container.scrollTop() / $container.height()) + 1;
}

function getScrollForScreen(screen) {
  return $container.scrollTop() - ($container.height() * screen) + $container.height();
}

function getPercent(scrollForScreen) {
  return (100 * scrollForScreen - $container.height()) / $container.height();
}

function getRoundPosition(direction) {
  switch (direction) {
    case 'top-right':
      return '100% 0%';
    case 'bottom-left':
      return '0% 100%';
    case 'bottom-right':
      return '100% 100%';
    default:
      return '0% 0%';
  }
}
var $scrollTextTitle = $('#collection_txt');
var $scrollScreenDown = $('#scrollScreenDown');
$(document).ready(function() {

  launchArrowScroll();
  $container.css({
    'max-height': $('.wrapper').height() - ($('nav').height() + 10),
    'height': $('.wrapper').height() - ($('nav').height() + 10)
  });

  $('.wrapper-scroll').height($container.height() * screen_total);

  $container.scroll(function(e) {
    var scrollTop = $container.scrollTop();
    if (scrollTop >= $('.wrapper-scroll').height() - $container.height()) {
      $container.scrollTop(LAST_SCROLL_TOP);

    } else {
      LAST_SCROLL_TOP = scrollTop;
    }

    if(scrollTop > 50) {
        $scrollTextTitle.fadeOut(700);
        $scrollScreenDown.fadeOut(700);
        $arrow1.fadeOut(700);
        $arrow2.fadeOut(700);
        if(arrowScrollInterval !== undefined) {
            clearInterval(arrowScrollInterval);
            arrowScrollInterval = undefined;
        }

    } else {
        $scrollTextTitle.fadeIn(700);
        $scrollScreenDown.fadeIn(700);
        $arrow1.fadeIn(700);
        $arrow2.fadeIn(700);
        if(arrowScrollInterval === undefined) {
            launchArrowScroll();
        }
    }
    // console.log(e);
    // console.log(this);
    screen_number = checkScreenNumber();
    animateRounds();
    animateSquares();
  });
});

// top: 84vh;
var $arrow1 = $('#arrow1');
// top: 86vh;
var $arrow2 = $('#arrow2');

var arrowScrollInterval;
var momentInterval = 0;
function launchArrowScroll() {
    arrowScrollInterval = setInterval(function() {
        momentInterval += .1;
        var a1 = 73;
        var a2 = 75;
        if(momentInterval > 3) {
            momentInterval = 0;
        }
        a1 += momentInterval;
        a2 += momentInterval;

        $arrow1.css({'top': a1 + 'vh'});
        $arrow2.css({'top': a2 + 'vh'});
    }, 50);
}
