const plugins = require('./plugins');
const Admin = require('../models/admin');
const Course = require('../models/course');
const Lecture = require('../models/lecture');

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
        console.log('IS PROF')
        return next();
    } else {
        req.flash('error', 'That page is currently unavailable.');
        res.redirect('/login');
    }
};

module.exports.canViewLecture = async (req, res, next) => {
    try {
        // create a plugin to query for institution id and whether lecture is within that institution
        const lecture = await Lecture.findById(req.params.id).populate('course');
        if (lecture.course.institution == req.user.institution) {
            if (req.user.type == 'Student') {
                return res.redirect(`/lectures/${req.params.id}/watch`);
            } else {
                next();
            }
        }
    } catch (err) {
        req.flash('error', 'That page is currently unavailable.');
        res.redirect('/dashboard');
    }

};

module.exports.canInsightLecture = (req, res, next) => {
    // create a plugin to query whether lecture is within that institution & if admin/prof is of the lecture
    if (req.user.type == 'Admin' || req.user.type == 'Professor') {
        next();
    } else {
        req.flash('error', 'That page is currently unavailable.');
        res.redirect('/dashboard');
    }
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

module.exports.canViewCourse = async (req, res, next) => {
    let course = await Course.findById(req.params.id);
    if (course.institution.equals(req.user.institution)) {
        next();
    } else {
         console.log(course.institution, req.user.institution);
        req.flash('error', 'That page is currently unavailable.');
        res.redirect('/dashboard');
    }
};