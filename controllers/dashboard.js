const express = require('express');
const middleware = require('../config/middleware');
const Lecture = require('../models/lecture');
const Professor = require('../models/professor');
const Course = require('../models/course');
const Admin = require('../models/admin');
const emails = require('../config/email');
const plugins = require('../config/plugins');
const Institution = require('../models/institution');
const cloudinary = require('cloudinary').v2;
const ShortUniqueId = require('short-unique-id');

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
    res.render('studDashboard', { courses: [] });
};

module.exports.getLecture = async (req, res) => {
    // show all lectures in a class
    if (req.user.accountType == 'Student') {
        res.redirect(`/lectures/${req.query.id}/watch`);
    } else {
        res.render('lecture', { insights });
    }

};

module.exports.getWatchLecture = (req, res) => {
    // initiate AI engine + socket --> should student video be stored on timeline?
    if (req.user.accountType == 'Student') {
        let lectu;
        res.render('watchLecture.ejs');
    }
};

// PROFESSOR stuff
module.exports.getProfessorDashboard = async (req, res) => {
    let courses = await Course.find({ professor: req.user._id });
    res.render('profDashboard', { courses });
};

module.exports.getAddNewLecture = async (req, res) => {
    // show form for adding new class
    res.render('newLecture', { id: req.query.id || '' });
};

module.exports.postAddNewLecture = async (req, res) => {
    try {
        // parse & initiate AI vector DB
        let { title, course, upload } = req.body;
        console.log(req.body);
        let crs = await Course.findOne({ shortId: course.trim() });
        if (!crs) {
            throw new Error('Course not found');
        } else {
            console.log('waiting');
        }
        let date = new Date();
        let lecture = new Lecture({ title, course: crs._id, date, recording: upload });
        await lecture.save();
        res.redirect('/courses/' + crs._id);
    } catch (err) {
        console.log(err);
        req.flash('error', err.message);
        res.redirect('/lectures/new');
    }
};

module.exports.getLectureInsights = async (req, res) => {
    let lecture = await Lecture.findOne({ _id: req.params.id });
    res.render('lectureInsights', { lecture });
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
    const od = new ShortUniqueId({ length: 10 });
    let shortId = od.rnd();
    let course = await new Course({ title, desc, institution: institution._id, professor: req.user, shortId }).save();
    let body = {
        "name": course._id
    };
    await fetch("https://agentverse.ai/v1/hosting/agents", {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.AGENTVERSE_API_KEY}`,
        },
        body
    })
        .then(async res => {
            course.meta = res.body;
            await course.save();
        })
        .catch(err => {
            console.log(err);
            req.flash('error', err.message);
            res.redirect('back');
        });
    res.redirect('/dashboard');
};

module.exports.getNewStudent = (req, res) => {
    res.render('studSignup');
};

module.exports.postNewStudent = async (req, res) => {
    try {
        let { firstName, lastName, username, courses } = req.body;
        if (firstName && lastName && username && courses) {
            courses = courses.trim().split(',').map(c => c.trim());
            let upCourses = [];
            courses.forEach(async id => {
                crs = await Course.findOne({ shortId: id });
                if (crs) upCourses.push(crs._id);
            });
            const password = await plugins.genPassword();
            let stud = new Student({ firstName, lastName, username, institution: req.user.institution, courses: upCourses });
            stud = await Student.register(stud, password);
            await emails.sendStudentConfirmation(stud, password);
            res.redirect('/dashboard');
        } else {
            throw new Error('All fields are required');
        }
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/students/new');
    }
};

module.exports.getCourse = async (req, res) => {
    try {
        let course = await Course.findOne({ _id: req.params.id });
        if (!course) throw new Error('Course not found');
        let lectures = await Lecture.find({ course: course._id }).sort({ date: -1 });
        res.render('course', { course, lectures });
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('/dashboard');
    }
};