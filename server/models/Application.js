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
        // Personal
        name: String,
        email: String,
        phone: String,
        address: String,
        dob: String,
        maritalStatus: String,
        // Family
        fatherName: String,
        fatherPhone: String,
        motherName: String,
        motherPhone: String,
        // Education
        highestQualification: String,
        discipline: String,
        primarySchool: String,
        middleSchool: String,
        highSchool: String,
        higherSecondarySchool: String,
        undergraduateInstitute: String,
        postgraduateInstitute: String,
        // Experience
        experience: String,
        referenceeName: String,
        referencePhone: String,
    },
    status: {
        type: String,
        enum: ['PENDING', 'SHORTLISTED', 'REJECTED'],
        default: 'PENDING'
    },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
