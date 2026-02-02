/**
 * Database Seeding Script
 * Creates sample data for testing
 * Run: node scripts/seedDatabase.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const Submission = require('../models/Submission');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-management';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('[INFO] MongoDB connected');
  } catch (error) {
    console.error('[ERROR] MongoDB connection error:', error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    await Submission.deleteMany({});
    console.log('[INFO] Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      bio: 'System Administrator',
      department: 'Administration',
    });

    const mentor = await User.create({
      name: 'John Mentor',
      email: 'mentor@example.com',
      password: 'mentor123',
      role: 'mentor',
      bio: 'Experienced Mentor',
      department: 'Computer Science',
    });

    const student1 = await User.create({
      name: 'Alice Student',
      email: 'student@example.com',
      password: 'student123',
      role: 'student',
      bio: 'Dedicated Student',
      department: 'Computer Science',
      points: 150,
    });

    const student2 = await User.create({
      name: 'Bob Student',
      email: 'bob@example.com',
      password: 'student123',
      role: 'student',
      bio: 'Hardworking Student',
      department: 'Computer Science',
      points: 120,
    });

    console.log('[INFO] Created 4 users');

    // Create tasks
    const task1 = await Task.create({
      title: 'JavaScript Basics',
      description: 'Learn the fundamentals of JavaScript including variables, functions, and objects.',
      createdBy: mentor._id,
      assignedTo: [student1._id, student2._id],
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      priority: 'high',
      status: 'pending',
      maxScore: 100,
      tags: ['javascript', 'basics', 'programming'],
    });

    const task2 = await Task.create({
      title: 'React Components',
      description: 'Build reusable React components and understand component lifecycle.',
      createdBy: mentor._id,
      assignedTo: [student1._id],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      priority: 'medium',
      status: 'pending',
      maxScore: 100,
      tags: ['react', 'components', 'frontend'],
    });

    const task3 = await Task.create({
      title: 'Database Design',
      description: 'Design a database schema for a student management system.',
      createdBy: mentor._id,
      assignedTo: [student1._id, student2._id],
      dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
      priority: 'low',
      status: 'pending',
      maxScore: 100,
      tags: ['database', 'design', 'mongodb'],
    });

    console.log('[INFO] Created 3 tasks');

    // Create submissions
    const submission1 = await Submission.create({
      taskId: task1._id,
      studentId: student1._id,
      submissionText: 'I have completed the JavaScript basics assignment. I learned about variables, functions, and objects.',
      submittedAt: new Date(),
      isLate: false,
      status: 'graded',
      score: 95,
      feedback: 'Excellent work! Your understanding of JavaScript fundamentals is clear.',
      reviewedBy: mentor._id,
      reviewedAt: new Date(),
      aiGeneratedFeedback: 'Great effort! Your submission shows good understanding of the concepts.',
    });

    const submission2 = await Submission.create({
      taskId: task1._id,
      studentId: student2._id,
      submissionText: 'Completed the JavaScript basics task. Covered all the required topics.',
      submittedAt: new Date(),
      isLate: false,
      status: 'graded',
      score: 85,
      feedback: 'Good work! Try to add more examples in your explanations.',
      reviewedBy: mentor._id,
      reviewedAt: new Date(),
      aiGeneratedFeedback: 'Good work! Your submission is on the right track.',
    });

    console.log('[INFO] Created 2 submissions');

    console.log('\n[INFO] Database seeding completed successfully!\n');
    console.log('Test Accounts:');
    console.log('  Admin: admin@example.com / admin123');
    console.log('  Mentor: mentor@example.com / mentor123');
    console.log('  Student: student@example.com / student123');
    console.log('  Student: bob@example.com / student123\n');

    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Seeding error:', error.message);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await seedDatabase();
};

main();
