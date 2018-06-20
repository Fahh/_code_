var scrollPos = 0;
var vidTime = 0;
var tmptime = 0;
var timeupdated = true;
var lastYpos = 0;

// var goUp = true;
// var end = null;
// var interval = null;

var videos = [
  "vids/violet",
  "vids/composition2",
  "vids/complet_rouge",
  "vids/complet_jeans"
]

function setVideoSources(videoElement, source) {
  console.log("set video " + source);
  var sources = videoElement.getElementsByTagName('source');
  sources[0].src = source + '.mp4';
  sources[1].src = source + '.ogv';
  videoElement.load();
}

var vid = document.getElementById("myVideo");
$(document).ready(function() {
  $('ribbon-container').click(function(event) {
    event.preventDefault();
    // $(this).hide("slow");
    $(this).fadeTo("slow", 0);

  });

});
vid.addEventListener("timeupdate", function() {
  timeupdated = true;
}, false);

var currentPosition = 0;
function updatevid( /*dists,*/ mapVideoPositon) {
  if (timeupdated) {
    timeupdated = false;
    // tmptime = tmptime + dists;
    if (tmptime <= 0) {
      tmptime = 0;
    }
    if (tmptime > 3) {

      tmptime = 3;
    }
    vid.currentTime = mapVideoPositon;
  }
}

function handle(delta) {
  var animationInterval = 20; //lower is faster
  var scrollSpeed = 20; //lower is faster

  if (end == null) {
    end = $(window).scrollTop();
  }
  end -= 20 * delta;
  goUp = delta > 0;

  if (interval == null) {
    interval = setInterval(function() {
      var scrollTop = $(window).scrollTop();
      var step = Math.round((end - scrollTop) / scrollSpeed);
      if (scrollTop <= 0 ||
        scrollTop >= $(window).prop("scrollHeight") - $(window).height() ||
        goUp && step > -1 ||
        !goUp && step < 1) {
        clearInterval(interval);
        interval = null;
        end = null;
      }
      $(window).scrollTop(scrollTop + step);
    }, animationInterval);
  }
}

document.addEventListener('mousewheel', function(event) {
  // console.log(event);
  updatevid( /*event.movementY  / 100 ,*/ mapVideoPositon)

  return false;
}, false);


var topPosition;
var maxPosition;
var mapVideoPositon = 0;
document.addEventListener('touchmove', function(event) {

  topPosition = event.targetTouches[0].pageY;
  maxPosition = 640;
  mapVideoPositon = topPosition.map(0, maxPosition, 0, 3)


  if (lastYpos != event.targetTouches[0].pageY) {
    updatevid( /*(lastYpos - event.targetTouches[0].pageY) / 50, */ mapVideoPositon);
    lastYpos = event.targetTouches[0].pageY;
  }

  return false;
}, false);


document.addEventListener('touchstart', function(event) {
  // console.log(event);
  lastYpos = event.targetTouches[0].pageY;

  return false;
}, false);

Number.prototype.map = function(in_min, in_max, out_min, out_max) {
  return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
// function map(num, in_min, in_max, out_min, out_max) {
//   return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
// }
