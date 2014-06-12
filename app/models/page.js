var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PageSchema = new Schema({
  name     : String,
  isPass   : Boolean,
  messages : [{type   : Schema.Types.ObjectId, ref : 'Message'}],
  messagesLength: Number,
  created  : {type    : Date, default              : Date.now},
  updated  : {type    : Date, default              : Date.now}
});

PageSchema.pre('save', function(next) {
  if (!this.messagesLength) {
    this.messagesLength = this.messages.length + 1;
  }else {
    this.messagesLength += 1;
  }

  next();
});


module.exports = mongoose.model('Page', PageSchema);
