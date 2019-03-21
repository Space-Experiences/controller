var rotateAmount = 0;

function rotateScreen() {
    rotateAmount -= 90;
    TweenMax.set('body', {
        rotation: rotateAmount
    })
}

var loadingOverlayElement = $('.screen[data-name="loading"]');
var classControls = $('.portal-live-controls');
var mainElement = $('.main');
var climateCardShowing = false; // Climate card popup
var $params = {
    transition: {
        in: .2,
        out: .15
    },
}; // global params
var screenArray = ['loading']; // push screen names as they appears
var currentScreen = 'home';
function loadingOverlay(command) {
    if (command) {
        TweenMax.to(loadingOverlayElement, $params.transition.in, {
            opacity: 1,
            pointerEvents: "all",
            ease: Expo.easeIn
        });
    }
    if (command == false) {
        TweenMax.to(loadingOverlayElement, $params.transition.in, {
            opacity: 0,
            pointerEvents: "none"
        });
    }
}

function toggleClassControls(command) {
    if (command) {
        TweenMax.to(classControls, $params.transition.in, {
            y: 0,
            opacity: 1,
            pointerEvents: "all",
            ease: Expo.easeIn,
            onStart: function() {
                $(classControls).show();
            }
        });
    }
    if (command == false) {
        TweenMax.to(classControls, $params.transition.in, {
            y: 20,
            opacity: 0,
            pointerEvents: "none"
        });
    }
}
toggleClassControls(false);

function setClassControls(type = 'hide') {
    if (type == 'showStart') {
        $('#pause-class-btn').hide();
        $('#start-class-btn').show();
        $('#start-delay-btn').show();
        $('#start-class-btn').text('Start');
    }
    if (type == 'showPause') {
        $('#pause-class-btn').show();
        $('#start-class-btn').hide();
        $('#start-delay-btn').hide();
        $('#start-class-btn').text('Resume');
    }
}


function toggleNavigation(command) {
    if (command) {
        $('.main').addClass('nav-enabled');
    } else {
        $('.main').removeClass('nav-enabled');
    }
}

var appBarTitle = $('.top-app-bar-title');
var appBarBackButton = $('#top-app-btn-back');
var appBarTitleHistory = []; // Store navigation for titles.
var appBarTitleButtons = {
    showing: false,
    button: false
};


function changeTopAppBarText(text, button = false) {
    let tl = new TimelineMax({});
    tl.to(appBarTitle, .15, {
        opacity: 0,
        x: 10,
        ease: Expo.easeIn
    });
    tl.add(function() {
        $(appBarTitle).text(text);
    })
    tl.to(appBarTitle, .25, {
        opacity: 1,
        x: 1,
        ease: Expo.easeOut
    });

    if (button) {
        if (button == 'back') {
            console.log('show back button');
            TweenMax.set(appBarBackButton, {
                clearProps: "all"
            });
            $(appBarBackButton).show();
            TweenMax.from(appBarBackButton, .15, {
                scale: 0,
                ease: Back.easeOut
            });
            appBarTitleButtons.showing = true;
            appBarTitleButtons.button = appBarBackButton;
        }
    } else {
        if (appBarTitleButtons.showing == true) {
            let tl = new TimelineMax({});
            tl.to(appBarTitleButtons.button, .15, {
                scale: 0
            });
            tl.add(function() {
                if (appBarTitleButtons.button !== false) {
                    TweenMax.set(appBarTitleButtons.button, {
                        clearProps: "all"
                    });
                    $(appBarTitleButtons.button).hide();
                }
                appBarTitleButtons.button = false;
                appBarTitleButtons.showing = false;
            });
        }
    }

    appBarTitleHistory.unshift(text);

}

function showScreen(screenName, topAppTitle = false) {
    if (screenName != screenArray[0]) {

        var newScreen = $('.screen[data-name="' + screenName + '"]');
        var oldScreen = $('.screen.disabled.enabled');

        TweenMax.to(newScreen, $params.transition.in, {
            opacity: 1,
            pointerEvents: "auto",
            ease: Expo.easeIn,
            onStart: function() {
                screenChangeTransition(screenName); // Do any transitions if they exist.
            }
        });
        TweenMax.to(oldScreen, $params.transition.out, {
            className: "-=enabled",
            opacity: 0,
            pointerEvents: "none",
            ease: Expo.easeOut,
            onStart: function() {}
        });

        var newScreenTitle = $('.screen[data-name="' + screenName + '"]').attr('data-screen-title');
        $('.screen[data-name="list"]').attr('data-screen-title');
        $(mainElement).attr('active-screen', screenName)
        console.log('new screen title: ' + newScreenTitle)
        if (topAppTitle != false || newScreenTitle != 'undefined') {
            changeTopAppBarText(newScreenTitle);
        }

        $(newScreen).addClass('enabled');
        screenArray.unshift(screenName);
        console.log('screenArray:' + screenArray);
    } else {
        console.log('screen already showing')
    }

    // Hide visual bg if switching screen in live class
    if (screenName != 'home' && portalState.state == 'liveClass') {
        $('body').removeClass('visual');
    }
    if (screenName == 'home' && portalState.state == 'liveClass') {
        $('body').addClass('visual');
        setTimeout(function() {
            toggleNavigation(false);
            listenForTouchDuringLiveClass();
        }, 1000)
    }

    currentScreen = screenName;
}

