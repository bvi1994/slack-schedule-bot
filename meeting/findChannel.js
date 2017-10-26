var { WebClient } = require('@slack/client');
var token = process.env.SLACK_API_TOKEN || '';
var web = new WebClient(token);

web.users.list().
then(function(resp){
  console.log(resp);
})
.catch(function(err){
  console.log('Error:',err);
})

function findChannel(userId, botId){

}

module.exports = {
  findChannel
};
