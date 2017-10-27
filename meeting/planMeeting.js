var { findInvitees } = require('./findInvitees');
var { checkConflict } = require("./checkConflict");
var { scheduleMeeting } = require("./scheduleMeeting");

function planMeeting(planner){
  var slackIds = planner.Pending.Invitees;
  var invitees;
  var noConflicts;
  slackIds = slackIds.map((slackId)=>(trimId(slackId)));
  return findInvitees(slackIds)
  .then(function(i){
    invitees = i;
    invitees.push(planner);
    return Promise.all(invitees.map((invitee)=>(checkConflict(invitee, planner.Pending))));
  })
  .then(function(resp){
    noConflicts = resp;
    return Promise.all(invitees.map((invitee,index)=>{
      if(noConflicts[index]){
        return scheduleMeeting(invitee,planner.Pending);
      }
      return new Promise(function(resolve, reject){
        resolve();
      });
    }));
  })
  .catch(function(err){
    console.log("Error scheduling meeting:", err);
  });
};

function trimId(userId){
  return userId.replace(/@|<|>/g,'');
}

module.exports = {
  planMeeting
};
