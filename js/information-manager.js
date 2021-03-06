/*
// Data returned from portal matches object in cortex.
var portalState = {
  state:"none", // loadingClass,classReady,liveClass,standby,enterClass,exitClass,cleanMode,
    class:"none", // classID in airtable and production folder
  classDuration:"", // Total length of class if one is loaded or live
  classProgress:"", // percentage complete for class (calculated on client side for time)
  nextClassCountdown:"", // If class is about to start, how much time until next class
  classSchedule:[] // Schedule of upcoming classes
};
*/



var PortalStateView = function(){
  var _this = this;
  var waitingForResponse = false; // If waiting for response from cortex

  // Elements for portal display
  var psdisplay = {
    display:$('.portal-display'),
    state:$('.pd-info[name="state"]'),
    classID:$('.pd-info[name="classID"]'),
    classDuration:$('.pd-info[name="classDuration"]'),
    classProgress:$('.pd-info[name="classProgress"]'),
    nextClassCountdown:$('.pd-info[name="nextClassCountdown"]')
  };

  var climateElems = {
    f:$('.climate-data[climate-info-type="current"][climate-name="f"]'),
    h:$('.climate-data[climate-info-type="current"][climate-name="h"]'),
    setTemp:$('.climate-data[climate-info-type="current"][climate-name="setTemp"]')
  };

  var scheduledClassElems = {
    calendarIcon:$('#scheduled-class-calendar-icon')
  };



  this.returnPortalState = function(){

    channel.trigger('client-event', {eventType:'GET',
                                     value:'returnPortalState',
                                     params:{}});

  }

  this.updateState = function(newPortalState){

  //  newPortalState = getPortalState;
    console.log('update portalStateView' + ' ' + newPortalState.state)
    // If new data, loop through and append.
//    if(newPortalState != portalState){

      // Loop through keys and fix
      for (var property in portalState) {
          if (Object.prototype.hasOwnProperty.call(portalState, property)) {
            console.log('update portalState.' + property); // Object key ('state','classID')
            console.log('newPortalState[property] = '+ newPortalState[String(property)]);
            console.log('portalState[property] = ' + portalState[String(property)])
            if(newPortalState[String(property)] != portalState[String(property)]){
                _this.setInfo(String(property),newPortalState[String(property)]);
                portalState[String(property)] = newPortalState[String(property)];
            }
          }
      }


      _this.updatePortalClimate();
      _this.updatePortalScheduledClassStatus();
      _this.updateTemperatureSwitchStatus();
      _this.updatePortalLightStatus();

  //  }

  }


  this.setInfo = function(property,value){
    //portalState[String(property)] = newPortalState[String(property)]
    console.log('portalStateView.setInfo: ' + property + ' ' + value);

    function set(txt = value){
      try{
      var elem = psdisplay[property];

      let tl = new TimelineMax({});
      tl.to(elem,.5,{y:-10,opacity:0,ease:Expo.easeIn}); //x:30
      tl.add(function(){
        $(elem).text(txt);
      });
      tl.to(elem,.5,{y:0,opacity:1,ease:Expo.easeOut});
      //tl.kill();
    }catch(e){
      console.log(e);
    }

    }



    if(String(property) == 'state'){

    //  TweenMax.to('.screen[data-name="home"]',2,{backgroundColor:"#f6f6f6"});
      $('body').removeClass('visual');

        if(value == 'classReady'){
          set('Class is ready.');
          toggleClassControls(true);
          setClassControls('showStart');
          toggleLoadClassIndicator(false);

          countdown.hide();
        }
        if(value == 'startClassAfterDelay'){
          countdown.show();
          countdown.start();
        }
        if(value == 'loadingClass'){
          set('Preparing class.');
          toggleClassControls(false);
          toggleNavigation(false);
          listenForTouchDuringLiveClass();
          toggleLoadClassIndicator(true);
          showScreen('home');


        // Remove timeout on prepare class complete
        var linearProgressCatch;
        var catchLoadingError = setTimeout(function(){
            console.log('catchLoadingError')
          set('Something went wrong...')
          toggleClassControls(false);
          offlineStatus();
                  toggleLoadClassIndicator(false);
        },30000);

        setTimeout(function(){
        linearProgressCatch = EventBus.subscribe('responsePortalState',function(){
          console.log('clearedLoadCatch')
          clearTimeout(catchLoadingError)
          EventBus.unsubscribe(linearProgressCatch);
        });
      },5000);

        }
        if(value == 'liveClass'){
          set('Class in session.');
          $('body').addClass('visual');
      // /    TweenMax.to('.screen[data-name="home"]',2,{backgroundColor:"rgba(246,246,246,0)"});
          toggleClassControls(true);
          setClassControls('showPause');
          toggleNavigation(false);
          listenForTouchDuringLiveClass();
        }
        if(value == 'pausedClass'){
          set('Class paused.');
          toggleClassControls(true);
          setClassControls('showStart');
          setTimeout(function(){
            if(pageLoaded){
            toggleNavigation(true);
            }
          },500)
        }
        if(value == 'standby'){
          set('Standby.')
          toggleClassControls(false);
        }
        if(value == 'enterClass'){
          set('Welcome :) ')
          toggleClassControls(true);
        }
        if(value == 'exitClass'){
          set('Thanks for coming!')
          toggleClassControls(false);
        }
    }
    else if(String(property) == 'classDuration'){
      if(value == 'false' || value == false){
        value = '55';
        }
      set(value + ' min.')
    }
    else if(String(property) == 'nextClassCountdown'){
      if(value != '--'){
        set(sec2time(value));
      }
    }
    else{
      set();
    }
  }


  this.updatePortalClimate = function(){

    console.log('updatePortalClimate: ' + portalState.climate.f);
    $(climateElems.f).text(portalState.climate.f);
    $(climateElems.h).text(portalState.climate.h);

    let setTempText = portalState.climate.setTemp;
    if(setTempText == 0){
      setTempText = '--';
    }
    $(climateElems.setTemp).text(setTempText);

    setTempSliderValue(portalState.climate.setTemp);

  }

  this.waitForResponseListener = function(callback){

  }


  this.updatePortalScheduledClassStatus = function(){

      if(portalState.scheduledClassId != false){
        $(scheduledClassElems.calendarIcon).addClass('scheduled-class-exists');

        // Display scheduled events.
        $('#existing-schedule-event-class-id').text(portalState.scheduledClassId);
        $('#existing-schedule-event-datetime').text(portalState.scheduledClassTime);
        $('#delete-schedule-event-button').show();
        $('#save-schedule-event-button').hide();
        $('#review-schedule-event').show();
        $('#add-schedule-event').hide();
        $('.schedule-button').addClass('disabled');
      }else{
        $(scheduledClassElems.calendarIcon).removeClass('scheduled-class-exists');
        $('#delete-schedule-event-button').hide();
        $('#save-schedule-event-button').show();
        $('#review-schedule-event').hide();
        $('#add-schedule-event').show();
        $('.schedule-button').removeClass('disabled');
      }

  }

  this.updateTemperatureSwitchStatus = function(){
    if(portalState.heatIsOn == true){
      $('.heat-switch').addClass('mdc-switch--checked');
      $('.heat-switch').attr('data-is-active',1);
    }else{
      $('.heat-switch').removeClass('mdc-switch--checked');
      $('.heat-switch').attr('data-is-active',0);
    }
  }

  this.updatePortalLightStatus = function(){
    if(portalState.lightIsOn == true){
      $('.light-switch').addClass('mdc-switch--checked');
      $('.light-switch').attr('data-is-active',1);
    }else{
      $('.light-switch').removeClass('mdc-switch--checked');
      $('.light-switch').attr('data-is-active',0);
    }
  }

};




