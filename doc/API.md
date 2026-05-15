# Team Task Manager API Documentation

This document defines the RESTful API endpoints for the Team Task Manager application.

## Authentication

### POST /api/auth/signup

Create a new user account.

Request body:

- `name` (string, required)
- `email` (string, required)
- `password` (string, required)

Response:

- `201 Created`
- JSON:
  {
    "success": true,
    "message": "User created successfully",
    "user": {
      "id": "...",
      "name": "...",
      "email": "..."
    }
  }

Errors:

- `400 Bad Request` for missing fields
- `409 Conflict` if email already exists

### POST /api/auth/login

Authenticate a user and return a JWT.

Request body:

- `email` (string, required)
- `password` (string, required)

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "token": "<jwt>",
    "user": {
      "id": "...",
      "name": "...",
      "email": "..."
    }
  }

Errors:

- `400 Bad Request` for missing credentials
- `401 Unauthorized` for invalid credentials

## Users

### GET /api/users/me

Get the authenticated user profile.

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "user": {
      "id": "...",
      "name": "...",
      "email": "..."
    }
  }

## Projects

### POST /api/projects

Create a new project. The creator becomes Admin for that project.

Headers:

- `Authorization: Bearer <token>`

Request body:

- `name` (string, required)
- `description` (string, optional)

Response:

- `201 Created`
- JSON:
  {
    "success": true,
    "project": {
      "id": "...",
      "name": "...",
      "description": "...",
      "createdBy": "..."
    },
    "membership": {
      "role": "Admin"
    }
  }

### GET /api/projects

List projects the authenticated user belongs to.

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "projects": [
      {
        "id": "...",
        "name": "...",
        "description": "...",
        "role": "Member"
      }
    ]
  }

### GET /api/projects/:projectId

Get project details.

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "project": {
      "id": "...",
      "name": "...",
      "description": "..."
    },
    "members": [
      {
        "id": "...",
        "name": "...",
        "email": "...",
        "role": "Admin"
      }
    ]
  }

### GET /api/projects/:projectId/members

List all members of a project.

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON: `{ "success": true, "members": [ ... ] }

### POST /api/projects/:projectId/members

Add a member to a project (Admin only).

Headers:

- `Authorization: Bearer <token>`

Request body:

- `email` (string, required)
- `role` (string, optional, one of `Admin`, `Member`; defaults to `Member`)

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "message": "Member added successfully"
  }

Errors:

- `403 Forbidden` if the requester is not a project Admin
- `404 Not Found` if the project or invited user does not exist

### DELETE /api/projects/:projectId/members/:memberId

Remove a member from the project (Admin only).

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "message": "Member removed successfully"
  }

## Tasks

### POST /api/projects/:projectId/tasks

Create a task within a project.

Headers:

- `Authorization: Bearer <token>`

Request body:

- `title` (string, required)
- `description` (string, optional)
- `dueDate` (ISO8601 string, optional)
- `priority` (string, enum: `low`, `medium`, `high`, required)
- `assigneeId` (string, required)

Response:

- `201 Created`
- JSON:
  {
    "success": true,
    "task": {
      "id": "...",
      "title": "...",
      "description": "...",
      "dueDate": "...",
      "priority": "...",
      "status": "To Do",
      "assigneeId": "..."
    }
  }

### GET /api/projects/:projectId/tasks

List all tasks in a project.

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "tasks": [ ... ]
  }

### GET /api/tasks/:taskId

Get a single task.

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "task": { ... }
  }

### PATCH /api/tasks/:taskId

Update task fields such as status, assignee, title, description, due date, or priority.

Headers:

- `Authorization: Bearer <token>`

Request body (one or more):

- `title` (string)
- `description` (string)
- `dueDate` (ISO8601 string)
- `priority` (string, one of `low`, `medium`, `high`)
- `status` (string, one of `To Do`, `In Progress`, `Done`)
- `assigneeId` (string)

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "task": { ... }
  }

Errors:

- `403 Forbidden` if a Member tries to edit a task they are not authorized to modify

### DELETE /api/tasks/:taskId

Delete a task.

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "message": "Task deleted successfully"
  }

## Dashboard

### GET /api/dashboard

Get dashboard metrics for the authenticated user.

Headers:

- `Authorization: Bearer <token>`

Response:

- `200 OK`
- JSON:
  {
    "success": true,
    "totalTasks": 42,
    "tasksByStatus": {
      "To Do": 12,
      "In Progress": 18,
      "Done": 12
    },
    "tasksPerUser": [
      { "userId": "...", "name": "Alice", "taskCount": 10 },
      { "userId": "...", "name": "Bob", "taskCount": 8 }
    ],
    "overdueTasks": 5
  }

## Authentication & Authorization

- Use `Authorization: Bearer <token>` for protected routes.
- Protect routes with middleware that validates JWTs and extracts user identity.
- Enforce project-specific role checks for Admin and Member permissions.
- The project creator becomes Admin automatically; no separate admin login UI is needed.

## Recommended Models

### User

- `id`
- `name`
- `email`
- `passwordHash`
- `createdAt`
- `updatedAt`

### Project

- `id`
- `name`
- `description`
- `createdBy`
- `createdAt`
- `updatedAt`

### Task

- `id`
- `projectId`
- `title`
- `description`
- `dueDate`
- `priority`
- `status`
- `assigneeId`
- `createdBy`
- `createdAt`
- `updatedAt`

### ProjectMember

- `projectId`
- `userId`
- `role` (`Admin` | `Member`)
- `joinedAt`

## Common Response Format

Successful response example:

```
{
  "success": true,
  "data": { ... }
}
```

Error response example:

```
{
  "success": false,
  "error": "Invalid credentials"
}
```

    "tasksPerUser": [
      { "userId": "...", "name": "Alice", "taskCount": 10 },
      { "userId": "...", "name": "Bob", "taskCount": 8 }
    ],
    "overdueTasks": 5
  }

## Common Response Format

Successful responses should return JSON with a consistent envelope.

Example:

```
{
  "success": true,
  "data": { ... }
}
```

Error example:

```
{
  "success": false,
  "error": "Invalid credentials"
}
```

## Authentication & Authorization

- Use `Authorization: Bearer <token>` for protected routes.
- Protect routes with middleware that validates JWTs and extracts user identity.
- Enforce role-based checks on project membership and task operations.

## Recommended Models

### User

- `id`
- `name`
- `email`
- `passwordHash`
- `role` (`admin` | `member`)
- `createdAt`
- `updatedAt`

### Project

- `id`
- `name`
- `description`
- `createdBy`
- `createdAt`
- `updatedAt`

### Task

- `id`
- `projectId`
- `title`
- `description`
- `dueDate`
- `priority`
- `status`
- `assigneeId`
- `createdBy`
- `createdAt`
- `updatedAt`

### ProjectMember

- `projectId`
- `userId`
- `role` (`admin` | `member`)
- `joinedAt`
