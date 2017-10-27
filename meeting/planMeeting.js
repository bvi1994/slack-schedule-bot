var { findInvitees } = require('./findInvitees');
var { checkConflict } = require("./checkConflict");
var { scheduleMeeting } = require("./scheduleMeeting");

function planMeeting(planner){
  var slackIds = planner.Pending.Invitees;
  var noConflicts;
  slackIds = slackIds.map((slackId)=>(trimId(slackId)));
  return findInvitees(slackIds)
  .then(function(invitees){
    invitees.push(planner);
    noConflicts = invitees.map((invitee)=>(checkConflict(invitee, planner.Pending)));
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
