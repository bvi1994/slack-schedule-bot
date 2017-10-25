var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var { User } = require('./models/models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./example-rtm-client');
var google = require('./google');

app.post('/interactive', function(req, res) {
  console.log(req.body.payload);
  var resp = JSON.parse(req.body.payload);
  var saveEvent = resp.actions[0].value === 'yes';
  var message;
  User.findOne({Name: resp.user.id})
  .then(function(user){
    if(saveEvent && !user.Google.isSetupComplete){
        message = `Hey. I'm a scheduler bot. I need permission to access your calendar application. Please give me permission to hack to your Google Calender. http://localhost:3000/setup?Name=${user.Name}`;
        return;
    }
    message = saveEvent ? "Reminder added." : "Reminder not added";
    user.Pending = null;
    return user.save();
  })
  .then(function(){
    console.log('User saved.');
    console.log('Message');
    res.send(message);
  })
  .catch(function(err){
    res.send('Error:' + err);
  });
});

app.get('/setup', function(req, res){
  var url = google.generateAuthUrl(req.query.Name);
  res.redirect(url);
  // console.log(url);
});

app.get('/google/callback', function(req, res){
  var user;
  var tokens;
  User.findOne({ Name : req.query.state })
    .then(function(u) {
      user = u;
      return google.getToken(req.query.code)
    })
    .then(function(t){
      tokens = t;
      user.Google.tokens = Object.assign({}, tokens);
      user.Google.isSetupComplete = true;
      console.log(user.Google);
      return user.save();
    })
    .then(function(){
      res.send('Google authentication successful.');
    })
    .catch(function(err){
      console.log('Error:',err);
    });
});

app.listen(3000);
