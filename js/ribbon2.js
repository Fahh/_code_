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
];

$videos = $('.video');

function setVideoSources(videoElement, source) {
    console.log("set video " + source);
    var sources = videoElement.getElementsByTagName('source');
    sources[0].src = source + '.mp4';
    // sources[1].src = source + '.ogv';
    videoElement.load();
}

$(document).ready(function () {
    $('ribbon-container').click(function (event) {
        event.preventDefault();
        // $(this).hide("slow");
        $(this).fadeTo("slow", 0);
    });

});


var currentPosition = 0;
INDEX = 0;


function updatevid(mapVideoPositon) {
    if (timeupdated) {
        timeupdated = false;
        // tmptime = tmptime + dists;
        if (tmptime <= 0) {
            tmptime = 0;
        }
        if (tmptime > 3) {

            tmptime = 3;
        }
        console.group('info video');
        console.log($videos[INDEX]);
        console.log($videos[INDEX].currentTime);
        console.log(mapVideoPositon);
        $videos[INDEX].currentTime = mapVideoPositon;
        console.log($videos[INDEX].currentTime);
        console.groupEnd();
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
        interval = setInterval(function () {
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

document.addEventListener('mousewheel', function (event) {
    // console.log(event);
    updatevid(/*event.movementY  / 100 ,*/ mapVideoPositon)

    return false;
}, false);

var topPosition;
var maxPosition;
var mapVideoPositon = 0;

IS_IN_ANIMATION = false;
$slider_container = $('#slider-container');
var hammerDoc = new Hammer.Manager(document);


var panl = new Hammer.Pan({
    event: 'panl',
    direction: Hammer.DIRECTION_LEFT
});
var panr = new Hammer.Pan({
    event: 'panr',
    direction: Hammer.DIRECTION_RIGHT
});
var vertical = new Hammer.Pan({
    event: 'panv',
    direction: Hammer.DIRECTION_VERTICAL
});
// vertical.requireFailure([panl, panr]);
// panl.requireFailure(vertical);
// panr.requireFailure(vertical);

hammerDoc.add([vertical, panl, panr]);

// hammerDoc.get('pan').set({threshold: 10});


// $videos.on('touchmove', checkPosition);
$videos.on('timeupdate', function () {
    timeupdated = true;
});
// vid.addEventListener("timeupdate", function() {
//     timeupdated = true;
// }, false);

function checkPosition(e) {
    console.log('panup pandown');
    console.log(e);
    if (event.targetTouches && event.targetTouches[0].pageY) {
        topPosition = event.targetTouches[0].pageY;
    } else {
        topPosition = e.center.y;
    }
    console.log(topPosition);
    maxPosition = 640;
    mapVideoPositon = topPosition.map(0, maxPosition, 0, 3);

    if (lastYpos !== topPosition) {
        updatevid(/*(lastYpos - event.targetTouches[0].pageY) / 50, */ mapVideoPositon);
        lastYpos = topPosition;
    }
    // return false;
}


// document.addEventListener('touchstart', function (event) {
//     // console.log(event);
//     lastYpos = event.targetTouches[0].pageY;
//
//     return false;
// }, false);

Number.prototype.map = function (in_min, in_max, out_min, out_max) {
    return (this - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
};
// function map(num, in_min, in_max, out_min, out_max) {
//   return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
// }


function checkPanL(e) {
    if (INDEX >= 3 || IS_IN_ANIMATION) {
        return;
    }
    console.log($slider_container);
    var w = $('.ribbon-container').width();
    var left = parseInt($slider_container.css('left'));
    IS_IN_ANIMATION = true;
    // $slider_container.css('left', w * (INDEX + 1));

    $slider_container
        .animate(
            {'left': (w * (INDEX + 1)) * -1},
            1000,
            function () {
                console.log('callBack right');
                INDEX++;
                IS_IN_ANIMATION = false;
            });
}

function checkPanR(e) {
    if (INDEX <= 0 || IS_IN_ANIMATION) {
        return;
    }
    IS_IN_ANIMATION = true;
    var w = $('.ribbon-container').width();
    $slider_container
        .animate(
            {'left': (w * (INDEX - 1)) * -1},
            1000,
            function () {
                INDEX--;
                console.log('callBack left');
                IS_IN_ANIMATION = false;
            });
}