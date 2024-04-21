const Institution = require('../models/institution');
let trustedEmails = ['jibrilasif@gmail.com', 'reecebuyan@gmail.com', 'egrimal1@uci.edu', 'hermosilloleoncio@gmail.com']; // add everyone's emails

module.exports.isTrusted = (email) => trustedEmails.includes(email);

module.exports.isValidEmail = (email) => {
    let regex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    return regex.test(email);
};

module.exports.isAdminDetailsValid = async (firstName, lastName, email, desc, institution) => {
    return new Promise(async (resolve, reject) => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !desc.trim() || !institution.trim()) {
            return reject('Missing details');
        }
        if (!(firstName.trim().length > 0)) {
            return reject('First name cannot be empty');
        }
        if (!(lastName.trim().length > 0)) {
            return reject('Last name cannot be empty');
        }
        if (!(module.exports.isValidEmail(email))) {
            return reject('Invalid email');
        }
        let institutionExists = await Institution.findOne({ shortId: institution });
        if (!(institutionExists)) {
            return reject('Institution does not exist - Check your iID');
        }
        return resolve(institutionExists);
    });
};

module.exports.isInstitutionDetailsValid = async (name, domain) => {
    return new Promise(async (resolve, reject) => {
        if (!name.trim() || !domain.trim()) {
            reject('Missing details');
        }
        let institutionExists = await Institution.findOne({ $or: [{ name }, { domain }] });
        if (institutionExists) {
            reject('Institution details duplicated');
        } else {
            resolve();
        }
    });
};

module.exports.genPassword = () => {
    return new Promise((resolve, reject) => {
        let length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        resolve(retVal);
    });
};