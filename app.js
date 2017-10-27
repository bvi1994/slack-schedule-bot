var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var { createReminder } = require('./reminders/createReminder');
var { User } = require('./models/models');
var { askForCalendarAccess, cancelIntent, handleReminderIntent, handleMeetingIntent } = require('./App/intents');
var axios = require('axios');
var { WebClient } = require('@slack/client');
var token = process.env.SLACK_API_TOKEN || '';
var web = new WebClient(token);
var { findChannel } = require('./reminders/findChannel');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./example-rtm-client');
var google = require('./google');

app.post('/interactive', function(req, res) {
  var isGoogleRequest = false;
  if(req.body.payload){
    var resp = JSON.parse(req.body.payload);
    var saveEvent = resp.actions[0].value === 'yes';
    var intent = resp.actions[0].name === 'reminder.add' ? 'Reminder' : 'Meeting';
    var name = resp.user.id
  }
  else{
    isGoogleRequest = true;
    var saveEvent = true;
    var name = req.body.name;
    var intent = req.body.intent === 'reminder.add' ? 'Reminder' : 'Meeting';
  }
  var message;
  var user;
  User.findOne({Name: name})
  .then(function(u){
    user = u;
    if (!saveEvent){
      return cancelIntent(user, intent);
    }
    if (!user.Google.isSetupComplete){
      return askForCalendarAccess(user);
    }
    if (intent === 'Reminder') {
      return handleReminderIntent(user);
    }
    return Promise.resolve('Not dealing with meetings yet.');
    // return handleMeetingIntent(user);
  })
  .then(function(m){
    if(m.match('Please give me permission')){
      res.send(m);
      return Promise.resolve(false);
    }
    message = m;
    return findChannel(user.Name);
  })
  .then(function(channel){
    if(channel && isGoogleRequest){
      return web.chat.postMessage(channel, message);
    }
    else{
      res.send(message);
    }
  })
  .then(function(){
    res.end();
  })
  .catch(function(err){
    res.send('Error:' + err);
  });
});

app.get('/setup', function(req, res){
  var url = google.generateAuthUrl(req.query.Name);
  res.redirect(url);
});

app.get('/google/callback', function(req, res){
  var user;
  var tokens;
  User.findOne({ Name : req.query.state })
    .then(function(u) {
      user = u;
      return google.getToken(req.query.code);
    })
    .then(function(t){
      tokens = t;
      user.Google.tokens = Object.assign({}, tokens);
      user.Google.isSetupComplete = true;
      // console.log(user.Google);
      return user.save();
    })
    .then(function(){
      return axios.post(`${process.env.DOMAIN}/interactive`, {
          name: user.Name,
          intent: 'reminder.add'
      });
    })
    .then(function(){
      res.send('Google authentication successful and event created.');
    })
    .catch(function(err){
      console.log('Error:',err);
    });
});

app.listen(process.env.PORT || 3000);
