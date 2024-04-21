const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/dashboard');
const middleware = require('../config/middleware');

router.get('/dashboard', middleware.isLoggedIn, controller.getDashboard);

router.get('/admins/dashboard', middleware.isLoggedIn, middleware.isAdmin, controller.getAdminDashboard);

router.get('/admins/professors/new', middleware.isLoggedIn, middleware.isAdmin, controller.getAddProfessor);

router.post('/admins/professors/new', middleware.isLoggedIn, middleware.isAdmin, controller.postAddProfessor);

router.get('/students/dashboard', middleware.isLoggedIn, middleware.isStudent, controller.getStudentDashboard);

router.get('/lectures/new', middleware.isLoggedIn, middleware.isProf, controller.getAddNewLecture);

router.post('/lectures/new', middleware.isLoggedIn, middleware.isProf, controller.postAddNewLecture);

router.get('/lectures/:id', middleware.isLoggedIn, middleware.canViewLecture, controller.getLecture);

router.get('/lectures/:id/insights', middleware.isLoggedIn, middleware.isProf, middleware.canInsightLecture, controller.getLectureInsights);

// API for TA
router.get('/lectures/:id/watch', middleware.isLoggedIn, middleware.isStudent, controller.watchingLecture);

// API for Insight Engine

router.get('/professors/dashboard', middleware.isLoggedIn, middleware.isProf, controller.getProfessorDashboard);



module.exports = router;