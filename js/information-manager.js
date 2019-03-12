

// Returns html element for class overview card.
function returnClassCard(info){

    var h = '<div class="mdc-card class-card" data-mdc-auto-init="MDCCard">';
      h+='<div class="mdc-card__primary-action class-card_action" tabindex="0">';
        h+='<div class="mdc-card__media mdc-card__media--square class-card_media" style="background-image: url(&quot;https://material-components.github.io/material-components-web-catalog/static/media/photos/3x2/2.jpg&quot;);"></div>';
        h+='<div class="">';
          h+='<h2 class="demo-card__title mdc-typography mdc-typography--headline6 class-card_headline">'+info.classID+'</h2>';
          h+='<h3 class="demo-card__subtitle mdc-typography mdc-typography--subtitle2 class-card_subtitle">'+info.instructorName+'</h3>';
        h+='</div>';
      h+='</div>';
      h+='<div class="mdc-card__actions">';
        h+='<div class="mdc-card__action-buttons">';
          h+='<button class="mdc-button mdc-card__action mdc-card__action--button">Read</button>';
          h+='<button class="mdc-button mdc-card__action mdc-card__action--button">Bookmark</button>';
        h+='</div>';
        h+='<div class="mdc-card__action-icons">';
          h+='<button class="mdc-icon-button mdc-card__action mdc-card__action--icon--unbounded" aria-pressed="false" aria-label="Add to favorites" title="Add to favorites">';
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

function addClassOverviews(classes){
  console.log('addClassOverviews for ' + classes.length + ' classes')
  var classElements = '';

  $(classes).each(function(){
  console.log(this.classID);
  classElements += returnClassCard(this);
  });

  $(classElements).appendTo('#class-list');

}
