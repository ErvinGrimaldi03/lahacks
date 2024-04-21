const mongoose = require('mongoose');
const plugins = require('../config/plugins');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    
});

module.exports = mongoose.model('Admin', adminSchema);

