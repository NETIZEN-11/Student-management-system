const User = require('../models/User');

const leaderboardService = {
  getLeaderboard: async (limit = 10) => {
    try {
      const leaderboard = await User.find({ role: 'student' })
        .select('name email points enrollmentDate')
        .sort({ points: -1 })
        .limit(limit);

      return leaderboard.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        email: user.email,
        points: user.points,
        enrollmentDate: user.enrollmentDate,
      }));
    } catch (error) {
      console.error('Leaderboard error:', error);
      return [];
    }
  },

  updateStudentPoints: async (studentId, points) => {
    try {
      const user = await User.findByIdAndUpdate(
        studentId,
        { $inc: { points } },
        { new: true }
      );
      return user;
    } catch (error) {
      console.error('Points update error:', error);
      return null;
    }
  },

  getStudentRank: async (studentId) => {
    try {
      const student = await User.findById(studentId);
      const rank = await User.countDocuments({
        role: 'student',
        points: { $gt: student.points },
      });
      return rank + 1;
    } catch (error) {
      console.error('Rank calculation error:', error);
      return null;
    }
  },
};

module.exports = leaderboardService;
