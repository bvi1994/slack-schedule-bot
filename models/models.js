var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);


var UserSchema = new mongoose.Schema({
    Google: Object,
    Pending: {
        type: Object,
        default: null
    },
    Name: String
})

module.exports =  mongoose.model('User', UserSchema);
