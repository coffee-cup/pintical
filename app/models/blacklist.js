var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var blacklistSchema = new Schema({
  address: String,
  created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Blacklist', blacklistSchema);
