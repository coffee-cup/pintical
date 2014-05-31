var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PageSchema = new Schema({
  name     : String,
  isPass : Boolean,
  messages : [{type  : Schema.Types.ObjectId, ref : 'Message'}],
  created  : {type   : Date, default              : Date.now},
  updated  : {type   : Date, default              : Date.now}
});


module.exports = mongoose.model('Page', PageSchema);