// Returns html element for class overview card.
function returnClassCard(info){

    var h = '<div data-mdc-auto-init="MDCRipple" class="mdc-card class-card" data-mdc-auto-init="MDCCard" data-class-id="'+info.classID+'" id="class-card--'+genUid()+'" data-type="pusher" data-value="Prepare Class B102">';
      h+='<div class="mdc-card__primary-action class-card_action" tabindex="0">';
        h+='<div class="mdc-card__media mdc-card__media--square class-card_media"></div>';
        h+='<div class="" style="pointer-events:none;background:none;background-color:none">';
          h+='<h2 class="demo-card__title mdc-typography mdc-typography--headline6 class-card_headline">'+info.classID+'</h2>';
          h+='<h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2 class-card_subtitle">'+info.instructorName+'</h3>';
          h+='   <div class="demo-card__secondary mdc-typography mdc-typography--body2">'+info.description+'</div>';
        h+='</div>';
      h+='</div>';
      h+='<div class="mdc-card__actions">';
        h+='<div class="mdc-card__action-buttons">';
          h+='<button class="mdc-button mdc-card__action mdc-card__action--button">Read</button>';
          h+='<button class="mdc-button mdc-card__action mdc-card__action--button">Bookmark</button>';
        h+='</div>';
        h+='<div class="mdc-card__action-icons">';
          h+='<button class="mdc-icon-button mdc-card__action mdc-card__action--icon--unbounded" style="display:none;" aria-pressed="false" aria-label="Add to favorites" title="Add to favorites">';
            h+='<i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">favorite</i>';
            h+='<i class="material-icons mdc-icon-button__icon">favorite_border</i>';
          h+='</button>';
          h+='<button class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded" title="Share" data-mdc-ripple-is-unbounded="true">share</button>';
          h+='<button class="mdc-icon-button material-icons mdc-card__action mdc-card__action--icon--unbounded" title="More options" data-mdc-ripple-is-unbounded="true">more_vert</button>';
        h+='</div>';
      h+='</div>';
    h+='</div>';

    return h;
}
var abs;

