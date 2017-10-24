var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var User = require('./models/models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./example-rtm-client');
var google = require('./google');

app.post('/interactive', function(req, res) {
  var resp = JSON.parse(req.body.payload)
  console.log(resp);
  User.findOne({Name: resp.user.id})
  .then(function(user){
    if(resp.actions[0].value === 'yes'){
      if(!user.Google){
        res.send(`Hey. I'm a scheduler bot. I need permission to access your calander application. Please give me permission to hack to your Google Calander. http://localhost:3000/setup`);
      }
      else {
        user.Pending = null;
        user.save()
        .then(function(){
          res.send('Reminder added')
        })
        .catch(function(err){
          res.send("Error saving user:" + err);
        });
      }
    }
    else{
      user.Pending = null;
      user.save()
      .then(function(){
        res.send('Reminder not added')
      })
      .catch(function(err){
        res.send("Error saving user:" + err);
      });
      // res.send('Reminder not added');
    }
  })
  .catch(function(err){
    res.send('Error finding user:' + err);
  });
});

app.get('/setup', function(req, res){
  var url = google.generateAuthUrl();
  res.redirect(url);
  // console.log(url);
});

app.get('/google/callback', function(req, res){
  res.send("We now have access to your Google Calander!");
})

app.listen(3000);
