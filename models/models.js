var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;
var { WebClient } = require('@slack/client');
var token = process.env.SLACK_API_TOKEN || '';
var web = new WebClient(token);

var UserSchema = new mongoose.Schema({
    Google:  {
        isSetupComplete: {
            type: Boolean,
            default: false
        },
        tokens: Object
    },
    Pending: {
        type: Object,
        default: null
    },
    Name: {
      type: String,
      required: true
    },
    RealName: {
      type: String,
      required: true
    }
});

UserSchema.statics.findOrCreate = function(Name) {
  var user;
  return User.findOne({ Name })
    .then(function(u) {
      if(u) {
        found = true;
        user = u;
        return false;
      }
      else {
        return web.users.info(Name);
      }
    })
    .then(function(userInfo){
      if(userInfo){
        return new User({ Name, RealName: userInfo.user.profile.real_name || userInfo.user.profile.display_name }).save();
      }
      else{
        return user;
      }
    })
    .catch(function(err){
      console.log('Error:', err);
    });
};

var User =  mongoose.model('User', UserSchema);

var ReminderSchema = new mongoose.Schema({
    Subject:  {
        type: String,
        require: true
    },
    Date: {
        type: Date,
        required: true
    },
    UserId: {
      type: String,
      required: true
    }
});

ReminderSchema.statics.findUpcoming = function() {
  var today = new Date();
  today.setHours(0,0,0,0);
  var tomorrow = new Date();
  tomorrow.setDate(today.getDate()+1);
  tomorrow.setHours(0,0,0,0);
  console.log("Today:",today);
  console.log("Tomorrow:",tomorrow);
  return Reminder.find({
    $or: [ { Date: today }, { Date: tomorrow }]
  })
  .catch(function(err){
    console.log('Error:',err);
  })
};

var Reminder = mongoose.model('Reminder', ReminderSchema);

module.exports = {
  User,
  Reminder
};
