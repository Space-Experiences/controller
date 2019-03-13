


var rotateAmount = 0;
function rotateScreen(){
  rotateAmount -=90;
  TweenMax.set('body',{rotation:rotateAmount})
}

var loadingOverlayElement = $('.screen[data-name="loading"]');
var $params = {
  transition:{in:.2,out:.15},
}; // global params
var screenArray = ['loading'];// push screen names as they appears

function loadingOverlay(command){
  if(command){
    TweenMax.to(loadingOverlayElement,$params.transition.in,{opacity:1,pointerEvents:"auto",ease:Expo.easeIn});
  }
  if(command == false){
      TweenMax.to(loadingOverlayElement,$params.transition.in,{opacity:0,pointerEvents:"none"});
    }
}

function toggleNavigation(command){
  $('.main').toggleClass('nav-enabled');
}

var appBarTitle = $('.top-app-bar-title');
var appBarBackButton = $('#top-app-btn-back');
var appBarTitleHistory = []; // Store navigation for titles.
var appBarTitleButtons = {showing:false,button:false};
function changeTopAppBarText(text,button = false){
  let tl = new TimelineMax({});
  tl.to(appBarTitle,.15,{opacity:0,x:10,ease:Expo.easeIn});
  tl.add(function(){
    $(appBarTitle).text(text);
  })
  tl.to(appBarTitle,.25,{opacity:1,x:1,ease:Expo.easeOut});

  if(button){
      if(button == 'back'){
        console.log('show back button');
        TweenMax.set(appBarBackButton,{clearProps:"all"});
        $(appBarBackButton).show();
        TweenMax.from(appBarBackButton,.15,{scale:0,ease:Back.easeOut});
        appBarTitleButtons.showing = true;
        appBarTitleButtons.button = appBarBackButton;
      }
  }
  else{
    if(appBarTitleButtons.showing == true){
      let tl = new TimelineMax({});
      tl.to(appBarTitleButtons.button,.15,{scale:0});
      tl.add(function(){
        $(appBarTitleButtons.button).hide();
        TweenMax.set(appBarTitleButtons.button,{clearProps:"all"});
        appBarTitleButtons.button = false;
        appBarTitleButtons.showing = false;
      });
    }
  }

  appBarTitleHistory.unshift(text);

}

function showScreen(screenName,topAppTitle = false){

  var newScreen = $('.screen[data-name="'+screenName+'"]');
  var oldScreen = $('.screen.disabled.enabled');

  TweenMax.to(newScreen,$params.transition.in,{opacity:1,pointerEvents:"auto",ease:Expo.easeIn,onStart:function(){
    screenChangeTransition(screenName); // Do any transitions if they exist.
  }});
  TweenMax.to(oldScreen,$params.transition.out,{className:"-=enabled",opacity:0,pointerEvents:"none",ease:Expo.easeOut,onStart:function(){}});

  var newScreenTitle = $('.screen[data-name="'+screenName+'"]').attr('data-screen-title');
  $('.screen[data-name="list"]').attr('data-screen-title');
  console.log('new screen title: ' + newScreenTitle)
  if(topAppTitle != false || newScreenTitle != 'undefined'){
    changeTopAppBarText(newScreenTitle);
  }

  $(newScreen).addClass('enabled');
  screenArray.unshift(screenName);
  console.log('screenArray:' + screenArray);

}


var screenChanges = {list:false}; // Keep track of transitions that have occurred.
function screenChangeTransition(screenName){
      console.log('screenChangeTransition for ' + screenName);
      if(screenName == 'list' && screenChanges.list == false){
        TweenMax.staggerFrom('.class-card',.15,{scale:.9,y:10,opacity:0,ease:Quad.easeOut},.05);
        screenChanges.list = true;
      }
}
