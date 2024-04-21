const mongoose = require('mongoose');
const plugins = require('../config/plugins');

const recordingSchema = new mongoose.Schema({
    logs: [{
        timeStamp: { type: Number, required: true },
        emotion: { type: String, required: true },
        score: { type: Number, required: true }
    }]
});

module.exports = mongoose.model('Recording', recordingSchema);