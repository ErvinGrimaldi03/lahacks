const plugins = require('./plugins');
const Admin = require('../models/admin');

module.exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'Please log in.');
        res.redirect('/login');
    }
};

module.exports.notLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.flash('error', 'That page is currently unavailable.');
        return res.redirect('/dashboard');
    } else {
        next();
    };
};

module.exports.isMainAdmin = (req, res, next) => {
    if (req.query && req.query.email && plugins.isTrusted(req.query.email) && req.query.smcode == process.env.SMCODE) {
        return next();
    } else {
        req.flash('error', 'That page is currently unavailable.');
        res.redirect('/login');
    }
};

module.exports.isAdmin = (req, res, next) => {
    if (req.user.accountType == 'Admin') {
        return next();
    } else {
        req.flash('error', 'That page is currently unavailable.');
        res.redirect('/login');
    }
};

module.exports.isStudent = (req, res, next) => {
    if (req.user.accountType == 'Student') {
        return next();
    } else {
        req.flash('error', 'That page is currently unavailable.');
        res.redirect('/login');
    }
};

module.exports.isProf = (req, res, next) => {
    if (req.user.accountType == 'Professor') {
        return next();
    } else {
        req.flash('error', 'That page is currently unavailable.');
        res.redirect('/login');
    }
};

module.exports.canViewLecture = (req, res, next) => {
    // create a plugin to query for institution id and whether lecture is within that institution
};

module.exports.canInsightLecture = (req, res, next) => {
    // create a plugin to query whether lecture is within that institution & if admin/prof is of the lecture
};

module.exports.adminNotConfirmed = async (req, res, next) => {
    if (!req.user.finalized) {
        next();
    } else {
        req.flash('You have already confirmed your account.');
        res.redirect('/dashboard');
    }
};

module.exports.adminConfirmed = async (req, res, next) => {
    if (req.user.finalized) {
        next();
    } else {
        req.flash('Please confirm your account.');
        res.redirect('/admins/finalize');
    }
};