var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type: String, required: true, unique: true, lowercase: true, index: true },
    createdAt: { type: Date, required: true, default: new Date() },
    mobile: { type: String, required: true },
    artist: {
        name: { type: String, required: true },
        genre: { type: String, required: true },
        bio: String,
        instagram: String,
        youtube: String,
        facebook: String,
        spotify: String
    }
});

userSchema.statics.findByUsername = function(username) {
    return this.findOne({ username: new RegExp(username, 'i') });
};

module.exports = mongoose.model('User', userSchema);
