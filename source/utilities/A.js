const accountSid = 'ACa92575359619ea8bff88a4f268059178';
const authToken = '7a272f8c1913f08976b1cd2e3345a3ed';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'kjsafhadjfhlalsflajsslfhjlasshjlfhljahwlfjhljaef',
        from: '+12394490950',
        to: '+923136320989'
    })
    .then(message => console.log(message.sid))
    .done();