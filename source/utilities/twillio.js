// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
var accountSid = "ACa92575359619ea8bff88a4f268059178";
var authToken = "be53e14acd06915322658ffa30c5d593";
var verifySid = "VA11e76fbb5f53f6acb93436a8b0488b30";
var client = require("twilio")(accountSid, authToken);
client.verify.v2
    .services(verifySid)
    .verifications.create({ to: "+923136320989", channel: "sms" })
    .then(function (verification) { return console.log(verification.status); })
    .then(function () {
    var readline = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    readline.question("Please enter the OTP:", function (otpCode) {
        client.verify.v2
            .services(verifySid)
            .verificationChecks.create({ to: "+923136320989", code: otpCode })
            .then(function (verification_check) { return console.log(verification_check.status); })
            .then(function () { return readline.close(); });
    });
});
//# sourceMappingURL=twillio.js.map