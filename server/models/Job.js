const mongoose = require('mongoose');

// Available application fields a recruiter can request
// Keys are canonical field names; the Apply page renders based on this list.
const KNOWN_APPLICATION_FIELDS = [
    'phone', 'dob', 'address', 'maritalStatus',
    'familyInfo', 'educationHistory', 'experience', 'reference',
];

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    location: { type: String, default: 'On-site' },
    department: String,
    salary: String,
    status: {
        type: String,
        enum: ['OPEN', 'CLOSED'],
        default: 'OPEN'
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Multi-tenant isolation key — links job to its Company tenant
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        index: true,
    },
    // Hiring timeline
    hiringMode: {
        type: String,
        enum: ['ROLLING', 'DEADLINE'],
        default: 'ROLLING'
    },
    lastDateToApply: { type: Date },
    interviewDate: { type: Date },
    interviewVenue: { type: String, default: '' },
    // Recruiter-selected application fields
    // Always includes 'name' and 'email' implicitly.
    applicationFields: {
        type: [String],
        default: ['phone', 'dob', 'address', 'maritalStatus', 'familyInfo', 'educationHistory', 'experience'],
    },
    applicationSettings: {
        collectGender:         { type: Boolean, default: true },
        collectNationality:    { type: Boolean, default: true },
        collectEthnicity:      { type: Boolean, default: true },
        collectReligion:       { type: Boolean, default: true },
        collectCategory:       { type: Boolean, default: true },
        collectMaritalStatus:  { type: Boolean, default: true },
        collectFamilyInfo:     { type: Boolean, default: true },
        collectPhone:          { type: Boolean, default: true },
        collectDOB:            { type: Boolean, default: true },
        collectAddress:        { type: Boolean, default: true },
        collectEducation:      { type: Boolean, default: true },
        collectExperience:     { type: Boolean, default: true },
        collectReference:      { type: Boolean, default: true },
        collectLanguages:      { type: Boolean, default: true },
        collectSports:         { type: Boolean, default: true },
        collectMusic:          { type: Boolean, default: true },
        collectArts:           { type: Boolean, default: true },
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
