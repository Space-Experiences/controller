


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
function changeTopAppBarText(text){
  let tl = new TimelineMax({});
  tl.to(appBarTitle,.15,{opacity:0,x:10,ease:Expo.easeIn});
  tl.add(function(){
    $(appBarTitle).text(text);
  })
  tl.to(appBarTitle,.25,{opacity:1,x:1,ease:Expo.easeOut});

}

function showScreen(screenName,topAppTitle = false){

  var newScreen = $('.screen[data-name="'+screenName+'"]');
  var oldScreen = $('.screen[data-name="'+screenArray[0]+'"]');

  TweenMax.to(newScreen,$params.transition.in,{opacity:1,pointerEvents:"auto",ease:Expo.easeIn});
  TweenMax.to(oldScreen,$params.transition.out,{opacity:0,pointerEvents:"none",ease:Expo.easeOut});

  var newScreenTitle = $(newScreen).data('data-screen-title')
  alert(newScreenTitle)
  if(topAppTitle != false || newScreenTitle != 'undefined'){
    changeTopAppBarText(topAppTitle);
  }

  $(newScreen).addClass('enabled');
  screenArray.unshift(screenName);
  console.log('screenArray:' + screenArray);

}
