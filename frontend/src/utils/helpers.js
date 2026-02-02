export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isLate = (dueDate) => {
  return new Date() > new Date(dueDate);
};

export const getDaysRemaining = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return '#ff4444';
    case 'medium':
      return '#ffaa00';
    case 'low':
      return '#00aa00';
    default:
      return '#666';
  }
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return '#999';
    case 'submitted':
      return '#0066ff';
    case 'reviewed':
      return '#ff9900';
    case 'completed':
      return '#00aa00';
    case 'graded':
      return '#00aa00';
    default:
      return '#666';
  }
};

export const truncateText = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? text.substring(0, length) + '...' : text;
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};
