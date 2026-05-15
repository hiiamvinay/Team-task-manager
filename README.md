# Team Task Manager

A full-stack team collaboration app for managing projects, members, tasks, and progress dashboards.

## Overview

This project includes:

- JWT-based authentication
- OTP-based signup verification by email
- Project management with Admin and Member roles
- Task management with assignment, priority, due dates, and status tracking
- A dashboard for task totals, status breakdown, and overdue work
- React frontend and Express + MongoDB backend

## Tech Stack

- Frontend: React, Vite, React Router, React Toastify
- Backend: Node.js, Express, Mongoose, JWT, bcrypt, Nodemailer
- Database: MongoDB

## Production Deployment

- Frontend: https://respectful-acceptance-production-69e2.up.railway.app/
- Backend: https://team-task-manager-production-3489.up.railway.app

## Main Features

### Authentication

- Sign up with name, email, and password
- Receive OTP over email and verify account
- Log in to receive a JWT token
- Protected frontend routes based on token presence and expiry

### Project Management

- Create projects
- Project creator becomes `Admin`
- Admin can add members
- Admin can remove members
- Admin can delete projects
- Members can view assigned projects

### Task Management

- Create tasks with:
  - Title
  - Description
  - Due Date
  - Priority
- Assign tasks to project members
- Update status:
  - `To Do`
  - `In Progress`
  - `Done`

### Dashboard

- Total tasks
- Tasks by status
- Overdue tasks

## App Routes

### Frontend

- `/` landing page
- `/login` login
- `/signup` signup
- `/otp` OTP verification
- `/dashboard` metrics dashboard
- `/projects` project management
- `/tasks` task management

### Backend API

#### Users

- `POST /api/users/signup`
- `POST /api/users/otp`
- `POST /api/users/login`
- `GET /api/users/me`
- `GET /api/users`

#### Projects

- `POST /api/projects`
- `GET /api/projects`
- `POST /api/projects/:projectId/members`
- `DELETE /api/projects/:projectId/members/:memberId`
- `DELETE /api/projects/:projectId`

#### Tasks

- `POST /api/tasks`
- `GET /api/tasks/project/:projectId`
- `PATCH /api/tasks/:taskId`

#### Dashboard

- `GET /api/dashboard`

#### System

- `GET /api/system/startup`

## Project Structure

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
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── doc/
│   ├── API.md
│   └── FLOW.md
└── README.md
```

## Environment Variables

### Backend

Create a `.env` file for the backend with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GMAIL_USER=your_email_address
GMAIL_PASSWORD=your_app_password
```

### Frontend

Create a `.env` file inside `frontend/` with:

```env
VITE_API=http://localhost:5000
```

## Getting Started

### 1. Install dependencies

Backend:

```bash
cd backend
npm install
```

Frontend:

```bash
cd frontend
npm install
```

### 2. Start the backend

Start the backend with:

```bash
cd backend
npm start
```

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend will usually run at:

```text
http://localhost:5173
```

## Current Roles

- `Admin`
  - Create projects
  - Add or remove members
  - Delete projects
- `Member`
  - Access assigned projects
  - Work with project tasks they can access

## Notes

- Authentication uses JWT stored in `localStorage`
- Signup uses OTP verification before user creation
- Task dashboard metrics are calculated from projects the logged-in user belongs to
- The repository also contains supporting docs in [doc/API.md](/home/vinay/team-task-manager/doc/API.md:1) and [doc/FLOW.md](/home/vinay/team-task-manager/doc/FLOW.md:1)

## Future Improvements

- Add backend npm scripts for `dev` and `start`
- Add task delete and edit UI
- Add charts to the dashboard
- Add tests for API and frontend flows
