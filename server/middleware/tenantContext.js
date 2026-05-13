const Company = require('../models/Company');

/**
 * Tenant Context Middleware
 * Attaches `req.company` from the :slug URL parameter.
 * Any route that uses this middleware is guaranteed to have a valid, public company.
 */
const tenantContext = async (req, res, next) => {
    const slug = req.params.slug;
    if (!slug) return res.status(400).json({ message: 'Company slug is required' });

    try {
        const company = await Company.findOne({ slug: slug.toLowerCase(), isPublic: true });
        if (!company) {
            return res.status(404).json({ message: 'Company not found', code: 'TENANT_NOT_FOUND' });
        }
        req.company = company;
        next();
    } catch (err) {
        console.error('Tenant context middleware error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

/**
 * Ownership guard — ensures the authenticated recruiter owns this company.
 * Must be used AFTER tenantContext and auth middleware.
 */
const requireOwnership = (req, res, next) => {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    if (String(req.company.owner) !== String(userId)) {
        return res.status(403).json({ message: 'Access denied — not the company owner' });
    }
    next();
};

module.exports = { tenantContext, requireOwnership };
