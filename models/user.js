var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    
// ESQUEMA config
var userSchema = mongoose.Schema({
    username: String,
    password: String
});

// PASSPORT MONGOOSE config
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);