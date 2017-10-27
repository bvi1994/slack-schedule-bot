var { findInvitees } = require "./findInvitees";
var { checkConflicts } = require "./checkConflicts";
var { scheduleMeeting } = require "./scheduleMeeting";

function planMeeting(planner,slackIds){
  slackIds.forEach((userId)=>(trimId(slackId)));
  var invitees = findInvitees(slackIds);
  invitees.push(planner);
  var conflicts = invitees.map((invitee)=>(checkConflicts(invitee)));
  Promise.all(invitees.map((invitee,index)=>{
    if(conflicts[index]){
      return scheduleMeeting(invitee,planner.Pending);
    }
    return new Promise(function(resolve, reject){
      resolve();
    });
  }))
  .then(function(){
    console.log("Meeting scheduled");
  })
  .catch(function(err){
    console.log("Error:",err);
  });
};

function trimId(userId){
  return userId.replace(/@|<|>/g,'');
}

module.exports = {
  planMeeting
};
