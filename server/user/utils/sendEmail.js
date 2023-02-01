import ndm from 'nodemailer';
const { createTransport } = ndm;

export default async function(toEmail, text) {
    let transporter = createTransport({
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
