const mongoose = require('mongoose');

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
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
