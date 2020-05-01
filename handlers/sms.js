const twilio = new (require('twilio'))(process.env.TWILIO_ACSID, process.env.TWILIO_TOKEN);

module.exports.send = (mobile, body) => {
    twilio.messages.create({
        body: body,
        messagingServiceSid: process.env.TWILIO_SMSID,
        to: `+55${mobile}`
    });
}
