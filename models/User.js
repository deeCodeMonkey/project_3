const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    linkedInId: String,
    fullName: String,
    email: String,
    photo: String,
    headline: String,
    location: String
});

//instance of User record in 'users' collection with userSchema
var User = mongoose.model('users', userSchema);

module.exports = User;