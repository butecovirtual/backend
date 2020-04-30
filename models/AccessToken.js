var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var acessTokenSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, required: true, default: new Date(), expires: 5*60 /* 5 min */ },
    token: { type: String, required: true }
});

acessTokenSchema.statics.findByUsersToken = function(username, token) {
    return this.findOne({ token: token }).populate({
        path: 'user',
        match: { username: new RegExp(username, 'i') }
    });
}

module.exports = mongoose.model('AccesToken', acessTokenSchema);
