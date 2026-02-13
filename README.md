# Project Tracking System

A full-stack web application for managing projects with a clean, production-ready architecture.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Architecture**: Clean separation (Routes → Controllers → Services → Database)

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Modern CSS
- **State Management**: React Hooks

## Features

### Core Functionality
- Create, read, update, and delete projects
- Status-based filtering
- Search by project name or client name
- Sortable project list by creation date or start date
- Soft delete for data preservation
- Status transition validation

### Project Fields
- **Required**: name, clientName, status (active, on_hold, completed), startDate
- **Optional**: endDate, priority (low, medium, high)
- **Auto-generated**: id, createdAt, updatedAt

### Status Transitions
- `active` → `on_hold` or `completed`
- `on_hold` → `active` or `completed`
- `completed` → no transitions allowed

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm installed

### Backend Setup

```bash
cd backend
npm install
npm start
```

The backend server will start on http://localhost:3000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on http://localhost:5173

## API Documentation

Base URL: `http://localhost:3000`

### Create Project
```http
POST /projects
Content-Type: application/json

{
  "name": "Website Redesign",
  "client_name": "Acme Corp",
  "status": "active",
  "start_date": "2024-01-15",
  "end_date": "2024-06-30",
  "priority": "high"
}
```

**Response**: 201 Created
```json
{
  "id": 1,
  "name": "Website Redesign",
  "clientName": "Acme Corp",
  "status": "active",
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",
  "priority": "high",
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-10T10:00:00.000Z"
}
```

### List Projects
```http
GET /projects
GET /projects?status=active
GET /projects?search=acme
GET /projects?sort_by=startDate
GET /projects?status=active&search=website&sort_by=createdAt
```

**Response**: 200 OK
```json
[
  {
    "id": 1,
    "name": "Website Redesign",
    "clientName": "Acme Corp",
    "status": "active",
    "startDate": "2024-01-15",
    "endDate": "2024-06-30",
    "priority": "high",
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z"
  }
]
```

### Get Project by ID
```http
GET /projects/:id
```

**Response**: 200 OK (same format as create)

### Update Project Status
```http
PATCH /projects/:id/status
Content-Type: application/json

{
  "status": "completed"
}
```

**Response**: 200 OK (returns updated project)

**Validation**: Only valid transitions are allowed based on current status.

### Delete Project
```http
DELETE /projects/:id
```

**Response**: 200 OK
```json
{
  "message": "Project deleted successfully"
}
```

Note: This is a soft delete. The project is marked as deleted but not removed from the database.

### Error Responses

All endpoints return consistent error formats:

```json
{
  "error": "Validation failed",
  "details": ["end_date must be greater than or equal to start_date"]
}
```

HTTP Status Codes:
- `400`: Validation error
- `404`: Resource not found
- `500`: Internal server error

## Project Structure

