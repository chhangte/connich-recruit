const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    // Identity
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers, and hyphens'],
    },
    name: { type: String, required: true, trim: true },
    tagline: { type: String, default: '' },
    about: { type: String, default: '' },
    industry: { type: String, default: '' },
    location: { type: String, default: '' },

    // Branding
    logoUrl: { type: String, default: '' },
    brandPrimary: { type: String, default: '#2563eb' },   // navbar / CTA color
    brandAccent: { type: String, default: '#1e3a5f' },    // hero gradient dark end

    // Public links
    website: { type: String, default: '' },
    socialLinks: {
        linkedin:  { type: String, default: '' },
        twitter:   { type: String, default: '' },
        facebook:  { type: String, default: '' },
        instagram: { type: String, default: '' },
    },

    // Ownership — RECRUITER user who created/manages this company
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    // Visibility control
    isPublic: { type: Boolean, default: true },

    // Reserved for future custom domain support
    customDomain: { type: String, default: '' },

    // Application Form Settings
    applicationSettings: {
        collectGender:        { type: Boolean, default: true },
        collectNationality:   { type: Boolean, default: true },
        collectEthnicity:      { type: Boolean, default: true },
        collectReligion:       { type: Boolean, default: true },
        collectCategory:       { type: Boolean, default: true },
        collectMaritalStatus:  { type: Boolean, default: true },
        collectFamilyInfo:     { type: Boolean, default: true },
        collectLanguages:      { type: Boolean, default: true },
        collectSports:         { type: Boolean, default: true },
        collectMusic:          { type: Boolean, default: true },
        collectArts:           { type: Boolean, default: true },
    },

    createdAt: { type: Date, default: Date.now },
});

// Index for fast owner lookup (slug already indexed via unique:true)
CompanySchema.index({ owner: 1 });

module.exports = mongoose.model('Company', CompanySchema);
