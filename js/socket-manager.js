// Manage messages form pusher and portal
var SocketManager = function(){

  this.parsePortalEvent = function(msg){
    if(msg.data.type == 'responseAirtableClassData'){
      //...
      classData = msg.data.val; // Set array
      addClassOverviews(classData);
    }
  }

};