```
rudratek/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js        # Database initialization
│   │   ├── controllers/
│   │   │   └── projects.controller.js  # Request handling
│   │   ├── services/
│   │   │   └── projects.service.js     # Business logic
│   │   ├── routes/
│   │   │   └── projects.routes.js      # API routes
│   │   ├── middleware/
│   │   │   ├── validation.js           # Input validation
│   │   │   └── errorHandler.js         # Error handling
│   │   └── server.js              # Express app setup
│   ├── data/                      # SQLite database (auto-created)
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx      # Main dashboard view
│   │   │   ├── ProjectCard.jsx    # Project card component
│   │   │   └── ProjectDetail.jsx  # Project detail modal
│   │   ├── services/
│   │   │   └── api.js             # API client
│   │   ├── App.jsx                # Root component
│   │   ├── App.css                # Styling
│   │   └── main.jsx               # Entry point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## Design Decisions & Trade-offs

### Database Choice
**Decision**: SQLite with better-sqlite3
**Rationale**: Simple file-based database that requires no setup, perfect for development and small-scale deployments. Synchronous API provides better error handling and simpler code.
**Trade-off**: Not suitable for high-concurrency production use. For production, migrate to PostgreSQL or MySQL.

### Architecture
**Decision**: Clean separation of concerns (Routes → Controllers → Services)
**Rationale**: Makes code testable, maintainable, and easier to understand. Services contain all business logic, making them reusable.
**Trade-off**: More files and slight overhead for simple operations, but worth it for maintainability.

### Soft Delete
**Decision**: Mark records as deleted instead of removing them
**Rationale**: Preserves data for auditing and potential recovery.
**Trade-off**: Queries must filter out deleted records, slightly more complex queries.

### Status Transitions
**Decision**: Enforce strict state machine for status changes
**Rationale**: Prevents invalid state transitions and maintains data integrity.
**Trade-off**: Less flexibility, but ensures consistency.

### Additional Field
**Decision**: Added `priority` field (low, medium, high)
**Rationale**: Common business requirement for project management. Helps with project prioritization and resource allocation.

### Frontend State Management
**Decision**: React hooks without external state library
**Rationale**: Sufficient for this scope. Keeps dependencies minimal.
**Trade-off**: For larger apps, might benefit from Redux or Zustand.

### API Design
**Decision**: RESTful endpoints with consistent error handling
**Rationale**: Industry standard, easy to understand and document.
**Trade-off**: Could use GraphQL for more flexible queries, but adds complexity.

## AI Usage Disclosure

### Tools Used
- **GitHub Copilot**: Code completion and suggestions
- **Claude (Anthropic)**: Architecture planning and code review

### Usage Breakdown

#### Backend
- **Structure & Architecture**: AI-assisted design of the layered architecture pattern
- **Validation Logic**: AI generated initial validation rules, manually refined edge cases
- **Status Transitions**: AI suggested the state machine pattern, manually implemented specific rules
- **Error Handling**: AI suggested centralized error handling approach
- **Database Schema**: Manually designed based on requirements, AI formatted SQL

#### Frontend
- **Component Structure**: AI suggested component breakdown, manually organized hierarchy
- **State Management**: AI provided hooks patterns, manually implemented specific logic
- **Styling**: AI generated base CSS, manually adjusted colors, spacing, and responsive behavior
- **API Integration**: AI provided fetch patterns, manually added error handling

#### Debugging
- AI was not used for debugging as no bugs were encountered during development

### What I Modified
- Validation error messages for better clarity
- CSS colors and spacing for visual consistency
- Component state management for optimal re-rendering
- API response formatting for camelCase consistency

### What I Rejected
- AI suggestion to use TypeScript (added complexity for this scope)
- AI suggestion for Redux (unnecessary for this app size)
- AI suggestion for pagination (not in requirements)

### Understanding Level
- **Fully Understand**: Architecture pattern, React hooks, Express middleware, SQLite queries, validation logic, status transitions, all component interactions
- **Partially Understand**: Some advanced SQLite optimizations (WAL mode internals), specific better-sqlite3 performance characteristics

## Assumptions

1. **Single User**: No authentication or multi-tenancy required
2. **Local Deployment**: No production hosting considerations
3. **Date Format**: ISO 8601 date format (YYYY-MM-DD) for all dates
4. **No Real-time Updates**: No WebSocket or polling for live updates
5. **No File Uploads**: Projects don't have attachments or documents
6. **Browser Support**: Modern browsers with ES6+ support
7. **Network**: Backend and frontend run on same machine (localhost)

## Future Enhancements

- User authentication and authorization
- Project assignment to team members
- File attachments and documentation
- Activity timeline and audit logs
- Email notifications
- Advanced filtering and reporting
- Export to CSV/PDF
- Project templates
- Mobile app

## Testing

### Manual Testing Checklist

Backend:
- [x] Create project with all fields
- [x] Create project with required fields only
- [x] List all projects
- [x] Filter by status
- [x] Search by name and client
- [x] Sort by different fields
- [x] Combine filters
- [x] Get project by ID
- [x] Update status (valid transitions)
- [x] Update status (invalid transitions)
- [x] Delete project
- [x] Access deleted project

Frontend:
- [x] Load dashboard
- [x] Display projects
- [x] Filter by status
- [x] Search functionality
- [x] Combined filters
- [x] Sort projects
- [x] Click project to view details
- [x] Update project status
- [x] Loading state
- [x] Empty state
- [x] No results state
- [x] Error state with retry

## License

MIT
