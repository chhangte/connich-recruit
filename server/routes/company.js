const express = require('express');
const Company = require('../models/Company');
const Job = require('../models/Job');
const User = require('../models/User');
const { tenantContext } = require('../middleware/tenantContext');
const router = express.Router();

/* ── Slug utilities ──────────────────────────────────────── */

/**
 * Generate a URL-safe slug from a company name.
 * e.g. "Connich Education Pvt Ltd" → "connich-education"
 */
const STOP_WORDS = new Set(['pvt', 'ltd', 'inc', 'corp', 'llc', 'and', 'the', 'of', 'co']);
function generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 0 && !STOP_WORDS.has(w))
        .join('-')
        .replace(/-+/g, '-')
        .slice(0, 60) || 'company';
}

async function uniqueSlug(base) {
    let slug = base;
    let count = 0;
    while (await Company.findOne({ slug })) {
        count++;
        slug = `${base}-${count}`;
    }
    return slug;
}

/* ── Public: Slug availability check ────────────────────── */
router.get('/slug-check/:slug', async (req, res) => {
    try {
        const slug = req.params.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
        const exists = await Company.findOne({ slug });
        res.json({ slug, available: !exists });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Public: Get all companies (for browse) ──────────────── */
router.get('/all', async (req, res) => {
    try {
        const companies = await Company.find({}).sort({ name: 1 });
        res.json(companies);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Public: Get company by slug + open jobs ─────────────── */
router.get('/:slug', tenantContext, async (req, res) => {
    try {
        const company = req.company;
        const jobs = await Job.find({ companyId: company._id, status: 'OPEN' })
            .sort({ createdAt: -1 })
            .select('-applicationFields'); // don't leak form config
        res.json({ company, jobs });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Public: Get all open jobs for a company (filterable) ── */
router.get('/:slug/jobs', tenantContext, async (req, res) => {
    try {
        const company = req.company;
        const { department, q } = req.query;

        const filter = { companyId: company._id, status: 'OPEN' };
        if (department && department !== 'All') filter.department = department;

        let jobs = await Job.find(filter).sort({ createdAt: -1 });

        if (q) {
            const search = q.toLowerCase();
            jobs = jobs.filter(j =>
                j.title?.toLowerCase().includes(search) ||
                j.department?.toLowerCase().includes(search) ||
                j.location?.toLowerCase().includes(search)
            );
        }

        res.json({ company, jobs });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Public: Single job scoped to company ────────────────── */
router.get('/:slug/jobs/:jobId', tenantContext, async (req, res) => {
    try {
        const company = req.company;
        const job = await Job.findOne({ _id: req.params.jobId, companyId: company._id });
        if (!job) return res.status(404).json({ message: 'Job not found for this company' });
        res.json({ company, job });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Create company (called during recruiter registration) ── */
router.post('/', async (req, res) => {
    try {
        const { name, industry, location, tagline, website, logoUrl, about,
                brandPrimary, brandAccent, socialLinks, ownerId, customSlug } = req.body;

        if (!name || !ownerId) {
            return res.status(400).json({ message: 'Company name and owner are required' });
        }

        // Verify owner is a RECRUITER
        const owner = await User.findById(ownerId);
        if (!owner || owner.role !== 'RECRUITER') {
            return res.status(403).json({ message: 'Only recruiters can create company profiles' });
        }

        const baseSlug = customSlug
            ? customSlug.toLowerCase().replace(/[^a-z0-9-]/g, '-')
            : generateSlug(name);
        const slug = await uniqueSlug(baseSlug);

        const company = new Company({
            slug, name, industry, location, tagline, website, logoUrl, about,
            brandPrimary: brandPrimary || '#2563eb',
            brandAccent: brandAccent || '#1e3a5f',
            socialLinks: socialLinks || {},
            owner: ownerId,
        });
        await company.save();

        // Link company to the recruiter user
        await User.findByIdAndUpdate(ownerId, { companyId: company._id });

        res.status(201).json({ company });
    } catch (err) {
        console.error('Create company error:', err);
        if (err.code === 11000) return res.status(409).json({ message: 'Slug already taken' });
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Update company profile (owner only) ─────────────────── */
router.put('/:slug', tenantContext, async (req, res) => {
    try {
        const company = req.company;
        const { ownerId, ...updates } = req.body;

        // Basic ownership check (no JWT middleware here, we rely on the client sending ownerId)
        // Full JWT auth would be added in a production scenario
        if (ownerId && String(company.owner) !== String(ownerId)) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Prevent changing owner via this endpoint
        delete updates.owner;

        // Handle slug change
        if (updates.slug && updates.slug !== company.slug) {
            const newSlug = updates.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
            const exists = await Company.findOne({ slug: newSlug });
            if (exists && String(exists._id) !== String(company._id)) {
                return res.status(409).json({ message: 'Slug already taken' });
            }
            updates.slug = newSlug;
        }

        const updated = await Company.findByIdAndUpdate(
            company._id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        // Keep legacy user.company in sync for backward compat
        await User.findByIdAndUpdate(company.owner, {
            company: {
                name: updated.name,
                tagline: updated.tagline,
                about: updated.about,
                industry: updated.industry,
                website: updated.website,
                logoUrl: updated.logoUrl,
                location: updated.location,
            }
        });

        res.json({ company: updated });
    } catch (err) {
        console.error('Update company error:', err);
        if (err.code === 11000) return res.status(409).json({ message: 'Slug already taken' });
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Get company profile by owner userId (recruiter dashboard) ── */
router.get('/by-owner/:userId', async (req, res) => {
    try {
        const company = await Company.findOne({ owner: req.params.userId });
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json({ company });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

/* ── Legacy: get by recruiter userId (backward compat redirect data) ── */
router.get('/legacy/:userId', async (req, res) => {
    try {
        const recruiter = await User.findById(req.params.userId).select('-password');
        if (!recruiter || recruiter.role !== 'RECRUITER') {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Try to find Company doc first
        let company = await Company.findOne({ owner: recruiter._id });
        const jobs = await Job.find({
            ...(company ? { companyId: company._id } : { postedBy: recruiter._id }),
            status: 'OPEN'
        }).sort({ createdAt: -1 });

        res.json({
            recruiter: { id: recruiter._id, name: recruiter.name, company: recruiter.company },
            company: company || null,
            jobs,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
module.exports.generateSlug = generateSlug;
module.exports.uniqueSlug = uniqueSlug;
