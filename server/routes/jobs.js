const express = require('express');
const Job = require('../models/Job');
const router = express.Router();

// Get all open jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find({ status: 'OPEN' }).sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single job
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create job (Recruiter/Admin only - auth middleware needed later)
router.post('/', async (req, res) => {
    try {
        const { title, description, requirements, department, location, salary, postedBy } = req.body;
        const job = new Job({ title, description, requirements, department, location, salary, postedBy });
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
