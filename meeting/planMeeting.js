var { findInvitees } = require('./findInvitees');
var { checkConflict } = require("./checkConflicts");
var { scheduleMeeting } = require("./scheduleMeeting");

function planMeeting(planner){
  var slackIds = planner.Pending.Invitees;
  var invitees;
  var noConflicts;
  slackIds.forEach((slackId)=>(trimId(slackId)));
  return findInvitees(slackIds)
  .then(function(resp){
    invitees = resp;
    invitees.push(planner);
    noConflicts = invitees.map((invitee)=>(checkConflicts(invitee)));
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
