const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/dashboard');
const middleware = require('../config/middleware');
const multer = require('multer');
const { cloudinary, storage } = require('../config/cloudinary');
const upload = multer({ storage });

router.get('/dashboard', middleware.isLoggedIn, controller.getDashboard);

router.get('/admins/dashboard', middleware.isLoggedIn, middleware.isAdmin, controller.getAdminDashboard);

router.get('/admins/professors/new', middleware.isLoggedIn, middleware.isAdmin, controller.getAddProfessor);

router.post('/admins/professors/new', middleware.isLoggedIn, middleware.isAdmin, controller.postAddProfessor);

router.get('/students/dashboard', middleware.isLoggedIn, middleware.isStudent, controller.getStudentDashboard);

router.get('/students/new', middleware.isLoggedIn, middleware.isAdmin, controller.getNewStudent);

router.post('/students/new', middleware.isLoggedIn, middleware.isAdmin, controller.postNewStudent);

router.get('/lectures/new', middleware.isLoggedIn, middleware.isProf, controller.getAddNewLecture);

router.post('/lectures/new', middleware.isLoggedIn, middleware.isProf, controller.postAddNewLecture);

router.get('/lectures/:id', middleware.isLoggedIn, middleware.canViewLecture, controller.getLecture);

router.get('/lectures/:id/insights', middleware.isLoggedIn, middleware.canViewLecture, middleware.canInsightLecture, controller.getLectureInsights);

// API for TA
router.get('/lectures/:id/watch', middleware.isLoggedIn, middleware.isStudent, controller.watchingLecture);

// API for Insight Engine

router.get('/professors/dashboard', middleware.isLoggedIn, middleware.isProf, controller.getProfessorDashboard);

router.get('/courses/new', middleware.isLoggedIn, middleware.isProf, controller.getNewCourse);

router.post('/courses/new', middleware.isLoggedIn, middleware.isProf, upload.single('upload'), controller.postNewCourse);

router.get('/courses/:id', middleware.isLoggedIn, middleware.canViewCourse, controller.getCourse);



module.exports = router;