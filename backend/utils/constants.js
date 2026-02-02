const ROLES = {
  STUDENT: 'student',
  MENTOR: 'mentor',
  ADMIN: 'admin',
};

const TASK_STATUS = {
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  COMPLETED: 'completed',
};

const SUBMISSION_STATUS = {
  SUBMITTED: 'submitted',
  REVIEWED: 'reviewed',
  GRADED: 'graded',
};

const NOTIFICATION_TYPES = {
  TASK_ASSIGNED: 'task_assigned',
  SUBMISSION_REVIEWED: 'submission_reviewed',
  FEEDBACK_ADDED: 'feedback_added',
  MESSAGE_RECEIVED: 'message_received',
  GRADE_UPDATED: 'grade_updated',
};

const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

module.exports = {
  ROLES,
  TASK_STATUS,
  SUBMISSION_STATUS,
  NOTIFICATION_TYPES,
  PRIORITY_LEVELS,
};
