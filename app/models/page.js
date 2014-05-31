var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PageSchema = new Schema({
  name     : String,
  password : {type: Schema.Types.ObjectId, ref : 'Password'},
  messages : [{type  : Schema.Types.ObjectId, ref : 'Message'}],
  created  : {type   : Date, default              : Date.now},
  updated  : {type   : Date, default              : Date.now}
});


module.exports = mongoose.model('Page', PageSchema);
