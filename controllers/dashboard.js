const express = require('express');
const middleware = require('../config/middleware');
const Lecture = require('../models/lecture');
const Professor = require('../models/professor');
const Course = require('../models/course');
const Admin = require('../models/admin');
const emails = require('../config/email');
const plugins = require('../config/plugins');
const Institution = require('../models/institution');


module.exports.getDashboard = (req, res) => {
    switch (req.user.accountType) {
        case 'Admin':
            res.redirect('/admins/dashboard');
            break;
        case 'Student':
            res.redirect('/students/dashboard');
            break;
        case 'Professor':
            res.redirect('/professors/dashboard');
            break;
    }
};

// ADMIN stuff
module.exports.getAdminDashboard = async (req, res) => {
    const professors = await Professor.find({ admin: req.user });
    // get institution data
    res.render('adminDashboard', { professors });

};

module.exports.getAddProfessor = (req, res) => {
    res.render('profSignup', { profDetails: typeof profDetails !== 'undefined' ? profDetails : { firstName: '', lastName: '', username: '' } });
};

module.exports.postAddProfessor = async (req, res) => {
    try {
        req.session.profDetails = req.body;
        let { firstName, lastName, username } = req.body;
        if (firstName && lastName && username) {
            const password = await plugins.genPassword();
            let prof = new Professor({ firstName, lastName, username, admin: req.user._id });
            prof = await Professor.register(prof, password);
            await emails.sendProfessorConfirmation(prof, password);
            res.redirect('/dashboard');
        }
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/admins/professors/new');
    }
};

// STUDENT stuff
module.exports.getStudentDashboard = async (req, res) => {
    // show classes
    let courses = await req.user.populate('courses');
    res.render('studentDashboard', { courses });
};

module.exports.getLecture = async (req, res) => {
    // show all lectures in a class
};

module.exports.getWatchLecture = (req, res) => {
    // initiate AI engine + socket --> should student video be stored on timeline?
};

// PROFESSOR stuff
module.exports.getProfessorDashboard = async (req, res) => {
    let courses = await Course.find({ professor: req.user._id });
    res.render('profDashboard', { courses });
};

module.exports.getAddNewLecture = (req, res) => {
    // show form for adding new class
};

module.exports.postAddNewLecture = (req, res) => {
    // parse & initiate AI vector DB
};

module.exports.getLectureInsights = async (req, res) => {

};

module.exports.watchingLecture = async (req, res) => {
    
};

module.exports.getNewCourse = async (req, res) => {
    res.render('newCourse');
};

module.exports.postNewCourse = async (req, res) => {
    let { title, desc } = req.body;
    let admin = await Admin.findOne({ _id: req.user.admin });
    let institution = await Institution.findOne({ _id: admin.institution });
    let course = await new Course({ title, desc, institution, professor: req.user }).save();
    let body = {
        "name": course._id
    };
    await fetch("https://agentverse.ai/v1/hosting/agents", {
        method: post,
        headers: {
            Authorization: `Bearer ${process.env.AGENTVERSE_API_KEY}`,
        },
        body
    })
        .then(res => {
            course.meta = res.body;
        })
        .catch(err => {
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        });

};