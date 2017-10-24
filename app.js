var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var User = require('./models/models');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./example-rtm-client');

app.post('/interactive', function(req, res) {
  var resp = JSON.parse(req.body.payload)
  console.log(resp);
  User.findOne({Name: resp.user.id}, function(err, user){
      user.Pending = null;
      user.save(function(err){
          if (err){
              console.log('error saving empty pending', err);
          }
      })
  })
  if (resp.actions[0].value === 'no'){
      res.send('Reminder not added');
  } else {
      res.send('Reminder added');
  }
});

app.listen(3000);
