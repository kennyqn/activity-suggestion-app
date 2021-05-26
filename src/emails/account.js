const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kenny66nguyen@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'kenny66nguyen@gmail.com',
        subject: 'Sorry to see you go',
        text: `Sorry to see you go, ${name}. Please let us know what we could do to improve.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}