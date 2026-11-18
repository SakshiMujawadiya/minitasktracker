# Mini Task Tracker

A full-stack task management application developed as part of a MERN Stack technical assignment, built with **Next.js (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **Node.js**, **Express.js**, and **MongoDB with Mongoose**.

---

## Project Overview

Mini Task Tracker is an end-to-end task management solution engineered to fulfill the requirements of a MERN Stack technical interview assignment. The project demonstrates senior-level full-stack development practices, including:

- Clean architectural separation between frontend UI components, API services, Express controllers, service logic, data models, and request validators.
- Persistent data storage in MongoDB using Mongoose schemas, indexes, and custom validators.
- Strict server-side and client-side input validation and resilient error handling.
- Modern, accessible, and responsive user experience inspired by modern SaaS project management tools.
- Comprehensive automated integration testing suite validating mandatory assignment test scenarios and edge cases.

---

## Features

### Core Task Operations (CRUD)
- **Create Tasks**: Modal form capturing task title (required, max 100 characters), description, workflow status, priority level, optional assignee, and optional due date. Enforces both client-side character counting (`X/100`) and strict server-side validation.
- **Edit Tasks**: Dedicated edit dialog allowing partial or full updates to task fields (title, description, status, priority, assignee, due date) with form pre-population.
- **Update Task Status**: Quick status transitions supported through inline dropdowns on task cards, column advance actions in Kanban view, and workflow selectors in the task detail drawer.
- **Delete Tasks with Confirmation**: Accessible modal displaying the specific task title before permanent removal to prevent accidental data loss.

### Search, Filtering & Sorting
- **Real-Time Title & Description Search**: Instant search filtering tasks case-insensitively across titles and descriptions.
- **Status Filtering**: Filter tasks by workflow state: `All`, `To Do`, `In Progress`, and `Done` with active tab counts.
- **Priority Filtering**: Filter tasks by priority: `All Priorities`, `Low`, `Medium`, and `High`.
- **Task Sorting**: Dynamic sorting supporting multiple criteria:
  - Newest First (default)
  - Oldest First
  - Priority (High to Low)
  - Priority (Low to High)
  - Title (A to Z)
  - Title (Z to A)
- **Task Pagination**: Backend query parameter support for `page` and `limit` to support pagination when dealing with large task collections.

### Dashboard & Views
- **Dashboard Statistics**: Dynamic summary cards displaying live counts for Total Tasks, To Do, In Progress, and Completed Tasks, alongside an overall completion progress bar.
- **List & Kanban Views**: Seamless toggle between a traditional list view and a 3-column Kanban board (`To Do`, `In Progress`, `Done`).
- **Task Detail Drawer**: Side slide-over drawer providing comprehensive task metadata, full timestamps, ID inspectability, and quick workflow controls.
- **Data Export**: Export tasks to CSV or JSON formats for offline review or reporting.

### User Experience & Reliability
- **Form Validation**: Strict client-side and server-side validation with real-time feedback and server error toast messages.
- **Loading & Skeleton States**: Animated skeleton screens during data fetching to eliminate layout shift.
- **Contextual Empty States**: Distinct visual messaging when the workspace is brand new versus when active search/filter combinations return zero results (including a 1-click filter reset).
- **Error State & Recovery**: User-friendly error cards with a direct "Retry" button when network or server issues arise.
- **MongoDB Persistence**: Reliable data storage in MongoDB with automatic timestamping and compound indexes for performant querying.

---

## Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js (v18+)
- **Web Framework**: Express.js 4
- **Database**: MongoDB (v6.0+)
- **Object Data Modeling (ODM)**: Mongoose (v9+)
- **Cross-Origin Resource Sharing**: CORS
- **Environment Management**: dotenv

### Testing
- **Test Runner & Assertion**: Jest 29
- **HTTP Integration Testing**: Supertest 7

---

## Project Architecture

```
minitasktracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection and lifecycle management
│   ├── controllers/
│   │   └── taskController.js     # Express request/response handlers
│   ├── middleware/
│   │   ├── errorHandler.js       # Centralized global error handling middleware
│   │   ├── taskValidator.js      # Server-side validation for request body & queries
│   │   └── validateObjectId.js   # MongoDB ObjectId format validator
│   ├── models/
│   │   └── Task.js               # Mongoose schema, indexes, and normalizers
│   ├── routes/
│   │   └── taskRoutes.js         # REST route definitions
│   ├── services/
│   │   └── taskService.js        # Business logic and database operations
│   ├── tests/
│   │   └── task.test.js          # Automated Jest + Supertest integration tests
│   ├── .env.example              # Backend environment template
│   ├── jest.config.js            # Jest testing configuration
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express application entrypoint
│
├── frontend/
│   ├── app/
│   │   ├── globals.css           # Tailwind CSS directives and custom styling
│   │   ├── layout.tsx            # Root application layout and HTML metadata
│   │   └── page.tsx              # Main dashboard page (client component)
│   ├── components/
│   │   ├── common/
│   │   │   ├── AssigneeAvatar.tsx
│   │   │   ├── CommandPalette.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   ├── LoadingSkeleton.tsx
│   │   │   └── Toast.tsx
│   │   ├── dashboard/
│   │   │   ├── Header.tsx
│   │   │   └── SummaryCards.tsx
│   │   ├── layout/
│   │   │   └── Sidebar.tsx
│   │   └── tasks/
│   │       ├── DeleteModal.tsx
│   │       ├── EditTaskModal.tsx
│   │       ├── TaskBoard.tsx
│   │       ├── TaskCard.tsx
│   │       ├── TaskDetailDrawer.tsx
│   │       ├── TaskFilterBar.tsx
│   │       ├── TaskHistory.tsx
│   │       ├── TaskList.tsx
│   │       └── TaskModal.tsx
│   ├── lib/
│   │   └── api.ts                # API client utilities
│   ├── services/
│   │   └── taskService.ts        # Axios API service functions
│   ├── types/
│   │   └── task.ts               # Shared TypeScript interfaces and enums
│   ├── .env.local.example        # Frontend environment template
│   ├── next.config.js            # Next.js configuration
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tailwind.config.js        # Tailwind CSS theme configuration
│   └── tsconfig.json             # TypeScript compiler configuration
│
├── .gitignore                    # Global repository ignore rules
└── README.md                     # Project documentation
```

---

## Application Screenshots

> *Add application screenshots below to showcase key views.*

| Dashboard (List View) | Kanban Board View |
|:---:|:---:|
| *(Add List View screenshot here)* | *(Add Board View screenshot here)* |

| Task Creation Modal | Task Details Drawer |
|:---:|:---:|
| *(Add Create Modal screenshot here)* | *(Add Detail Drawer screenshot here)* |

---

## Installation and Setup

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB community service running on port `27017` or a MongoDB Atlas connection URI

### 2. Clone the Repository
```bash
git clone <repository-url>
cd minitasktracker
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
```

### 4. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 5. Configure Environment Variables

**Backend (`backend/.env`):**
```bash
cd ../backend
cp .env.example .env
```
Ensure the variables match your MongoDB instance:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/taskflow_test
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend (`frontend/.env.local`):**
```bash
cd ../frontend
cp .env.local.example .env.local
```
Ensure the API URL points to the backend:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 6. Connect MongoDB
Ensure MongoDB is running locally:
```bash
# Verify MongoDB service status or run mongod:
mongod --dbpath <path-to-db>
```

### 7. Start the Backend Server
```bash
cd ../backend
npm run dev
# Server will start on http://localhost:5000
```

### 8. Start the Frontend Application
In a separate terminal:
```bash
cd ../frontend
npm run dev
# Application will start on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Environment Variables

### Backend (`backend/.env.example`)
| Variable | Description | Example / Default |
|---|---|---|
| `PORT` | Port for the Express server | `5000` |
| `MONGODB_URI` | MongoDB database connection string | `mongodb://127.0.0.1:27017/taskflow` |
| `TEST_MONGODB_URI` | Isolated database connection string for tests | `mongodb://127.0.0.1:27017/taskflow_test` |
| `CLIENT_URL` | Allowed origin for CORS | `http://localhost:3000` |
| `NODE_ENV` | Application runtime environment | `development` |

### Frontend (`frontend/.env.local.example`)
| Variable | Description | Example / Default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL for the Express REST API | `http://localhost:5000/api` |

---

## API Documentation

The backend exposes RESTful endpoints mounted at both `/tasks` and `/api/tasks`.

### 1. Create Task
- **Method**: `POST`
- **Endpoint**: `/tasks` (or `/api/tasks`)
- **Purpose**: Creates a new task in MongoDB.
- **Request Body**:
  ```json
  {
    "title": "Design authentication wireframes",
    "description": "Create responsive wireframes for desktop and mobile login flows.",
    "status": "todo",
    "priority": "high",
    "assignedTo": "Sarah Jenkins",
    "dueDate": "2026-12-01T00:00:00.000Z"
  }
  ```
  - `title` (*required, string*): 1 to 100 characters.
  - `description` (*optional, string*): Detailed notes.
  - `status` (*optional, string*): One of `todo`, `in_progress`, `done` (defaults to `todo`).
  - `priority` (*optional, string*): One of `low`, `medium`, `high` (defaults to `medium`).
  - `assignedTo` (*optional, string*): Member name.
  - `dueDate` (*optional, ISO string*): Due date.
- **Example Response (`HTTP 201 Created`)**:
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "data": {
      "id": "673cf6d1839174092b77a012",
      "title": "Design authentication wireframes",
      "description": "Create responsive wireframes for desktop and mobile login flows.",
      "status": "todo",
      "priority": "high",
      "assignedTo": "Sarah Jenkins",
      "dueDate": "2026-12-01T00:00:00.000Z",
      "createdAt": "2026-11-19T00:00:00.000Z",
      "updatedAt": "2026-11-19T00:00:00.000Z"
    }
  }
  ```
- **Validation & Errors**:
  - Missing or empty title: `HTTP 400 Bad Request` with `{"success": false, "message": "Task title is required and cannot be empty"}`
  - Title > 100 characters: `HTTP 400 Bad Request` with `{"success": false, "message": "Task title cannot exceed 100 characters"}`
  - Invalid status: `HTTP 400 Bad Request` with `{"success": false, "message": "Invalid status. Must be one of: todo, in_progress, done"}`
  - Invalid priority: `HTTP 400 Bad Request` with `{"success": false, "message": "Invalid priority. Must be one of: low, medium, high"}`

### 2. List Tasks
- **Method**: `GET`
- **Endpoint**: `/tasks` (or `/api/tasks`)
- **Purpose**: Retrieves tasks with optional filtering, search, sorting, and pagination.
- **Query Parameters**:
  - `status` (*optional*): `todo`, `in_progress`, or `done`
  - `priority` (*optional*): `low`, `medium`, or `high`
  - `search` (*optional*): String query to match in task title or description
  - `sortBy` (*optional*): `createdAt`, `priority`, `status`, or `title`
  - `sortOrder` (*optional*): `asc` or `desc` (default: `desc`)
  - `page` (*optional, number*): Page number for pagination
  - `limit` (*optional, number*): Maximum number of items per page
- **Example Response (`HTTP 200 OK`)**:
  ```json
  {
    "success": true,
    "count": 1,
    "total": 1,
    "page": 1,
    "totalPages": 1,
    "data": [
      {
        "id": "673cf6d1839174092b77a012",
        "title": "Design authentication wireframes",
        "description": "Create responsive wireframes for desktop and mobile login flows.",
        "status": "todo",
        "priority": "high",
        "assignedTo": "Sarah Jenkins",
        "dueDate": "2026-12-01T00:00:00.000Z",
        "createdAt": "2026-11-19T00:00:00.000Z",
        "updatedAt": "2026-11-19T00:00:00.000Z"
      }
    ]
  }
  ```
- **Validation & Errors**:
  - Invalid status query: `HTTP 400 Bad Request` with `{"success": false, "message": "Invalid status filter..."}`

### 3. Update Task (Partial Update)
- **Method**: `PATCH`
- **Endpoint**: `/tasks/:id` (or `/api/tasks/:id`)
- **Purpose**: Partially updates an existing task (e.g. status transition, editing title, priority, or details).
- **Request Body**:
  ```json
  {
    "status": "in_progress"
  }
  ```
  *(Any subset of `title`, `description`, `status`, `priority`, `assignedTo`, `dueDate`)*
- **Example Response (`HTTP 200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Task status updated successfully",
    "data": {
      "id": "673cf6d1839174092b77a012",
      "title": "Design authentication wireframes",
      "status": "in_progress",
      "priority": "high",
      "updatedAt": "2026-11-19T00:05:00.000Z"
    }
  }
  ```
- **Validation & Errors**:
  - Invalid MongoDB ID format: `HTTP 400 Bad Request` with `{"success": false, "message": "Invalid task ID format"}`
  - Non-existent ID: `HTTP 404 Not Found` with `{"success": false, "message": "Task with ID ... not found"}`
  - Empty update payload: `HTTP 400 Bad Request` with `{"success": false, "message": "At least one field ... must be provided"}`
  - Unexpected/disallowed fields: `HTTP 400 Bad Request` with `{"success": false, "message": "Only supported fields ... can be updated"}`

### 4. Delete Task
- **Method**: `DELETE`
- **Endpoint**: `/tasks/:id` (or `/api/tasks/:id`)
- **Purpose**: Permanently removes a task by ID.
- **Example Response (`HTTP 200 OK`)**:
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "id": "673cf6d1839174092b77a012"
  }
  ```
