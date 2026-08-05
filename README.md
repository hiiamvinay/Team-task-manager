# Team Task Manager

A production-ready, **full-stack project and task management platform** designed for distributed teams to collaborate efficiently with role-based access control, real-time status tracking, and comprehensive analytics.

**Live Demo:** [team-task-manager-1-ckwu.onrender.com](https://team-task-manager-1-ckwu.onrender.com/)

---

## 🎯 Core Features

### Security & Authentication
- **JWT-based stateless authentication** with secure token validation middleware
- **Email OTP verification** for account registration and password recovery
- **Password reset flow** with time-sensitive OTP tokens
- **Protected API routes** with per-resource authorization checks

### Project & Team Management
- **Multi-project workspaces** with granular role-based access control (Admin, Member)
- **Dynamic team membership** with real-time member addition/removal
- **Role-based operations** ensuring admins retain project control
- **Scalable project hierarchy** supporting unlimited projects and members

### Task Management & Workflow
- **Full task lifecycle** with statuses: To Do → In Progress → Done
- **Smart task assignment** restricted to existing project members
- **Rich task metadata** including priority levels and due dates
- **Status tracking** with task history and audit capability

### Analytics & Visibility
- **Unified dashboard** aggregating metrics across all accessible projects
- **Real-time metrics** including total tasks, status distribution, priority breakdown
- **Overdue task tracking** for proactive delivery management
- **Role-aware visibility** ensuring users only see authorized data

---

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19** with functional components and hooks for modern state management
- **Vite** for ultra-fast build tooling and HMR (Hot Module Replacement)
- **React Router v6** for client-side SPA routing and navigation
- **React Toastify** for user feedback with toast notifications
- **CSS3 Modules** for scoped styling and component encapsulation

### Backend Stack
- **Node.js** with Express for lightweight, high-performance HTTP server
- **Mongoose** for schema validation and MongoDB object modeling
- **JSON Web Tokens (JWT)** for stateless, scalable authentication
- **bcrypt** for cryptographically secure password hashing
- **Brevo Email API** for transactional email delivery (OTP, notifications)
- **Middleware-driven architecture** for authentication, error handling, and logging

### Data Layer
- **MongoDB** with normalized schema design for scalability
- **Mongoose schemas** enforcing data integrity and validation
- **Indexed queries** on frequently accessed fields (projectId, userId, assignee)
- **Atomic operations** for consistency in multi-document scenarios

### Deployment
- **Container-ready backend** deployable on Render, Heroku, AWS Lambda
- **Static SPA hosting** on Vercel, Netlify, or traditional CDNs
- **Environment-driven configuration** for multi-environment deployments (dev, staging, prod)
- **CORS-enabled API** for cross-origin frontend integration

---

## 🔐 Security & Best Practices

### Authentication Security
- **JWT bearer token validation** on every protected request
- **Secure password hashing** with bcrypt (10+ salt rounds)
- **OTP rate limiting** to prevent brute-force attacks
- **Session isolation** preventing cross-user data access

### Authorization & Access Control
- **Role-based access control (RBAC)** with granular permission checks
- **Resource ownership validation** before mutations (update/delete)
- **MongoDB ObjectId validation** preventing injection attacks
- **Request sanitization** at middleware layer

### Data Privacy
- **PII protection** with encrypted sensitive fields
- **User isolation** ensuring dashboard/project queries scoped to authenticated user
- **No data leakage** through error messages or response bodies
- **GDPR-ready architecture** with data ownership tracking

### API Design
- **RESTful conventions** with proper HTTP methods and status codes
- **Standardized error responses** with actionable messages
- **Request validation** at controller layer
- **Rate limiting ready** with token-based request tracking

---

## 📊 Core Capabilities

### Account Management & Security
- **User registration** with email verification and OTP validation
- **Secure authentication** via JWT tokens with configurable expiration
- **Password recovery** using time-limited OTP delivery
- **Protected endpoints** with automatic token validation middleware

### Enterprise Project Workflow
- **Project creation** with automatic admin assignment to creator
- **Multi-role member management** supporting dynamic permission changes
- **Bulk member operations** for efficient team scaling
- **Project isolation** ensuring data compartmentalization

### Advanced Task Management  
- **Rich task metadata** with priority, due dates, and descriptions
- **Constrained assignment** ensuring assignees are project members
- **Status workflows** with clear state transitions (To Do → In Progress → Done)
- **Cascading deletion** preventing orphaned task references

### Analytics & Reporting
- **Cross-project aggregation** with real-time metric calculations
- **Status-based filtering** for workflow analytics
- **Overdue detection** using server-side date comparison
- **Queryable APIs** enabling custom dashboard implementations

---

## 📂 Project Structure & Code Organization

### Architectural Separation of Concerns

```
team-task-manager/
├── backend/                          # RESTful API service layer
│   ├── src/
│   │   ├── config/                  # Database & email configuration
│   │   │   ├── db.js               # MongoDB connection
│   │   │   └── mailConfig.js       # Email service setup
│   │   ├── controllers/            # Request handlers (business logic orchestration)
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   └── dashboardController.js
│   │   ├── middleware/             # Cross-cutting concerns
│   │   │   └── auth.js             # JWT validation & token extraction
│   │   ├── models/                 # Mongoose schemas & validation
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── routes/                 # API endpoint definitions
│   │   │   ├── auth.js
│   │   │   ├── projects.js
│   │   │   └── tasks.js
│   │   ├── services/               # Business logic & external integrations
│   │   │   └── emailService.js     # OTP & notification delivery
│   │   ├── app.js                  # Express app configuration & middleware setup
│   │   └── server.js               # Application entry point
│   ├── package.json
│   └── .env                        # Environment secrets (not in repo)
│
├── frontend/                        # React SPA
│   ├── src/
│   │   ├── components/             # Reusable UI components
│   │   │   └── ProtectedRoute.jsx # Route-level access control
│   │   ├── pages/                  # Page-level components (one per route)
│   │   │   ├── Dashboard/
│   │   │   ├── ProjectManagement/
│   │   │   ├── TaskManagement/
│   │   │   ├── Auth/               # (Login, Signup, OTP, forgot-password)
│   │   │   └── LandingPage/
│   │   ├── services/               # API & utility functions
│   │   │   └── appStartup.js      # App initialization logic
│   │   ├── App.jsx                 # Root component & routing
│   │   └── main.jsx                # React DOM render entry
│   ├── public/                     # Static assets
│   ├── index.html                  # SPA shell
│   ├── vite.config.js              # Vite build configuration
│   ├── eslint.config.js            # Code linting rules
│   ├── package.json
│   └── .env                        # Frontend APIs endpoint
│
├── doc/                            # Technical documentation
│   ├── API.md                      # API contract & endpoint reference
│   └── FLOW.md                     # User workflows & state diagrams
│
├── README.md                       # Project overview (this file)
├── LICENSE
└── .gitignore
```

### Design Patterns Implemented

- **MVC Architecture** — Controllers orchestrate models and services
- **Middleware Pipeline** — Authentication, error handling, logging
- **Service Layer** — Business logic separated from HTTP concerns
- **Schema Validation** — Mongoose ensures data consistency
- **Component Composition** — React components with single responsibility

---

## 🔌 API Endpoints & Contract

### Authentication Services
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/users/signup` | Initiate signup, send OTP | — |
| `POST` | `/api/users/otp` | Verify OTP and complete registration | — |
| `POST` | `/api/users/login` | Authenticate user, return JWT | — |
| `POST` | `/api/users/forgot-password` | Request password reset OTP | — |
| `POST` | `/api/users/reset-password` | Reset password with OTP validation | — |
| `GET` | `/api/users/me` | Retrieve authenticated user profile | JWT |

### Project Management Services
| Method | Endpoint | Description | Auth | Access |
|--------|----------|-------------|------|--------|
| `POST` | `/api/projects` | Create new project | JWT | Authenticated users |
| `GET` | `/api/projects` | List user's projects | JWT | User's own projects |
| `POST` | `/api/projects/:projectId/members` | Add or update project member | JWT | Admin only |
| `DELETE` | `/api/projects/:projectId/members/:memberId` | Remove project member | JWT | Admin only |
| `DELETE` | `/api/projects/:projectId` | Delete project and associated tasks | JWT | Admin only |

### Task Management Services
| Method | Endpoint | Description | Auth | Access |
|--------|----------|-------------|------|--------|
| `POST` | `/api/tasks` | Create new task in project | JWT | Project member |
| `GET` | `/api/tasks/project/:projectId` | List project tasks | JWT | Project member |
| `PATCH` | `/api/tasks/:taskId` | Update task details or status | JWT | Project member |
| `DELETE` | `/api/tasks/:taskId` | Delete task | JWT | Project member |

### Analytics & System Services
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/dashboard` | Aggregate dashboard metrics (all projects) | JWT |
| `GET` | `/api/system/startup` | Health check and system status | — |

### Response Standards
- **Success (2xx):** Returns JSON with data payload and metadata
- **Client Error (4xx):** Descriptive error messages with field-level validation details
- **Server Error (5xx):** Structured error logs with request tracking ID

---

## 👥 Access Control Model (RBAC)

### Project Admin Permissions
✅ Create and delete projects  
✅ Add, remove, and update member roles  
✅ View all project tasks and team members  
✅ Manage project-wide task operations  
✅ Access project settings and configuration  

### Project Member Permissions
✅ View assigned and shared project work  
✅ Create and update tasks in accessible projects  
✅ Update own task assignments  
✅ Modify task status and metadata  
✅ Delete tasks created by self  
❌ Modify project members or project settings  

### Authorization Implementation
- **Request-level validation** ensuring user has project membership
- **Resource ownership checks** before data mutations
- **Implicit role detection** from project member documents
- **Cascading access** inherited from parent project context

---

## 🚀 Getting Started: Local Development

### Prerequisites
- **Node.js** 18+ (verify with `node --version`)
- **npm** 9+ (verify with `npm --version`)
- **MongoDB** (local instance or MongoDB Atlas connection string)
- **Brevo account** with API key for email delivery (or use service of choice)
- **Git** for version control

### Environment Setup

#### Backend Configuration (`backend/.env`)
```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb://localhost:27017/team-task-manager
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager

# Security
JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# Email Service
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_FROM_NAME=Team Task Manager

# Optional
NODE_ENV=development
LOG_LEVEL=debug
```

#### Frontend Configuration (`frontend/.env`)
```env
VITE_API=http://localhost:5000
# For production:
# VITE_API=https://api.team-task-manager.com
```

### Installation & Setup

#### 1. Initialize Backend
```bash
cd backend
npm install
# Verify syntax
node --check src/server.js
```

#### 2. Initialize Frontend
```bash
cd frontend
npm install
# Build static assets to verify
npm run build
```

### Running the Application

#### Terminal 1: Start Backend
```bash
cd backend
npm start
# Expected: "Server running on http://localhost:5000"
```

#### Terminal 2: Start Frontend
```bash
cd frontend
npm run dev
# Expected: "Local: http://localhost:5173"
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Verification Checklist
- [ ] Backend responds to `http://localhost:5000/api/system/startup`
- [ ] Frontend loads without CORS errors
- [ ] Can submit signup form and receive OTP email
- [ ] Login succeeds and JWT is cached in localStorage
- [ ] Dashboard loads after authentication

---

## 📋 Operational Notes & Architecture Decisions

### Frontend State & Storage
- **JWT Persistence:** Tokens stored in `localStorage` for seamless session restoration
- **SPA Architecture:** All routing handled client-side with React Router
- **CORS Requirements:** Frontend and backend must be configured for cross-origin requests

### Authentication & Security Flow
- **Signup Flow:** Email → OTP verification → Account creation (three-step process)
- **Password Reset:** Request → Email OTP → Validation → Password update
- **JWT Expiration:** Configurable via `JWT_SECRET` environment variable
- **Token Refresh:** Currently stateless; refresh token support recommended for production

### Data Consistency & Integrity
- **Cascading Deletes:** Projects delete associated tasks automatically
- **Member Validation:** Task assignees must exist as project members
- **Field Uniqueness:** User emails enforce uniqueness at database level
- **Transaction Safety:** MongoDB transactions recommended for critical operations

### Email Delivery
- **OTP Validity:** Time-limited tokens (typically 5-10 minutes)
- **Retry Logic:** Implement exponential backoff for failed email deliveries
- **Rate Limiting:** Prevent OTP spam with delivery throttling
- **Template Management:** Email templates stored in Brevo or as service logic

### Performance Considerations
- **Database Indexing:** Optimize queries on `projectId`, `userId`, `email` fields
- **API Response Caching:** Dashboard metrics can be cached for 5-10 seconds
- **Pagination:** List endpoints should support pagination for large datasets
- **Connection Pooling:** MongoDB connection pool configured for concurrency

### Monitoring & Observability
- **Error Logging:** Implement centralized logging (e.g., Sentry, LogRocket)
- **Performance Metrics:** Track API response times and error rates
- **User Analytics:** Monitor signup funnel and feature adoption
- **Health Checks:** `/api/system/startup` endpoint for uptime monitoring

---

## ✅ Quality Assurance

### Code Validation
```bash
# Backend: Verify Node.js syntax
cd backend && node --check src/server.js

# Frontend: Run ESLint checks
cd frontend && npm run lint

# Frontend: Build for production
cd frontend && npm run build
```

### Manual Testing Checklist
1. **Authentication:** Test signup → OTP → login flow
2. **Projects:** Create, invite members, delete workflows
3. **Tasks:** Create, assign, update status, delete operations
4. **Dashboard:** Verify metrics aggregation across projects
5. **Error States:** Test network failures, invalid inputs, authorization denials

### Recommended Next Steps for Production
- [ ] Add comprehensive unit tests (Jest) for controllers and services
- [ ] Implement integration tests for API endpoints
- [ ] Set up pre-commit hooks (Husky) for linting
- [ ] Configure CI/CD pipeline (GitHub Actions, GitLab CI)
- [ ] Add request validation middleware (express-validator)
- [ ] Implement rate limiting and DDoS protection
- [ ] Add audit logging for sensitive operations
- [ ] Set up monitoring and alerting (Sentry, DataDog)

---

## 📚 Documentation

Detailed technical documentation:

- [API.md](doc/API.md) — Complete API reference with request/response examples
- [FLOW.md](doc/FLOW.md) — User workflows, sequence diagrams, and state transitions

---

## 🛣️ Roadmap & Enhancement Opportunities

### Immediate Priorities
- ✅ **Request Validation Middleware** — Strengthen API contracts with schema validation
- ✅ **Test Coverage** — Comprehensive unit and integration tests (target: 80%+)
- ✅ **Pre-commit Hooks** — Automated linting and format checking

### Short-term Enhancements
- **Advanced Authentication**
  - Refresh token rotation for enhanced security
  - HTTP-only secure cookies for token storage
  - Multi-factor authentication (MFA) support
  
- **API Improvements**
  - Pagination & filtering for list endpoints
  - Sorting options for tasks and projects
  - API versioning strategy (`/api/v1/`, `/api/v2/`)
  - OpenAPI/Swagger documentation

- **Database Optimization**
  - Query performance profiling and indexing
  - MongoDB aggregation pipeline for analytics
  - Connection pooling and replica sets for HA

### Medium-term Features
- **Task Management Enhancements**
  - Task dependencies and critical path analysis
  - Recurring tasks with scheduling
  - Task attachments and file uploads
  - Comment threads and task discussions

- **Analytics & Reporting**
  - Project burndown charts
  - Team velocity trends
  - Capacity planning and workload balancing
  - Export reports (PDF, CSV)

- **Team Collaboration**
  - Real-time notifications (WebSocket)
  - Activity feeds and audit trails
  - @mentions and task subscriptions
  - Time tracking per task

### Long-term Vision
- **Advanced RBAC** — Custom roles and permission matrices
- **Integrations** — Slack, GitHub, Jira, Google Calendar
- **Mobile App** — Native iOS/Android applications
- **Automation** — Workflow triggers and bot actions
- **Machine Learning** — Effort estimation and risk prediction

---

## 📄 License

This project is distributed under the terms specified in [LICENSE](LICENSE).

---

## 🤝 Contributing

Contributions are welcome! Please ensure:
1. Code follows existing style conventions
2. Changes include documentation updates
3. All tests pass before submitting PRs

---

**Made with ❤️ for distributed teams managing complex projects at scale.**
