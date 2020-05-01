var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var _getMoney = (num) => (num / 100).toFixed(2);
var _setMoney = (num) => (num * 100);

var liveSchema = new Schema({
    createdAt: { type: Date, required: true, default: new Date(), expires: 7*24*60*60 /* 7 days */ },
    artist: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    when: { type: Date, required: true },
    status: { type: String, required: true, default: 'Agendada' },
    valueBase: { type: Number, required: true, default: 0, get: _getMoney, set: _setMoney },
    valueTable: { type: Number, required: true, default: 0, get: _getMoney, set: _setMoney },
    sponsors: [String]
});

module.exports = mongoose.model('Live', liveSchema);
