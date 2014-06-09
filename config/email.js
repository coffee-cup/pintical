var nodemailer = require("nodemailer");
var secrets = require('./secrets.js');
var logger = require('../app/logger.js')

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: secrets.GMAIL_USERNAME,
    pass: secrets.GMAIL_PASSWORD
  }
});

module.exports.sendMail = function(text) {
  // setup email
  var mailOptions = {
    from: secrets.GMAIL_USERNAME,
    to: secrets.GMAIL_USERNAME,
    subject: 'PINTICAL CONTACT EMAIL',
    text: text
  };

// send mail with defined tranport object
  smtpTransport.sendMail(mailOptions, function(err, response) {
    if (err) {
      logger.error(err);
    }else {
      logger.info('messages sent: ' + response.message);
    }
  });
}
