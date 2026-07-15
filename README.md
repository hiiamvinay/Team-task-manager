# Team Task Manager

Team Task Manager is a full-stack collaboration platform for organizing projects, managing team membership, assigning work, and tracking delivery progress through a role-aware dashboard.

It is built as a split frontend and backend application:

- `frontend/`: React + Vite single-page application
- `backend/`: Express API with MongoDB persistence

Production deployment: `https://team-task-manager-1-ckwu.onrender.com/`

## Product Highlights

- JWT-based authentication for protected application access
- Email OTP verification during signup
- Forgot-password flow with OTP-based password reset
- Project workspaces with per-project roles: `Admin` and `Member`
- Member management for project administrators
- Task creation, assignment, status updates, and deletion
- Dashboard metrics for total tasks, status distribution, and overdue work
- Clean separation between API, business logic, data models, and UI pages

## Architecture

### Frontend

- React 19
- Vite
- React Router
- React Toastify

### Backend

- Node.js
- Express
- Mongoose
- JSON Web Tokens
- bcrypt
- Brevo email integration for OTP delivery

### Data Store

- MongoDB

## Core Capabilities

### Authentication and Account Security

- User signup with `name`, `email`, and `password`
- OTP verification before account creation is finalized
- Login with JWT issuance
- Forgot-password request via email OTP
- Password reset using OTP and a new password
- Protected backend routes using bearer token authentication

### Project Management

- Create a project
- Automatically assign project creator as `Admin`
- List projects for the authenticated user
- Add members by email
- Update member role during add flow
- Remove members from a project
- Delete a project as an admin

### Task Management

- Create tasks inside a project
- Assign tasks only to existing project members
- Set title, description, due date, priority, and assignee
- Track status using `To Do`, `In Progress`, and `Done`
- Delete tasks from the task workspace

### Dashboard and Visibility

- Aggregate tasks across all projects accessible to the authenticated user
- View total task count
- View task count by status
- View overdue task count

## Repository Structure

```text
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── package-lock.json
├── doc/
│   ├── API.md
│   └── FLOW.md
├── LICENSE
└── README.md
```

## Application Routes

### Frontend Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/login` | User login |
| `/signup` | New account registration |
| `/otp` | Signup OTP verification |
| `/forgot-password` | Request password reset OTP |
| `/reset-password` | Reset password using OTP |
| `/dashboard` | Dashboard metrics |
| `/projects` | Project and membership management |
| `/tasks` | Task creation and task operations |

### Backend API Routes

#### User and Auth

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/users/signup` | Start signup and send OTP |
| `POST` | `/api/users/otp` | Verify signup OTP and create user |
| `POST` | `/api/users/login` | Authenticate and issue JWT |
| `POST` | `/api/users/forgot-password` | Send password reset OTP |
| `POST` | `/api/users/reset-password` | Reset password using OTP |
| `GET` | `/api/users/me` | Get authenticated user profile |
| `GET` | `/api/users` | List users |

#### Projects

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/projects` | Create project |
| `GET` | `/api/projects` | Get projects for current user |
| `POST` | `/api/projects/:projectId/members` | Add or update project member |
| `DELETE` | `/api/projects/:projectId/members/:memberId` | Remove project member |
| `DELETE` | `/api/projects/:projectId` | Delete project |

#### Tasks

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/tasks` | Create task |
| `GET` | `/api/tasks/project/:projectId` | List tasks for a project |
| `PATCH` | `/api/tasks/:taskId` | Update task details or status |
| `DELETE` | `/api/tasks/:taskId` | Delete task |

#### Dashboard and System

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/dashboard` | Get dashboard metrics |
| `GET` | `/api/system/startup` | Health-style startup status |

## Access Control Model

### Project Admin

- Create projects
- Add members
- Change member role through the add-member flow
- Remove members
- Delete projects

### Project Member

- Access projects they belong to
- View project tasks
- Create tasks in accessible projects
- Update task status and task details through authorized API access
- Delete tasks in accessible projects

## Local Development

### Prerequisites

- Node.js 18 or newer recommended
- npm
- MongoDB instance
- Brevo API key for OTP email delivery

### Environment Configuration

### Backend `.env`

Create `backend/.env` with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=your_verified_sender_email
EMAIL_FROM_NAME=Team Task Manager
```

### Frontend `.env`

Create `frontend/.env` with:

```env
VITE_API=http://localhost:5000
```

### Installation

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

### Running the Application

### Start the backend

```bash
cd backend
npm start
```

The API starts on `http://localhost:5000` unless overridden by `PORT`.

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend typically starts on `http://localhost:5173`.

## Operational Notes

- The frontend stores the JWT in `localStorage`
- Signup is not completed until the OTP is verified
- Password reset is OTP-driven and email-dependent
- CORS is enabled in the Express application
- Dashboard metrics are scoped to projects the authenticated user belongs to
- Task assignees must already be members of the target project

## Verification

Useful local checks:

```bash
cd backend
node --check src/server.js
```

```bash
cd frontend
npm run build
```

## Documentation

Additional project notes are available in:

- [doc/API.md](/home/vinay/team-task-manager/doc/API.md:1)
- [doc/FLOW.md](/home/vinay/team-task-manager/doc/FLOW.md:1)

## Roadmap Opportunities

- Add automated backend and frontend test coverage
- Introduce request validation middleware for stronger API contracts
- Add audit logging for project and task mutations
- Support refresh tokens or secure HTTP-only cookie auth
- Add pagination and filtering for projects and tasks
- Expand dashboard analytics and trend visualization

## License

This repository is distributed under the terms defined in [LICENSE](/home/vinay/team-task-manager/LICENSE:1).
