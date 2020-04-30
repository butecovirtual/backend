
module.exports.send = (mobile, body) => {
    twilio.messages.create({
        body: body,
        messagingServiceSid: process.env.TWILIO_SMSID,
        to: `+55${mobile}`
    });
}
