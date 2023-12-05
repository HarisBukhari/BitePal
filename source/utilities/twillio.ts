// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "ACa92575359619ea8bff88a4f268059178"
const authToken = "be53e14acd06915322658ffa30c5d593"
const verifySid = "VA11e76fbb5f53f6acb93436a8b0488b30"
const client = require("twilio")(accountSid, authToken)

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+923136320989", channel: "sms" })
  .then((verification:any) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    readline.question("Please enter the OTP:", (otpCode: any) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+923136320989", code: otpCode })
        .then((verification_check: { status: any }) => console.log(verification_check.status))
        .then(() => readline.close())
    })
  })