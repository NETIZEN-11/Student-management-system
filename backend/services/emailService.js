const nodemailer = require('nodemailer');

const emailService = {
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-password',
    },
  }),

  sendTaskAssignmentEmail: async (studentEmail, taskTitle) => {
    try {
      await emailService.transporter.sendMail({
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: studentEmail,
        subject: `New Task Assigned: ${taskTitle}`,
        html: `
          <h2>New Task Assigned</h2>
          <p>You have been assigned a new task: <strong>${taskTitle}</strong></p>
          <p>Please log in to the system to view details and submit your work.</p>
        `,
      });
      console.log(`Email sent to ${studentEmail}`);
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },

  sendFeedbackEmail: async (studentEmail, taskTitle, feedback) => {
    try {
      await emailService.transporter.sendMail({
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: studentEmail,
        subject: `Feedback on Task: ${taskTitle}`,
        html: `
          <h2>Feedback on Your Submission</h2>
          <p>Task: <strong>${taskTitle}</strong></p>
          <p>Feedback:</p>
          <p>${feedback}</p>
        `,
      });
      console.log(`Feedback email sent to ${studentEmail}`);
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },

  sendNotificationEmail: async (email, subject, message) => {
    try {
      await emailService.transporter.sendMail({
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: email,
        subject,
        html: `<p>${message}</p>`,
      });
    } catch (error) {
      console.error('Email sending error:', error);
    }
  },
};

module.exports = emailService;
