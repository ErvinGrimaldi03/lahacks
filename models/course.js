const mongoose = require('mongoose');
const plugins = require('../config/plugins');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String, required: true },
    professor: { type: mongoose.Types.ObjectId, ref: 'Professor' },
    agent: {
        id: { type: String },
        meta: { type: Object }
    },
    textbook: {
        path: { type: String, required: false },
        name: { type: String, required: false }
    },
    shortId: { type: String, required: true },
    institution: { type: mongoose.Schema.Types.ObjectId, ref: 'Institution', required: true }
});
module.exports = mongoose.model('Course', courseSchema);

