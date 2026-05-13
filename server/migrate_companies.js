/**
 * Migration script: backfill Company documents for existing RECRUITER accounts.
 * Run once: node server/migrate_companies.js
 *
 * For each RECRUITER that has an embedded company.name but no Company document,
 * this creates a Company doc and links it via user.companyId.
 */

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');

const STOP_WORDS = new Set(['pvt', 'ltd', 'inc', 'corp', 'llc', 'and', 'the', 'of', 'co']);
function generateSlug(name) {
    return (name || '')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .split(/\s+/)
        .filter(w => w.length > 0 && !STOP_WORDS.has(w))
        .join('-')
        .replace(/-+/g, '-')
        .slice(0, 60) || 'company';
}

async function uniqueSlug(Company, base) {
    let slug = base;
    let count = 0;
    while (await Company.findOne({ slug })) {
        count++;
        slug = `${base}-${count}`;
    }
    return slug;
}

async function run() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/careers-kidsden');
    console.log('Connected to MongoDB:', mongoose.connection.name);

    const User = require('./models/User');
    const Company = require('./models/Company');
    const Job = require('./models/Job');

    const recruiters = await User.find({ role: 'RECRUITER' });
    console.log(`Found ${recruiters.length} recruiter account(s).`);

    let created = 0;
    let skipped = 0;
    let linked = 0;

    for (const recruiter of recruiters) {
        // Check if already has a Company doc
        const existing = await Company.findOne({ owner: recruiter._id });
        if (existing) {
            // Just ensure the user is linked
            if (!recruiter.companyId) {
                await User.findByIdAndUpdate(recruiter._id, { companyId: existing._id });
                linked++;
            }
            skipped++;
            console.log(`  SKIP  ${recruiter.email} → already has company: ${existing.slug}`);
            continue;
        }

        const co = recruiter.company || {};
        if (!co.name) {
            console.log(`  SKIP  ${recruiter.email} → no company name in embedded data`);
            skipped++;
            continue;
        }

        const baseSlug = generateSlug(co.name);
        const slug = await uniqueSlug(Company, baseSlug);

        const company = new Company({
            slug,
            name: co.name,
            tagline: co.tagline || '',
            about: co.about || '',
            industry: co.industry || '',
            location: co.location || '',
            website: co.website || '',
            logoUrl: co.logoUrl || '',
            brandPrimary: '#2563eb',
            brandAccent: '#1e3a5f',
            owner: recruiter._id,
        });
        await company.save();

        // Link user to company
        await User.findByIdAndUpdate(recruiter._id, { companyId: company._id });

        // Link all existing jobs to the company
        const jobsUpdated = await Job.updateMany(
            { postedBy: recruiter._id, companyId: { $exists: false } },
            { $set: { companyId: company._id } }
        );

        created++;
        console.log(`  CREATE ${recruiter.email} → slug: "${slug}" (jobs linked: ${jobsUpdated.modifiedCount})`);
    }

    console.log(`\nMigration complete:`);
    console.log(`  Created: ${created} company documents`);
    console.log(`  Skipped: ${skipped} (already migrated or no data)`);
    console.log(`  Linked:  ${linked} user→company references fixed`);

    await mongoose.disconnect();
    process.exit(0);
}

run().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
