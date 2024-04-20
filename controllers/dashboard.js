const express = require('express');
const middleware = require('../config/middleware');

module.exports.getDashboard = (req, res) => {
    switch (req.user.accountType) {
        case 'Admin':
            res.redirect('/admin/dashboard');
            break;
        case 'Student':
            res.redirect('/student/dashboard');
            break;
        case 'Professor':
            res.redirect('/professor/dashboard');
            break;
    }
};

// ADMIN stuff
module.exports.getAdminDashboard = (req, res) => {
    // get institution data

};

module.exports.getAddProfessor = (req, res) => {

};

module.exports.postAddProfessor = (req, res) => {

};

// STUDENT stuff
module.exports.getStudentDashboard = (req, res) => {

};

module.exports.getWatchVideo = (req, res) => {

};

// PROFESSOR stuff
module.exports.getProfessorDashboard = (req, res) => {
    res.render('professorDashboard');
};

module.exports.getAddNewClass = (req, res) => {
    
}

module.exports.postAddNewClass = (req, res) => {
    
};

module.exports.getAddNewVideo