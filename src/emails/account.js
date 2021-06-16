const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alex.trejo@boredaf.io',
        subject: 'Thanks for joining in!',
        html: `<p>Welcome to BOREDAF, ${name}. Let me know how you get along with the app.</p><br /><hr />Best,<br/><strong>Alejandro Trejo</strong><br />www.boredaf.io`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'alex.trejo@boredaf.io',
        subject: 'Sorry to see you go',
        html: `<p>Sorry to see you go, ${name}. Please let us know what we could do to improve.</p><br /><hr />Best,<br/><strong>Alejandro Trejo</strong><br />www.boredaf.io`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}