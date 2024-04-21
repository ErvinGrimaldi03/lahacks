const plugins = require('../config/plugins');
const Admin = require('../models/admin');
const Institution = require('../models/institution');
const Student = require('../models/student');
const Professor = require('../models/professor');
const Lecture = require('../models/lecture');
const ShortUniqueId = require('short-unique-id');
const emails = require('../config/email');

module.exports.getLogin = (req, res) => {
    console.log(req.session);
    res.render('login');
};

module.exports.postLogin = async (req, res) => {
    console.log(req.session);
    delete req.session.redirectTo;
    req.flash('success', 'Welcome back to STEMplicity!');
    res.redirect('/dashboard');
};

module.exports.getInstitutionSignup = (req, res) => {
    res.render('institutionSignup', { institutionDetails: req.session.institutionDetails || { firstName: '', lastName: '', username: '', desc: '', institution: '' } });
};

module.exports.postInstitutionSignup = async (req, res) => {
    try {
        let { name, domain } = req.body;
        req.session.institutionDetails = req.body;
        await plugins.isInstitutionDetailsValid(name, domain);
        const iID = new ShortUniqueId({ length: 10 });
        let newId = iID.rnd();
        const institution = new Institution({
            name,
            domain,
            shortId: newId,
        });
        await institution.save();
        delete req.session.institutionDetails;
        req.session.adminDetails = { institution: institution.shortId, firstName: '', lastName: '', username: '', desc: '' };
        req.flash('success', 'Institution created successfully');
        res.redirect('/admins/signup?email=jibrilasif@gmail.com&smcode=29ruf9wheuehfh9whf32r9yfhewfiqdDWF98FIUHDe');
    } catch (err) {
        req.flash('error', err);
        res.redirect('/institution/signup');
    }
};

module.exports.getAdminSignup = (req, res) => {
    res.render('adminSignup', { adminDetails: req.session.adminDetails || { firstName: '', lastName: '', username: '', desc: '', institution: '' } });
};

module.exports.postAdminSignup = async (req, res) => {
    try {
        req.session.adminDetails = req.body;
        let { firstName, lastName, username, desc, institution } = req.body;
        console.log({ firstName, lastName, username, desc, institution });
        let inst = await plugins.isAdminDetailsValid(firstName, lastName, username, desc, institution);
        const password = await plugins.genPassword();
        const admin = new Admin({
            firstName,
            lastName,
            username,
            desc,
            institution: inst._id
        });
        const regAdmin = await Admin.register(admin, password);
        console.log(password);
        // send email
        await emails.sendAdminConfirmation(regAdmin, password);
        console.log(password);
        res.redirect('/');
    } catch (err) {
        console.log(err);
        req.flash('error', err);
        res.redirect('back');
    }
};

module.exports.getAdminResetPassword = (req, res) => {
    res.render('adminResetPassword');
};

module.exports.getAdminFinalize = (req, res) => {
    res.render('adminFinalize');
};

module.exports.postAdminFinalize = async (req, res) => {
    // do admin signup stuff
    if (req.body.password != req.body.confirmPassword) {
        req.flash('error', 'Passwords do not match');
        return res.redirect('/admins/finalize');
    } else {
        let admin = await Admin.findOne({ username: req.user.username });
        admin.setPassword(req.body.password);
    }
};
