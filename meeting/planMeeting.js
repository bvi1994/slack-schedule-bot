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
    console.log('No conflicts:',noConflicts);
    if(noConflicts.indexOf(false)<0){
      return Promise.all(invitees.map((invitee,index)=>{
        return scheduleMeeting(invitee,planner.Pending);
      }));
    }
    console.log('Thinks there is a conflict.');
    var conflictInvitees = invitees.filter(function(invitee, index){
      return !noConflicts[index];
    });
    console.log('Conflicts found:',conflictInvitees.map((invitee)=>(invitee.Name)));
    return Promise.resolve(conflictInvitees.map((invitee)=>(invitee.Name)));
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