- **Validation & Errors**:
  - Invalid MongoDB ID: `HTTP 400 Bad Request`
  - Non-existent ID: `HTTP 404 Not Found`

### 5. Dashboard Statistics
- **Method**: `GET`
- **Endpoint**: `/tasks/stats` (or `/api/tasks/stats`)
- **Purpose**: Returns aggregate task counts and completion percentage.
- **Example Response (`HTTP 200 OK`)**:
  ```json
  {
    "success": true,
    "data": {
      "total": 12,
      "todo": 5,
      "inProgress": 4,
      "done": 3,
      "completionRate": 25
    }
  }
  ```

---

## Running Tests

Automated integration tests are implemented using **Jest** and **Supertest** to test the API endpoints against an isolated MongoDB test database.

### Running the Test Suite
```bash
cd backend
npm test
```

### Mandatory Assignment Test Scenarios
The test suite validates the two mandatory interview assignment requirements:

1. **Invalid Task Creation**:
   - Sends a `POST /tasks` request with an empty title (`title: ""`).
   - Verifies the response returns `HTTP 400 Bad Request`.
   - Confirms that no task record is created in the MongoDB collection (`countDocuments() === 0`).
2. **Successful Task Status Update**:
   - Creates a valid task in MongoDB (`POST /tasks` with status `todo`).
   - Sends a `PATCH /tasks/:id` request with `{ "status": "done" }`.
   - Verifies the response returns `HTTP 200 OK`.
   - Queries the database directly to confirm the updated status (`done`) has persisted.

