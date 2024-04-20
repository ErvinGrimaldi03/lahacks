const express = require('express');
const middleware = require('../config/middleware');

module.exports.index = async (req, res) => {
    res.render('index');
};