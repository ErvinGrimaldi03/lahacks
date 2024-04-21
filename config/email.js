const { MailerSend, EmailParams, Sender, Recipient } = require("mailersend");

module.exports.sendAdminConfirmation = async (admin, password) => {
    return new Promise(async (resolve, reject) => {
        const mailerSend = new MailerSend({
            apiKey: process.env.MLSEND_DEMO_API,
        });
        const sentFrom = new Sender("jibrilasif@trial-vywj2lpzp9jg7oqz.mlsender.net", "LA Hacks");
        const recipients = [
            new Recipient(admin.username, `${admin.firstName} ${admin.lastName}`)
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject('Confirm your Administrator Account')
            .setHtml(`<p>This email contains your credentials for LA Hacks.</p><p>Email: <strong>${admin.username}</strong><br/>Password: <strong>${password}</strong><br/></p>`);

        await mailerSend.email.send(emailParams)
            .then(() => resolve())
            .catch(err => reject(err));
    });
};

module.exports.sendProfessorConfirmation = async (prof, password) => {
    return new Promise(async (resolve, reject) => {
        const mailerSend = new MailerSend({
            apiKey: process.env.MLSEND_DEMO_API,
        });
        const sentFrom = new Sender("jibrilasif@trial-vywj2lpzp9jg7oqz.mlsender.net", "LA Hacks");
        const recipients = [
            new Recipient(prof.username, `${prof.firstName} ${prof.lastName}`)
        ];

        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setReplyTo(sentFrom)
            .setSubject('Confirm your Professor Account')
            .setHtml(`<p>This email contains your credentials for LA Hacks.</p><p>Email: <strong>${prof.username}</strong><br/>Password: <strong>${password}</strong><br/></p>`);

        await mailerSend.email.send(emailParams)
            .then(() => resolve())
            .catch(err => reject(err));
    });
};