const nodemailer = require("nodemailer");

class Email {
    constructor() {
        this.name = "sfs";
    }

    async getTestAccount() {
        this.testAccount = await nodemailer.createTestAccount();
    }
    getTransporter() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: this.testAccount.user, // generated ethereal user
                pass: this.testAccount.pass // generated ethereal password
            }
        });
    }

    async sendMail(email, name, welcome) {
        try {
            if (!this.testAccount) {
                await this.getTestAccount();
                this.getTransporter();
            }
            const text = welcome
                ? `Welcome to App ${name}`
                : `Hi ${name}, sorry for being a disappointment. GoodBye!`;
            const info = await this.transporter.sendMail({
                from: '"Fred Foo 👻" <foo@example.com>', // sender address
                to: email, // list of receivers
                subject: `Hello ${name}`, // Subject line
                text
                // html: "<b>Hello world?</b>" // html body
            });

            // console.log("Message sent: %s", info.messageId);
            // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        } catch (e) {
            console.log("Error", e);
        }
    }
}

module.exports = Email;
