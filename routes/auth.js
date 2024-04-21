const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/auth');
const plugins = require('../config/plugins');
const passportLocalMongoose = require('passport-local-mongoose');
const LocalStrategy = require('passport-local').Strategy;
const middleware = require('../config/middleware');
const passport = require('passport');

router.get('/login', middleware.notLoggedIn, controller.getLogin);

router.post('/login', passport.authenticate(['admin', 'professor', 'student'], {
    failureRedirect: '/login',
    failureFlash: true,
    failureMessage: true,
}), controller.postLogin);

router.get('/institutions/signup', middleware.isMainAdmin, controller.getInstitutionSignup);

router.post('/institutions/signup', middleware.isMainAdmin, controller.postInstitutionSignup);

router.get('/admins/signup', middleware.isMainAdmin, controller.getAdminSignup);

router.post('/admins/signup', middleware.isMainAdmin, controller.postAdminSignup);

router.get('/admins/finalize', middleware.isLoggedIn, middleware.isAdmin, middleware.adminNotConfirmed, controller.getAdminFinalize);


// router.get('/admin/reset-password', middleware.isLoggedIn, middleware.isAdmin, controller.getAdminResetPassword);



module.exports = router;