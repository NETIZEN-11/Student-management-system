# Student Management System

A full-stack web application for managing student tasks, submissions, and grades with real-time notifications and analytics.

## Features

### Core Features
- **Authentication**: JWT-based login and registration
- **Role-Based Access Control**: Student, Mentor, and Admin roles
- **Task Management**: Create, update, and delete tasks
- **Submission System**: Submit tasks with text or links
- **Grading System**: Grade submissions and provide feedback
- **Real-time Notifications**: Socket.io-based notifications
- **Analytics Dashboard**: Track student progress and performance
- **Messaging System**: Direct messaging between students and mentors
- **Group System**: Create and manage student groups
- **Plagiarism Detection**: Basic plagiarism checking
- **Leaderboard**: Points-based gamification system
- **AI Features**: Auto-generated feedback and weak student prediction

### Advanced Features
- Dark mode support
- Responsive design
- Late submission detection
- Attachment support
- Progress tracking
- Email notifications (mock)
- Real-time chat with typing indicators

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **Socket.io** for real-time features
- **JWT** for authentication
- **Multer** for file uploads

### Frontend
- **React** 18.2.0
- **React Router** for navigation
- **Axios** for API calls
- **Socket.io Client** for real-time updates
- **CSS3** for styling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd student-management-system
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (already provided)
# Update MONGODB_URI if using a different database

# Start the server
npm start
# or for development with auto-reload
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000/api" > .env
echo "REACT_APP_SOCKET_URL=http://localhost:5000" >> .env

# Start the development server
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin only)
- `PUT /api/users/:id/role` - Change user role (admin only)

### Tasks
- `POST /api/tasks` - Create task (mentor/admin)
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task (mentor/admin)
- `DELETE /api/tasks/:id` - Delete task (mentor/admin)
- `GET /api/tasks/my-tasks` - Get student's tasks

### Submissions
- `POST /api/submissions` - Submit task
- `GET /api/submissions/task/:taskId` - Get submissions for task
- `GET /api/submissions/my-submissions` - Get student's submissions
- `PUT /api/submissions/:submissionId/grade` - Grade submission (mentor/admin)
- `PUT /api/submissions/:submissionId/feedback` - Add feedback (mentor/admin)
- `POST /api/submissions/:submissionId/plagiarism/:taskId` - Check plagiarism

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get all groups
- `GET /api/groups/:id` - Get group by ID
- `POST /api/groups/add-member` - Add member to group
- `POST /api/groups/remove-member` - Remove member from group
- `DELETE /api/groups/:id` - Delete group

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversation/:userId` - Get conversation
- `GET /api/messages/inbox` - Get inbox
- `PUT /api/messages/:messageId/read` - Mark message as read
- `DELETE /api/messages/:messageId` - Delete message

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:notificationId/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:notificationId` - Delete notification

### Analytics
- `GET /api/analytics/student-progress` - Get student progress
- `GET /api/analytics/admin-stats` - Get admin statistics
- `GET /api/analytics/task/:taskId` - Get task analytics
- `GET /api/analytics/weak-students` - Get weak students list

## User Roles & Permissions

### Student
- View assigned tasks
- Submit tasks
- View feedback and grades
- View leaderboard
- Send messages to mentors
- View personal progress

### Mentor
- Create and manage tasks
- Review submissions
- Grade submissions
- Provide feedback
- View analytics
- Identify weak students
- Message students

### Admin
- Full system access
- Manage all users
- Manage all tasks
- View system analytics
- Change user roles
- Delete any content

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student/mentor/admin),
  profilePicture: String,
  bio: String,
  points: Number,
  isActive: Boolean,
  department: String,
  enrollmentDate: Date
}
```

### Task
```javascript
{
  title: String,
  description: String,
  createdBy: ObjectId (User),
  assignedTo: [ObjectId] (User),
  dueDate: Date,
  priority: String (low/medium/high),
  status: String (pending/submitted/reviewed/completed),
  attachments: [{ fileName, fileUrl, uploadedAt }],
  maxScore: Number,
  isGroupTask: Boolean,
  groupId: ObjectId (Group),
  tags: [String]
}
```

### Submission
```javascript
{
  taskId: ObjectId (Task),
  studentId: ObjectId (User),
  submissionText: String,
  submissionLink: String,
  attachments: [{ fileName, fileUrl, uploadedAt }],
  submittedAt: Date,
  isLate: Boolean,
  status: String (submitted/reviewed/graded),
  score: Number,
  feedback: String,
  reviewedBy: ObjectId (User),
  reviewedAt: Date,
  plagiarismScore: Number,
  aiGeneratedFeedback: String
}
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control middleware
- Input validation
- CORS protection
- Protected routes
- Secure file upload handling

## UI Features

- Clean and modern dashboard
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Real-time notifications
- Progress bars and statistics
- Color-coded priority levels
- Status badges
- Interactive charts and analytics

## Sample Data

To test the system, you can use these credentials:

**Admin Account**
- Email: admin@example.com
- Password: admin123

**Mentor Account**
- Email: mentor@example.com
- Password: mentor123

**Student Account**
- Email: student@example.com
- Password: student123

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running locally or update `MONGODB_URI` in `.env`
- Check connection string format

### Port Already in Use
- Backend: Change `PORT` in `.env`
- Frontend: Use `PORT=3001 npm start`

### CORS Error
- Ensure `FRONTEND_URL` in backend `.env` matches frontend URL
- Check Socket.io CORS configuration

### Socket.io Connection Failed
- Verify backend is running
- Check `REACT_APP_SOCKET_URL` in frontend `.env`

## Project Structure

```
student-management-system/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   ├── utils/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── .env
└── README.md
```

## Deployment

### Backend (Heroku)
```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

## License

This project is open source and available under the MIT License.

## Author

Student Management System - Full Stack Application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For support, email support@example.com or open an issue in the repository.

---

**Happy Learning!**
