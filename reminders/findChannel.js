var { WebClient } = require('@slack/client');
var token = process.env.SLACK_API_TOKEN || '';
var web = new WebClient(token);

function findChannel(userId){
  return web.im.open(userId).
  then(function(resp){
    return resp.channel.id;
  })
  .catch(function(err){
    console.log('Error:',err);
  })
};

// TO TEST, UNCOMMENT LINES BELOW AND FILL IN A VALID USER ID
// findChannel('<VALID USER ID HERE>')
// .then(function(channel){console.log('Channel:',channel)}).catch(function(err){console.log('Error:',err)});

module.exports = {
  findChannel
};