function addClassOverviews(classes){
  $('#class-list').empty();
  //TweenMax.set('#class-list',{height:2500});
  console.log('addClassOverviews for ' + classes.length + ' classes')
  var classElements = '';

  $(classes).each(function(){
  console.log(this.classID);
  classElements += returnClassCard(this);
  });

  for(var i = 0; i < 1;i++){
    classElements += '<div class="mdc-card class-card" style="opacity:0;height:170px;pointer-events:none;"></div>';
  }

  $(classElements).appendTo('#class-list');
  var h = $('#class-list').height();

//  TweenMax.set('#class-list',{height:h})
var dragging = false; // keep track of dragging
/*
  var drag = Draggable.create(".class-list", {type:"scrollTop" ,edgeResistance:0, throwProps:true, lockAxis:true,
  minimumMovement:0,
  bounds:{height:5000},
  onDrag:function(){
    dragging = true;
  },onRelease:function(){
    setTimeout(function(){
    dragging = false;
  },200)
  }});
*/
  $( ".class-card" ).bind( "tap", tapHandler );

function tapHandler( event ){
$( event.target ).addClass( "tap" );
}


        var touchingCard = false;
        $('.class-card').on({ 'touchstart' : function(){
          console.log('class-card mousedown, dragging = ' + dragging)
          if(dragging == false){  }
            TweenMax.to(this,.1,{backgroundColor:"#333333"});
            touchingCard = $(this);

        }});
        $(document).on('touchmove', function() {
            detectTap = false; //Excludes the scroll events from touch events
            if(touchingCard){
                  TweenMax.to('.class-card',.1,{backgroundColor:"#1c1c1c"});
            }
        });



        $('.class-card').on('mouseup',function(){

          TweenMax.to(this,.4,{backgroundColor:"#1c1c1c"});
            if(dragging == false){
              TweenMax.to(this,.1,{scale:1.05});
              TweenMax.to(this,0,{scale:1,delay:.2})
          var elemID = $(this).attr('id');
          var elem = document.getElementById(elemID);
          abs = getAbsPosition(elem);
          abs.height = $(elem).outerHeight();
          abs.width = $(elem).outerWidth();
          console.log(abs);
           var val = $(this).attr('data-value');
           var type = $(this).attr('data-type');
           if(type == 'pusher'){
                //     channel.trigger('client-event', { type: 'pusher', value: val });
           }

           var classId = $(this).attr('data-class-id');
           for(var i = 0; i < classes.length; i++){
             if(classes[i].classID == classId){
               populateFullCardInformation(classes[i]);
             }
           }

           toggleFullCard(true,abs,$(elem).attr('data-class-id'));


}
        });
}

