var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI);

var Schema = mongoose.Schema();

var User = new Schema({
    google: Object,
    pending: {
        subject: String,
        date: Date
    },
})

modules.export = {
    User
};
