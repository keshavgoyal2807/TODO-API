var mongoose = require('mongoose');

// mongoose.Promise=global.Promise;
mongoose.connect('mongodb://keshav2807:keshav@28/heroku@ds054308.mlab.com:54308/heroku-database');


module.exports = {
    mongoose
};