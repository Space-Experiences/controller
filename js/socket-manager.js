// Manage messages form pusher and portal
var getPortalState;
var SocketManager = function(){

  this.parsePortalEvent = function(msg){
    if(msg.data.type == 'responseAirtableClassData'){
      //...
      classData = msg.data.val; // Set array
      addClassOverviews(classData);
    }
    if(msg.data.type == 'responsePortalState'){
      //getPortalState = msg.data.val;
      //portalState = msg.data.val;
      console.log('responsePortalState');
      psm.updateState(msg.data.val);
      console.log(portalState);
      EventBus.publish('responsePortalState');

    }
  }

};
