var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var messageSchema = new Schema({
  body    : String,
  _owner  : {type   : String, ref   : 'Page'},
  created : {type   : Date, default : Date.now},
  updated : {type   : Date, default : Date.now}
});

module.exports = mongoose.model('Message', messageSchema);
