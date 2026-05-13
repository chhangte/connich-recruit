const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const { generateSlug, uniqueSlug } = require('./company');
const router = express.Router();

/* ── Helper: build safe user payload ──────────────────────── */
const userPayload = (user, company = null) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    company: user.company,
    companyId: user.companyId || null,
    companySlug: company?.slug || null,
    profile: user.profile,
});

/* ── Register ──────────────────────────────────────────────── */
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, company: companyData } = req.body;
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const userData = { name, email, password, role };

        // For recruiters: embed legacy company data AND create Company document
        if (role === 'RECRUITER' && companyData) {
            userData.company = companyData;
        }

        const user = new User(userData);
        await user.save();

        let company = null;

        if (role === 'RECRUITER' && companyData?.name) {
            try {
                const baseSlug = companyData.slug
                    ? companyData.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                    : generateSlug(companyData.name);
                const slug = await uniqueSlug(baseSlug);

                company = new Company({
                    slug,
                    name: companyData.name,
                    tagline: companyData.tagline || '',
                    about: companyData.about || '',
                    industry: companyData.industry || '',
                    location: companyData.location || '',
                    website: companyData.website || '',
                    logoUrl: companyData.logoUrl || '',
                    brandPrimary: companyData.brandPrimary || '#2563eb',
                    brandAccent: companyData.brandAccent || '#1e3a5f',
                    socialLinks: companyData.socialLinks || {},
                    owner: user._id,
                });
                await company.save();

                // Link user to company
                user.companyId = company._id;
                await user.save();
            } catch (companyErr) {
                console.error('Company creation failed during register:', companyErr);
                // Non-fatal: user is still created, they can set up company via dashboard
            }
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, companySlug: company?.slug || null },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ token, user: userPayload(user, company) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Login ─────────────────────────────────────────────────── */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Fetch associated company for recruiter
        let company = null;
        if (user.role === 'RECRUITER') {
            company = await Company.findOne({ owner: user._id });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, companySlug: company?.slug || null },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.json({ token, user: userPayload(user, company) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Update company profile (recruiter) ───────────────────── */
router.patch('/company/:userId', async (req, res) => {
    try {
        const { company: companyData } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { company: companyData },
            { new: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Sync to Company document if it exists
        const company = await Company.findOneAndUpdate(
            { owner: user._id },
            {
                $set: {
                    name: companyData.name || '',
                    tagline: companyData.tagline || '',
                    about: companyData.about || '',
                    industry: companyData.industry || '',
                    location: companyData.location || '',
                    website: companyData.website || '',
                    logoUrl: companyData.logoUrl || '',
                    brandPrimary: companyData.brandPrimary,
                    brandAccent: companyData.brandAccent,
                    applicationSettings: companyData.applicationSettings
                }
            },
            { new: true }
        );

        res.json({ user: userPayload(user, company) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Update user profile (applicant) ─────────────────────── */
router.patch('/user/:userId', async (req, res) => {
    try {
        const { name, email, password, profile } = req.body;
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.password = password; // triggers pre-save hook
        if (profile) user.profile = { ...user.profile.toObject(), ...profile };

        await user.save();

        res.json({ user: userPayload(user) });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
