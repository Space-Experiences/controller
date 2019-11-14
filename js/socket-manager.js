// Manage messages form pusher and portal
var getPortalState;
var SocketManager = function(){

  this.parsePortalEvent = function(msg){

    try{
      console.log('msg.data.type = ' + msg.data.type);
    if(msg.data.type == 'responseAirtableClassData'){
      //...
      classData = msg.data.val; // Set array
      addClassOverviews(classData);
    }
      if(msg.data.type == 'portalClimate'){
        console.log('portalClimate');
        console.log(msg.data.data)
        portalState.climate.f = msg.data.data.f;
        portalState.climate.h = msg.data.data.h;
        portalState.climate.setTemp = Number(msg.data.data.setTemp);
        psm.updatePortalClimate();
      }
    if(msg.data.type == 'responsePortalState'){
      //getPortalState = msg.data.val;
      //portalState = msg.data.val;
      console.log('responsePortalState');
      psm.updateState(msg.data.val);
      console.log(portalState);
      EventBus.publish('responsePortalState');

    }
    if(msg.data.type == 'responseTemperatureSet'){
      portalState.climate.setTemp = Number(msg.data.val);
      EventBus.publish('responseTemperatureSet');
      setTempSliderValue(portalState.climate.setTemp);
    }
  }catch(e){
    console.log(e);
  }


}

};