var fullCardShowing = false;
var fc = $('.full-card');
var fcinner = $('.full-card_inner');
var fcoverlay = $('.full-card-overlay');
function toggleFullCard(enable,abs,classID){

  var fctl = new TimelineMax({});

if(fullCardShowing == false){

  $('.full-card').attr('class-id', classID);

  // Full card
  TweenMax.set(fcoverlay,{clearProps:"all"});
  TweenMax.set(fc,{clearProps:"all"});
  TweenMax.set(fc,{opacity:1,top:"0px",left:"0px",height:"100vh",width:"100vw",pointerEvents:"all"});

  // Full card inner container
  TweenMax.set(fcinner,{opacity:0});



  TweenMax.to(fcoverlay,.05,{opacity:.3});

  TweenMax.from(fc,.5,{height:abs.height,
    top:abs.top - 60,
    left:0,//abs.left,
    width:abs.width,
    ease:Power3.easeOut,
    borderRadius:2,
    onComplete:function(){
      changeTopAppBarText('Overview of ' + classID,'back');

  }});

  TweenMax.to(fcinner,.25,{delay:.15,opacity:1});

toggleNavigation(false);


  changeTopAppBarText('');

    $(appBarBackButton).bind('click.back',function(){
      $(appBarBackButton).unbind('click.back');
      toggleFullCard(false,abs);
      changeTopAppBarText('Classes',false);

      toggleNavigation(true);
    });

}else{
  //fctl.set(fc,{opacity:1,top:"0px",left:"0px",height:"100vh",pointerEvents:"all"});
TweenMax.to(fcinner,.1,{opacity:0});
TweenMax.to(fcoverlay,.1,{opacity:0});
TweenMax.to(fc,.25,{height:abs.height,top:abs.top,left:abs.left,
  opacity:0,
  ease:Power3.easeInOut,
  pointerEvents:"none"});

toggleNavigation();
}
fullCardShowing = !fullCardShowing;
}


function populateFullCardInformation(info){

    $('.data-info[info="classID"]').text(info.classID);
    $('.data-info[info="instructorName"]').text(info.instructorName);
    $('.data-info[info="duration"]').text(info.duration);
    $('.data-info[info="status"]').text(info.status);
    $('.data-info[info="rating"]').text(info.rating);
    $('.data-info[info="intention"]').text(info.staintentiontus);
    $('.data-info[info="description"]').text(info.description);

    $('.data-info[info="classID"]').attr('data-recordId',info.recordId);


}

/* Listen for start class information */

$('.full-card .start-button').click(function(){
  let classID = $('.full-card').attr('class-id');

  // trigger overlay
  loadingOverlay(true);
  loadClass(classID,function(){

    window.location.reload(true);

/*
      loadingOverlay(false);
      appBarBackButton.click();
        $(appBarBackButton).unbind('click.back');
      $('.nav-btn[data-name="home"]').click();
      changeTopAppBarText('Portal');
      //showScreen('home','Portal');
      toggleNavigation(true);
      $('body').bind('click.showcontrols',function(){
        $(this).unbind('click.showcontrols');
        toggleNavigation(true);
      })
      */
  });

})


/* Load class options */
var waitForCallback;
function loadClass(classID,callback = false){

  // load class

  var startDelay = $('#delay-select-val').val();

  channel.trigger('client-event', {eventType:'command',
                                      value:'load class',
                                      params:{classID:classID,
                                      startTime:startDelay}});



  var catchDisconnection = setTimeout(function(){
    offlineStatus();
    if(callback){
      callback();
    }
  },6000); // Give cortex a second to process everything


  // Subscribe to listen for return event pub.
var confirmCallback =  EventBus.subscribe('responsePortalState', function(){
  clearTimeout(catchDisconnection);

    if(callback){
      callback();
    }
      EventBus.unsubscribe(confirmCallback);
  });



}




var StartCountdown = function(){
  var _this = this;

  var runner = $('#runner');
  var delayCountdown = $('#delay-countdown');
  var progress = $('#delay-countdown-graphic');
  _this.runner = runner;

  var startTime = 0;
  _this.startTime = startTime;
  this.setStartTime = function(sec){
    _this.startTime = sec;
    $(_this.runner).runner({
      autostart:false,
      countdown: true,
      startAt: _this.startTime * 1000, // alternatively you could just write: 60*1000
      stopAt: 0
    }).on('runnerFinish', function(eventObject, info) {
      _this.hide();
    });
  }

  this.start = function(callback = false){

    toggleClimateDisplay(false);

  //  toggleClimateCard(false);

      $(_this.runner).runner('reset');
      $(_this.runner).runner('start');

      TweenMax.set(progress,{x:"-100%"});
      TweenMax.set(runner,{color:"black"});
      TweenMax.to(runner,_this.startTime,{color:"white",ease:Linear.easeNone});
      TweenMax.to(progress,_this.startTime,{x:"0%",ease:Linear.easeNone});

      toggleNavigation(false);
  }

  this.show = function(){

    toggleNavigation(false);
    TweenMax.set(delayCountdown,{clearProps:"all"});
    TweenMax.from(delayCountdown,.3,{y:"100%",ease:Power2.easeOut,onStart:function(){
      $(delayCountdown).show();
    }});
  }

  this.hide = function(){

    TweenMax.to(delayCountdown,.2,{y:"100%",ease:Power2.easeOut,onComplete:function(){
      $(delayCountdown).hide();
    }});

      $(_this.runner).runner('stop');
    }
  this.clear = function(){
      $(runner).show();
    }

}


