const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    applicant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    details: {
        phone: String,
        address: String,
        education: String,
        experience: String,
        additionalInfo: String
    },
    status: { 
        type: String, 
        enum: ['PENDING', 'SHORTLISTED', 'REJECTED'], 
        default: 'PENDING' 
    },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
