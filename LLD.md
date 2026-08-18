# Low-Level Design (LLD)
**Project Name:** AI Project Mentor

## 1. Database Schema

### 1.1 PostgreSQL (Relational Data)
Located in `server/sql/schema.sql`.

**Table: `users`**
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | SERIAL | PRIMARY KEY | Unique auto-increment ID |
| `name` | VARCHAR(100) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login identifier |
| `password_hash` | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| `role` | VARCHAR(50) | DEFAULT 'STUDENT' | Access level (STUDENT/MENTOR) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Audit field |

*(Additional tables defined in schema include `projects` mirroring logic, `project_members` mapping M:N relationships, and `activity_logs`).*

### 1.2 MongoDB (Document Data)
Located in `server/models/*.js`.

**Model: `Project`**
```json
{
  "_id": "ObjectId",
  "title": { "type": "String", "required": true },
  "description": { "type": "String" },
  "status": { "type": "String", "enum": ["PLANNING", "IN_PROGRESS", "COMPLETED"] },
  "progress": { "type": "Number", "default": 0 },
  "owner": { "type": "Number" }, // Matches PostgreSQL User ID
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

**Model: `Task`**
```json
{
  "_id": "ObjectId",
  "project": { "type": "ObjectId", "ref": "Project" },
  "title": { "type": "String", "required": true },
  "description": { "type": "String" },
  "status": { "type": "String", "enum": ["TODO", "IN_PROGRESS", "COMPLETED"] },
  "priority": { "type": "String", "enum": ["LOW", "MEDIUM", "HIGH"] }
}
```

## 2. API Endpoints Contract

### 2.1 Authentication (`/api/auth`)
- **POST `/register`**: Creates Postgres user. Returns `{ user, token }`.
- **POST `/login`**: Verifies Postgres user. Returns `{ user, token }`.
- **GET `/me`**: Returns current profile (Requires JWT).

### 2.2 Projects (`/api/projects`)
- **GET `/`**: Retrieves all MongoDB projects owned by `req.user.id`.
- **POST `/`**: Creates a new MongoDB project.
- **GET `/:id`**: Retrieves a single project.
- **PATCH `/:id`**: Updates project details.
- **DELETE `/:id`**: Removes project and cascades tasks.

### 2.3 Tasks (`/api/tasks` & nested)
- **GET `/api/projects/:projectId/tasks`**: Get all tasks for a project.
- **POST `/api/projects/:projectId/tasks`**: Create a new task.
- **PATCH `/api/tasks/:id`**: Update task status/details.
- **DELETE `/api/tasks/:id`**: Remove task.

### 2.4 AI Features (`/api/ai`)
- **POST `/plan`**: Accepts `{ "projectIdea": "..." }`. Returns structured JSON MVP roadmap.
- **POST `/mentor`**: Accepts `{ "projectId": "...", "message": "..." }`. Returns AI response string and saves conversation log.

## 3. Core Logic Workflows

### 3.1 Validation Pipeline
Before a controller processes a request, it must pass through the `validate` middleware factory:
```javascript
// router
router.post('/', validate(validateProject), projectController.createProject);

// Validation Middleware
const validate = (validationFn) => (req, res, next) => {
  const { isValid, errors } = validationFn(req.body);
  if (!isValid) return sendError(res, 400, 'Validation Failed', errors);
  next();
};
```
This ensures invalid Enums (e.g., status="UNKNOWN") or bad data types never reach the service layer.

### 3.2 AI Integration Parsing
The Google Generative AI often returns markdown-wrapped JSON (e.g., ` ```json ... ``` `). The `aiService.js` includes a `cleanJSONResponse` utility that strips these backticks and attempts `JSON.parse()`. If parsing fails, it throws a controlled error caught by the Express global error handler, preventing app crashes.

## 4. Frontend Component Tree
```text
<App>
  <AuthProvider> (Manages Global Token/User State)
    <BrowserRouter>
      <AppRoutes>
        ├─ <Login> / <Register> (Public)
        ├─ <ProtectedLayout> (Requires auth)
        │   ├─ <Navbar>
        │   ├─ <Dashboard> (Aggregates useProjects data)
        │   ├─ <Projects> (List view)
        │   ├─ <ProjectDetails> (Fetches specific useTasks)
        │   ├─ <AIPlanner> (Interacts with /api/ai/plan)
        │   └─ <AIChat> (Interacts with /api/ai/mentor)
```
