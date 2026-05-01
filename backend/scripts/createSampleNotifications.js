/**
 * Create Sample Notifications Script
 * Creates sample notifications for testing the UI
 * Run: node scripts/createSampleNotifications.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Notification = require('../models/Notification');

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

const createSampleNotifications = async () => {
  try {
    // Find any existing user to create notifications for
    const users = await User.find().limit(5);
    
    if (users.length === 0) {
      console.log('[INFO] No users found. Please create a user account first.');
      process.exit(0);
    }

    // Clear existing notifications
    await Notification.deleteMany({});
    console.log('[INFO] Cleared existing notifications');

    const sampleNotifications = [
      {
        type: 'task_assigned',
        title: '📝 New Task Assigned',
        message: 'You have been assigned a new task: "Complete JavaScript Fundamentals"',
      },
      {
        type: 'submission_reviewed',
        title: '⭐ Submission Reviewed',
        message: 'Your submission for "React Components" has been reviewed. Score: 95/100',
      },
      {
        type: 'feedback_added',
        title: '💬 New Feedback',
        message: 'Your mentor has added feedback to your latest submission.',
      },
      {
        type: 'message_received',
        title: '📨 New Message',
        message: 'You have received a new message from your instructor.',
      },
      {
        type: 'grade_updated',
        title: '🎯 Grade Updated',
        message: 'Your grade for "Database Design" has been updated to A+',
      },
      {
        type: 'task_assigned',
        title: '📚 Assignment Due Soon',
        message: 'Reminder: "Node.js Project" is due in 2 days.',
      },
      {
        type: 'feedback_added',
        title: '✨ Excellent Work!',
        message: 'Great job on your latest project! Keep up the excellent work.',
      },
    ];

    // Create notifications for each user
    for (const user of users) {
      for (let i = 0; i < sampleNotifications.length; i++) {
        const notif = sampleNotifications[i];
        await Notification.create({
          userId: user._id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          isRead: i > 3, // First 4 notifications are unread
          createdAt: new Date(Date.now() - (i * 60 * 60 * 1000)), // Spread over hours
        });
      }
    }

    console.log(`[INFO] ✅ Created ${sampleNotifications.length} sample notifications for ${users.length} users`);
    console.log('[INFO] 🔔 First 4 notifications are marked as unread');
    console.log('[INFO] 🎯 Visit your app to see the improved notification UI!');

    process.exit(0);
  } catch (error) {
    console.error('[ERROR] Error creating notifications:', error.message);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await createSampleNotifications();
};

main();