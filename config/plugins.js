
let trustedEmails = ['jibrilasif@gmail.com', 'reecebuyan@gmail.com', 'egrimal1@uci.edu', 'hermosilloleoncio@gmail.com']; // add everyone's emails

module.exports.isTrusted = (email) => trustedEmails.includes(email);