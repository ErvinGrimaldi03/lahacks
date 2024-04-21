const mongoose = require('mongoose');
const plugins = require('../config/plugins');

const lectureSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    title: { type: String, required: true },
    totalViews: { type: Number, default: 0 },
    analysis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recording' }],
    transcription: {
        path: { type: String },
        name: { type: String }
    },
    recording: {
        type: String, required: true
    },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    summary: { type: String }
});

module.exports = mongoose.model('Lecture', lectureSchema);
