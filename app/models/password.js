var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PasswordSchema = new Schema({
  password : String,
  _page : {type  : Schema.Types.ObjectId, ref : 'Page'},
  created  : {type   : Date, default              : Date.now},
});


module.exports = mongoose.model('Password', PasswordSchema);