function listenForTouchDuringLiveClass(command = true) {

    $('body').unbind('click.shownav');

    if (command) {
        $('body').bind('click.shownav', function() {
            $('body').unbind('click.shownav');
            toggleNavigation(true);
        })
    }
}

var screenChanges = {
    list: false
}; // Keep track of transitions that have occurred.

function screenChangeTransition(screenName) {
    console.log('screenChangeTransition for ' + screenName);
    if (screenName == 'list' && screenChanges.list == false) {
        TweenMax.staggerFrom('.class-card', .15, {
            scale: .9,
            y: 10,
            opacity: 0,
            ease: Quad.easeOut
        }, .05);
        screenChanges.list = true;
    }

    if (screenName == 'home') {
        toggleClimateDisplay(true);
    } else {
        toggleClimateDisplay(false);
    }
}


var climateDisplay = $('.climate-display');

function toggleClimateDisplay(command) {

    if (command == true) {
        TweenMax.to(climateDisplay, .35, {
            y: 0,
            ease: Expo.easeOut,
            opacity: 1
        });
        console.log('show climate')
    } else {
        TweenMax.to(climateDisplay, .25, {
            y: -90,
            ease:Expo.easeOut
        });
        console.log('hide climate')
    }

}


var climateCardElem = $('.climate-card');
function toggleClimateCard(command = climateCardShowing) {

    if (climateCardShowing == false) {
      //  TweenMax.set(climateCardElem,{height:windowParams.height})
        $('body').removeClass('visual');
        TweenMax.to(climateCardElem, .35, {
            y: 0,
            ease: Power3.easeOut
        });
        toggleNavigation(false);
        climateCardShowing = true;
        changeTopAppBarText('Climate', 'back');
        //resetTempControlKnob();
        psm.updatePortalClimate();

        var cc = new ClimateChart();
        cc.example();

        bodyVisualCheck(true); // Checks if should remove .visual class from body

        $(appBarBackButton).bind('click.closeClimateCard', function() {

          bodyVisualCheck(false);
            $(this).unbind('click.closeClimateCard');
            toggleClimateCard();
            changeTopAppBarText('Portal');

        })

    } else if (climateCardShowing == true) {
        toggleNavigation(true);
        TweenMax.to(climateCardElem, .15, {
            y: (-1 * $(climateCardElem).outerHeight())
        });
        climateCardShowing = false;
    }
    console.log(climateCardShowing)
}

$(climateDisplay).click(toggleClimateCard);


var rotationSnap = 6;
var climateDial;
function resetTempControlKnob() {

    try {
        climateDial.kill();
    } catch (e) {
        console.log('draggable not created yet')
    }



    climateDial = Draggable.create("#control-knob", {
        type: "rotation", //instead of "x,y" or "top,left", we can simply do "rotation" to make the object spinnable!
        //throwProps:true, //enables kinetic-based flicking (continuation of movement, decelerating after releasing the mouse/finger)
        liveSnap: function(endValue) {
            //this function gets called when the mouse/finger is released and it plots where rotation should normally end and we can alter that value and return a new one instead. This gives us an easy way to apply custom snapping behavior with any logic we want. In this case, just make sure the end value snaps to 90-degree increments but only when the "snap" checkbox is selected.
            console.log('ev=' + endValue);
            console.log(Math.round(endValue / rotationSnap) * rotationSnap);
            portalState.climate.setTemp = Number(calcRotationToDeg(endValue));
            $(setTempElem).text(portalState.climate.setTemp);

            return Math.round(endValue / rotationSnap) * rotationSnap;
        },
        bounds: {
            minRotation: -120,
            maxRotation: 120
        },
        maxRotation: 90,
        minRotation: 68,
        endRotation: function(endValue) {
            alert(endValue)
        },
        onDragEnd: function() {

            //  setPortalTemperature(portalState.climate.setTemp);

        }
    });
}

// Rotate knobs to reflect temp
function setTemperatureKnob() {

    portalState.climate.setTemp = Number(portalState.climate.setTemp);
    TweenMax.set('#current-temp-knob', {
        rotation: calcRotationToDeg(Number(portalState.climate.f), true)
    });
    TweenMax.set('#control-knob', {
        rotation: calcRotationToDeg(Number(portalState.climate.setTemp), true)
    });


    if (Number(portalState.climate.setTemp) > Number(portalState.climate.f)) {
        console.log('heating room now')
        $('.main').addClass('heating-room');
    } else {
        $('.main').removeClass('heating-room');
    }



}

