const aiService = {
  generateFeedback: (submissionText, score) => {
    // Mock AI feedback generation
    const feedbackTemplates = [
      'Great effort! Your submission shows good understanding of the concepts.',
      'Good work! Consider adding more details to strengthen your answer.',
      'Excellent submission! You have demonstrated mastery of the topic.',
      'Your submission is on the right track. Review the key concepts once more.',
      'Outstanding work! Your analysis is thorough and well-structured.',
    ];

    const index = Math.floor(score / 20) % feedbackTemplates.length;
    return feedbackTemplates[index];
  },

  predictWeakStudents: (submissions) => {
    // Mock prediction based on low scores
    return submissions
      .filter((sub) => sub.score && sub.score < 50)
      .map((sub) => ({
        studentId: sub.studentId,
        score: sub.score,
        riskLevel: sub.score < 30 ? 'high' : 'medium',
      }));
  },

  calculatePlagiarismScore: (text1, text2) => {
    // Mock plagiarism detection - simple word matching
    if (!text1 || !text2) return 0;

    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);

    const commonWords = words1.filter((word) => words2.includes(word));
    const score = (commonWords.length / Math.max(words1.length, words2.length)) * 100;

    return Math.min(score, 100);
  },
};

module.exports = aiService;
