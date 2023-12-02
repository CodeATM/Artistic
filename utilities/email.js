const nodemailer = require('nodemailer')

const sendEmail = async options =>{
    const transporter = nodemailer.createTransport({
        // services: 'Gmail',
        // auth: {
        //     user:,
        //     pass:
        // }

        // //activate less secured app
    })

    const mailOptions = {
        from: 'CyberAtm <atmnation2004@gmail.com/>',
        to: options.sendEmail,
        subject: options.subject,
        text: options.message
    };


   await transporter.sendMail(mailOptions)
}

module.exports = sendEmail;