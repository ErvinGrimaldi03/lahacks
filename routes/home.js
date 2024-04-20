const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/home');
const middleware = require('../config/middleware');




module.exports = router;