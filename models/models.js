var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);
mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema({
    Google: {
      isSetupComplete: {
        type: Boolean,
        default: false
      },
      tokens: {
        type: Object,
        default: null
      }
    },
    Pending: {
        type: Object,
        default: null
    },
    Name: {
      type: String,
      required: true
    }
});

UserSchema.statics.findOrCreate = function(Name) {
  return User.findOne({ Name })
    .then(function(user) {
      if(user) {
        return user;
      }
      else {
        return new User({ Name }).save();
      }
    })
    .catch(function(err){
      console.log('Error:',err);
    })
};

var User =  mongoose.model('User', UserSchema);

module.exports = {
  User
};
