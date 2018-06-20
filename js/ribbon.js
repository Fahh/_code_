var scrollPos = 0;
var vidTime = 0;
var tmptime = 0;
var timeupdated = true;
var lastYpos = 0;
var currentVideoIndex = 0;
var directionUp = false;

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
setVideoSources(vid, videos[currentVideoIndex]);
// vid.addEventListener('ended',videoEnded,false);

function videoEnded(event) {
  console.log(event);
  currentVideoIndex++; // QUAND ON va a droite
  currentVideoIndex--; // Quand on va a gauche

  if (currentVideoIndex == 3) {
    currentVideoIndex = 0;
  }
  setVideoSources(vid, videos[currentVideoIndex]);
}

$(document).ready(function() {
  var prev = $(".prev");
  var next = $(".next");
  var showNext = $("currentVideoIndex++");
  prev.on('click', function() {
    saying.toggleClass('hidden');
  });
  next.on('click', function() {
    showNext.toggleClass('hidden');
  });
});

$(document).ready(function() {
  $('ribbon-container').click(function(event) {
    event.preventDefault();
    $(this).hide("slow");
  });
});


vid.addEventListener("timeupdate", function() {
  timeupdated = true;
}, false);

function updatevid(dists) {

  setTimeout(function() {
    if (timeupdated) {
      timeupdated = false;
      tmptime = tmptime + dists;
      if (tmptime < 0) {
        tmptime = 0;
      }
      if (tmptime > 3) {
        tmptime = 3;
      }
      //console.log(tmptime);
      vid.currentTime = tmptime;
    }
  }, 1000);
}

document.addEventListener('touchmove', function(event) {
  //console.log(event);
  if (lastYpos != event.targetTouches[0].pageY) {
    // console.log("lkhsdflkhskjdhfkjsdf");
    //console.log((lastYpos - event.targetTouches[0].pageY));
    updatevid((lastYpos - event.targetTouches[0].pageY) / 100);
    lastYpos = event.targetTouches[0].pageY;
  }

  return false;
}, false);

document.addEventListener('touchstart', function(event) {
  // console.log(event);
  lastYpos = event.targetTouches[0].pageY;

  return false;
}, false);


function map(num, in_min, in_max, out_min, out_max) {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
