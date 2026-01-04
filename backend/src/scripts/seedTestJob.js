const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Define JobPosting schema inline for the seed script
const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: {
    type: [String],
    required: true,
    default: []
  },
  responsibilities: {
    type: [String],
    required: true,
    default: []
  },
  salary: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

const seedTestJob = async () => {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/openhand';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Create a test job posting
    const testJob = await JobPosting.create({
      title: 'Certified Nursing Assistant (CNA)',
      department: 'Nursing & Care',
      location: 'OpenHand Care Facility - Main Campus',
      type: 'full-time',
      description: 'We are seeking a compassionate and dedicated Certified Nursing Assistant (CNA) to join our care team. This is an excellent opportunity to make a meaningful difference in the lives of our residents while working in a supportive and collaborative environment.',
      requirements: [
        'Current CNA certification in good standing',
        'High school diploma or equivalent',
        'Minimum 1 year of experience in long-term care or assisted living (preferred)',
        'Basic Life Support (BLS) certification',
        'Strong communication and interpersonal skills',
        'Ability to lift up to 50 lbs and assist with resident mobility',
        'Compassionate, patient, and detail-oriented personality'
      ],
      responsibilities: [
        'Assist residents with activities of daily living (ADLs) including bathing, dressing, grooming, and toileting',
        'Monitor and record vital signs, food/fluid intake, and other health metrics',
        'Help residents with mobility and transfers using proper body mechanics',
        'Respond to call lights and resident needs promptly and professionally',
        'Maintain a clean, safe, and comfortable environment for residents',
        'Report changes in resident condition to nursing staff',
        'Document care provided in resident records accurately and timely',
        'Participate in care planning and team meetings',
        'Assist with meal service and feeding as needed',
        'Provide emotional support and companionship to residents'
      ],
      salary: '$18 - $24 per hour (based on experience)',
      status: 'active'
    });

    console.log('✅ Test job posting created successfully!');
    console.log('Job Title:', testJob.title);
    console.log('Job ID:', testJob._id);
    console.log('\nYou can now test the application flow at /careers');

    // Disconnect
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding test job:', error);
    process.exit(1);
  }
};

seedTestJob();