var setTempElem = $('#set-temp-to');

function calcRotationToDeg(endValue, fToRot = false) {
    var returnVal = 0;
    if (fToRot == false) {
        let minDeg = 50;
        let tempDif = 40; // Dif between 90deg and 50deg settings on nest
        let radDif = 240; // Difference between rotation min and max
        let min = -120;
        let max = 120;
        let realMin = max + radDif; // 120
        let realMax = max + radDif; // 360
        let dif = realMax - realMin;
        let startTemp = 50;
        // 50deg = 120;
        // 90deg = 360

        let endVal = endValue; // snap rot
        endVal += radDif; //120

        endVal = realMax - endVal;
        endVal = radDif - endVal;
        let deg = 40 * (endVal / radDif);
        console.log('calcRotationToDeg = ' + Math.round(minDeg + deg));
        returnVal = Math.round(minDeg + deg);
    } else {
        let setTempRot = endValue;
        setTempRot = setTempRot - 50; // min temp
        setTempRot = setTempRot / 40; // dif between mina nd max deg

        let deg = setTempRot * 240;
        deg -= 120;
        returnVal = deg;
    }

    return returnVal;

}




/*
 * Temperature control slider
 */


var setTempSlider = mdc.slider.MDCSlider.attachTo(document.querySelector('.mdc-slider'));
setTempSlider.listen('MDCSlider:change', () => setPortalTemperature(setTempSlider.value));



var setTempSliderValuecount = 0;
var lastSetTempVal = 0;

function setTempSliderValue(val) {
    console.log('setTempSliderValuecount:' + setTempSliderValuecount);
    setTempSlider.value = val;

    if (Number(portalState.climate.setTemp) > Number(portalState.climate.f)) {
        console.log('heating room now')
        $('.main').addClass('heating-room');
    } else {
        $('.main').removeClass('heating-room');
    }
    if (lastSetTempVal != portalState.climate.setTemp) {
        TweenMax.killTweensOf(setTempElem);
        TweenMax.set(setTempElem, {
            clearProps: "all"
        });
        TweenMax.from(setTempElem, .8, {
            y: 20,
            opacity: 0,
            ease: Quad.easeOut
        });
    }

    lastSetTempVal = portalState.climate.setTemp;
}

// Send message to cortex to set temperature
var triggerCountForSetPortalTemperature = 0;

function setPortalTemperature(deg) {

    console.log('triggerCountForSetPortalTemperature = ' + triggerCountForSetPortalTemperature);
    if (triggerCountForSetPortalTemperature == 0) {

        channel.trigger('client-event', {
            eventType: 'command',
            value: 'setTemperature',
            params: {
                deg: deg,
                wemos: false
            }
        });
    } else {
        setTimeout(function() {
            triggerCountForSetPortalTemperature = 0;
        }, 1000);
    }

    triggerCountForSetPortalTemperature++;
}



var ClimateChart = function(){
this.example = function(){
  var add_minutes =  function (dt, minutes) {
      return new Date(dt.getTime() + minutes*60000);
  }

  var data = {ts:[],f:[],h:[]};
  var d = new Date(2014,10,2);
  console.log();
  var f = 68,h = 50;
  for(var i = 0; i < 140; i++){

  data.ts.push(add_minutes(d, 5).getTime());
  f+=(Math.random() * .5);

  if(f >= 70){
    f = 70 + Math.random();
  }
  data.f.push(f)

  h+= Math.random();
  h-= Math.random();
  if(h < 49){
    h = 50;
  }
  data.h.push(h)
  }

  var labelData = [];

  var lcount = 0;
  for(var z = 0;z < data.ts;z++){


  if(lcount == 1 || lcount == 9){

  lcount+=1;

  labelData.push(data.ts[z]);

  if(lcount == 18){
  lcount = 0;
  }

  }

  }

  new Chartist.Line('.ct-chart', {
    labels: labelData,
    series: [
      data.h,
      data.f
    ]
  }, {
    high: 100,
    low: 40,
    showArea: true,
    showLine: false,
    showPoint: false,
    fullWidth: true,
    axisX: {
      showLabel: false,
      showGrid: false
    },
    axisY: {
      showLabel: true,
      showGrid: false
    }

  });

  }
}

// Checks if should remove .visual class from body
function bodyVisualCheck(leavingHomeScreen = false){

  if (currentScreen == 'home' && portalState.state == 'liveClass') {
    if(leavingHomeScreen){
      $('body').removeClass('visual');
    }else{
        $('body').addClass('visual');
    }
  }
  else if (currentScreen != 'home' && portalState.state == 'liveClass') {
    $('body').removeClass('visual');

    }
}
$(document).ready(function() {


});
