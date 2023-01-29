const nodemailer = require('nodemailer');

module.exports = async function(toEmail, text) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'rsbank.verify@gmail.com',
          pass: 'qftlbygmvdthtopj',
        },
        tls: {
            rejectUnauthorized: false
        }
    })

    await transporter.sendMail({
        from: '"RSBank Verify" <rsbank.verify@gmail.com>',
        to: `${toEmail}`,
        subject: 'Secury code',
        text: `${text}`,
    })
    return {
        success: true,
        message: 'Success'
    }
}