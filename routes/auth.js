const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/auth');
const plugins = require('../config/plugins');
const middleware = require('../config/middleware');

router.get('/login', middleware.notLoggedIn, controller.getLogin);

// router.get('/admin/signup')

module.exports = router;