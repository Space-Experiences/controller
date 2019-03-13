

// Returns html element for class overview card.
function returnClassCard(info){

    var h = '<div  class="mdc-card class-card" data-mdc-auto-init="MDCCard" data-class-id="'+info.classID+'" id="class-card--'+genUid()+'" data-type="pusher" data-value="Prepare Class B102">';
      h+='<div class="mdc-card__primary-action class-card_action" tabindex="0">';
        h+='<div class="mdc-card__media mdc-card__media--square class-card_media" style="background-image: url(&quot;https://material-components.github.io/material-components-web-catalog/static/media/photos/3x2/2.jpg&quot;);"></div>';
        h+='<div class="">';
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
  var drag = Draggable.create(".class-list", {type:"scrollTop" ,edgeResistance:.6, throwProps:true, lockAxis:true,
  onDrag:function(){
    dragging = true;
  },onRelease:function(){
    setTimeout(function(){
    dragging = false;
  },200)
  }});

       $('.class-card').click(function(){


       });

        $('.class-card').on('mousedown',function(){
          if(dragging == false){
          TweenMax.to(this,.1,{scale:.95});
          }
        });

        $('.class-card').on('mouseup',function(){

          TweenMax.to(this,.1,{scale:1});
            if(dragging == false){
              TweenMax.to(this,.1,{scale:1.05});
              TweenMax.to(this,0,{scale:1,delay:.2})
          var elemID = $(this).attr('id');
          var elem = document.getElementById(elemID);
          abs = getAbsPosition(elem);
          abs.height = $(elem).height();
          abs.width = $(elem).width();
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

           toggleFullCard(true,abs,'Overview of ' + $(elem).attr('data-class-id'));


}
        });
}

var fullCardShowing = false;
function toggleFullCard(enable,abs,title = false){

  var fctl = new TimelineMax({});
var fc = $('.full-card');
var fcinner = $('.full-card_inner');
var fcoverlay = $('.full-card-overlay');
if(fullCardShowing == false){

  // Full card
  TweenMax.set(fcoverlay,{clearProps:"all"});
  TweenMax.set(fc,{clearProps:"all"});
  TweenMax.set(fc,{opacity:1,top:"0px",left:"0px",height:"100vh",width:"100vw",pointerEvents:"all"});

  // Full card inner container
  TweenMax.set(fcinner,{opacity:0});
var setTopAppTitle = '';
if(title){
  setTopAppTitle = title;
}

  TweenMax.to(fcoverlay,.05,{opacity:.3});

  TweenMax.from(fc,.3,{height:abs.height,
    top:abs.top - 125,
    left:abs.left,
    width:abs.width,
    ease:Power2.easeInOut,
    onComplete:function(){
  changeTopAppBarText(setTopAppTitle,'back');
  TweenMax.to(fcinner,.15,{opacity:1});
  }});

toggleNavigation();


  changeTopAppBarText('');

    $(appBarBackButton).bind('click.back',function(){
      $(appBarBackButton).unbind('click.back');
      toggleFullCard(false,abs);
      changeTopAppBarText('Classes',false);
    });

}else{
  //fctl.set(fc,{opacity:1,top:"0px",left:"0px",height:"100vh",pointerEvents:"all"});
TweenMax.to(fcinner,.1,{opacity:0});
TweenMax.to(fcoverlay,.1,{opacity:0});
TweenMax.to(fc,.25,{height:abs.height,top:abs.top,left:abs.left,
  opacity:0,
  ease:Power3.easeInOut,
  pointerEvents:"none"});
$('.full-card').unbind('click.open');
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


}

/* Listen for start class information */

$('.full-card .start-button').click(function(){
  let classID = $('.full-card').attr('class-id');
  loadClass(classID);
})














/* */
