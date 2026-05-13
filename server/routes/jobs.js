const express = require('express');
const Job = require('../models/Job');
const Company = require('../models/Company');
const router = express.Router();

// Get all open jobs (platform-level — all companies)
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'OPEN', showOnHome: { $ne: false } })
            .populate('postedBy', 'name company')
            .populate('companyId', 'name slug logoUrl brandPrimary industry location')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get jobs posted by a specific recruiter
router.get('/recruiter/:userId', async (req, res) => {
    try {
        const jobs = await Job.find({ postedBy: req.params.userId })
            .populate('postedBy', 'name company')
            .populate('companyId', 'name slug logoUrl brandPrimary industry location')
            .sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single job (populate company info)
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('postedBy', 'name company')
            .populate('companyId', 'name slug logoUrl brandPrimary brandAccent industry location website socialLinks tagline about');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create job listing
router.post('/', async (req, res) => {
    try {
        const {
            title, description, requirements, department, location, salary,
            postedBy, hiringMode, lastDateToApply, interviewDate, interviewVenue,
            applicationFields, showOnHome
        } = req.body;

        // Resolve companyId from postedBy (recruiter) for tenant isolation
        let companyId = req.body.companyId || null;
        if (!companyId && postedBy) {
            const company = await Company.findOne({ owner: postedBy });
            if (company) companyId = company._id;
        }

        const job = new Job({
            title, description, requirements, department, location, salary,
            postedBy,
            companyId,
            hiringMode: hiringMode || 'ROLLING',
            lastDateToApply: lastDateToApply || null,
            interviewDate: interviewDate || null,
            interviewVenue: interviewVenue || '',
            applicationFields: applicationFields || [],
            showOnHome: showOnHome !== undefined ? showOnHome : true,
        });
        await job.save();

        const populated = await Job.findById(job._id)
            .populate('postedBy', 'name company')
            .populate('companyId', 'name slug logoUrl brandPrimary industry location');
        res.json(populated);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a job listing
router.put('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
            .populate('postedBy', 'name company')
            .populate('companyId', 'name slug logoUrl brandPrimary industry location');
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a job listing
router.delete('/:id', async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