In total, 21 automated integration tests verify all CRUD operations, enum normalizations, boundaries, query parameters, and error handlers.

---

## Technical Decisions

- **Next.js 14 App Router**: Selected for its clean file-system routing, first-class TypeScript integration, server-side pre-rendering capabilities, and streamlined client component boundaries.
- **Separation of Frontend and Backend**: Keeping the Express API independent from Next.js ensures clean separation of concerns, independent scaling, and standard REST conventions suitable for full-stack MERN architectures.
- **MongoDB & Mongoose**: Selected for schema flexibility with structured ODM validation, compound indexes for fast search and sorting, automatic timestamp tracking, and ObjectId validation.
- **Centralized Service Architecture**: The frontend abstracts API interactions into a dedicated `taskService.ts` module with unified Axios error handling, preventing boilerplate across UI components.
- **Defensive Error Handling**: All endpoints validate request structures before database operations. Uncaught exceptions are handled centrally by Express error-handling middleware.

---

## Authentication and Security

While user authentication is outside the scope of this assignment, in a production-ready application the following security measures would be implemented:

1. **JWT Authentication**: Users authenticate via `/api/auth/login`, receiving signed JSON Web Tokens (Access Token in HttpOnly cookie, Refresh Token stored securely in database).
2. **Password Hashing**: Passwords stored using `bcrypt` with salt rounds (cost factor 12).
3. **User Ownership**: Every `Task` model would carry an indexed `userId` reference:
   ```javascript
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
   ```
