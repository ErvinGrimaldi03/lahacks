const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/home');
const middleware = require('../config/middleware');

router.get('/', controller.index);


module.exports = router;