var countdown = new StartCountdown();

$('#cancel-start-class-delay-btn').click(function(){
  countdown.hide();
  toggleClimateDisplay(true);
})




function toggleLoadClassIndicator(command = false){
  if(command){
    function resumeLine(timeLine, time)
{
  TweenMax.delayedCall(time, function()
  {
    timeLine.play();
  });
}
if(tl){
tl = null;
}
  loadProgressBar.open();
          var tl = new TimelineMax({});
	//	tl.pause();
          tl.add(function(){loadProgressBar.foundation_.setProgress(0)});
          loadProgressBar.foundation_.setBuffer(0);
setTimeout(function(){loadProgressBar.foundation_.setBuffer(1)},1000);
setTimeout(function(){loadProgressBar.foundation_.setDeterminate(0)},2000);

}else{loadProgressBar.close();}
}





var countdownValue = $('.countdown-value');

function portalLightSwitchCountdown(onOrOff){

  if(onOrOff == 'enablePortalLight'){
    $('.info-header').text('Activating Portal Light');
  }else{
    $('.info-header').text('Deactivating Portal Light');
  }
  var cdtl = new TimelineMax({repeat:0});
  $('.screen-info').addClass('enabled');
  $(countdownValue).text(4);
    toggleNavigation(false);
  cdtl.to(countdownValue,1,{opacity:0,onComplete:function(){
    $(countdownValue).text(3);
	TweenMax.set(countdownValue,{opacity:1});
  }});
  cdtl.to(countdownValue,1,{opacity:0,onComplete:function(){
    $(countdownValue).text(2);
	TweenMax.set(countdownValue,{opacity:1});
  }});
  cdtl.to(countdownValue,1,{opacity:0,onComplete:function(){
    $(countdownValue).text(1);
	TweenMax.set(countdownValue,{opacity:1});
    }});
  cdtl.to(countdownValue,1,{opacity:0,onComplete:function(){
      toggleNavigation(true);
    $(countdownValue).text(0);
    TweenMax.set(countdownValue,{opacity:1});
    $('.screen-info').removeClass('enabled');
    cdtl.kill();
    cdtl = null;
  }})

}


/* Handle Switch Events*/


function handleSwitchEvent(switchName,value){

    if(switchName == "togglePortalLight"){
        portalLightSwitchCountdown(value);
    }
}

function confirmTurnOnWemos(){

  var r = confirm("Turn on the wemos?");
  if (r == true) {
    channel.trigger('client-event', { type: 'pusher', value: 'wemosOn' });
    $('.heat-switch').addClass('mdc-switch--checked');
  } else {
    //.. do nothing
    $('.heat-switch').removeClass('mdc-switch--checked');
  }
}

$('.mdc-switch').click(function(){

//data-switch="togglePortalLight" data-active-value="enablePortalLight" data-inactive-value="disablePortalLight" data-is-active="false"

         var sendValue = "";
         var type = $(this).attr('data-type');
         var isActive = $(this).attr('data-is-active');
         isActive = Number(isActive);
         isActive = Boolean(isActive);

         console.log(isActive);

         if(isActive == true){
            sendValue = $(this).attr('data-inactive-value');
             $(this).attr('data-is-active','0');
         }else{
            sendValue = $(this).attr('data-active-value');
            $(this).attr('data-is-active','1');
         }

         console.log(sendValue);

         console.log('new switch value: ' + !!isActive);

         if(sendValue == "wemosOn"){ // Trigger all events except wemosOn.
           confirmTurnOnWemos();
         }
         else{
           channel.trigger('client-event', { type: 'pusher', value: sendValue });
         }
         handleSwitchEvent($(this).attr('data-switch'),sendValue);

         if(sendValue == "wemosOff"){
           $('.heat-switch').removeClass('mdc-switch--checked');
         }

});