4. **Authorization Middleware**: Express route middleware (`requireAuth`) validating the JWT and scoping all database queries (`find`, `findByIdAndUpdate`, `deleteOne`) strictly to `req.user.id`.
5. **Rate Limiting & Headers**: Implementation of `express-rate-limit` to prevent brute force attacks and `helmet` for HTTP security headers.

---

## Assumptions and Limitations

- **Single Workspace**: Tasks belong to a single global workspace since multi-tenant authentication is intentionally omitted per assignment specifications.
- **Local MongoDB**: The default setup assumes a standard local MongoDB instance on port `27017` or an equivalent remote URI specified via `MONGODB_URI`.
- **Client-Side Hydration Safeguards**: Formatted locale dates utilize `suppressHydrationWarning` to prevent timezone-related hydration differences between server pre-rendering and client rendering.

---

## Future Improvements

- **User Accounts & Roles**: Multi-user registration, team workspaces, and role-based permissions (Viewer, Editor, Admin).
- **Drag-and-Drop Kanban**: Smooth drag-and-drop column transitions using `@hello-pangea/dnd` or `dnd-kit`.
- **Real-Time Synchronization**: WebSocket or Server-Sent Events (SSE) updates when teammates modify tasks concurrently.
- **Due Date Reminders & Notifications**: Automated email or in-app alerts for overdue tasks.
- **CI/CD & Containerization**: Dockerfile configurations for multi-stage production builds and GitHub Actions workflows for continuous integration testing.
