# AI Project Mentor — Viva Concept Reference Guide

This document maps **every rubric concept** directly to the codebase, with explanations, file locations, and viva Q&A.

---

## 1. System Design Basics: Frontend, Backend, DB & Systems Integration (0.2 pts)

### Where Implemented
| Layer | Technology | Files |
|---|---|---|
| Frontend | React 19 + Vite | `client/src/` |
| Backend | Express.js + Node.js | `server/` |
| NoSQL DB | MongoDB (Mongoose) | `server/models/`, `server/config/mongodb.js` |
| SQL DB | PostgreSQL (pg) | `server/sql/`, `server/config/postgres.js` |
| AI/LLM | OpenRouter (OpenAI SDK) | `server/services/aiService.js` |
| Caching | Redis | `server/config/redis.js`, `server/middleware/cacheMiddleware.js` |

### Architecture Flow
```
React Frontend (Vite) → Axios HTTP → Express REST API → Middleware Pipeline → Controllers → Services → MongoDB / PostgreSQL
                                                                                              ↓
                                                                                        AI Service → OpenRouter LLM
                                                                                              ↓
                                                                                        Redis Cache Layer
```

### Viva Q&A
- **Q: Explain your system architecture.**
- **A:** We use a MERN stack with dual-database polyglot persistence. React handles the UI with client-side routing. Express.js serves as the REST API layer with JWT auth middleware. MongoDB stores flexible documents (projects, tasks, AI plans) while PostgreSQL handles relational data (users, memberships, audit logs). Redis provides an optional caching layer, and we integrate with OpenRouter for LLM-based AI features.

---

## 2. Environment Variables & Secrets Management (0.2 pts)

### Where Implemented
- **File:** `server/config/env.js`
- **Template:** `.env.example`
- **Git Security:** `.gitignore` excludes `.env`

### How It Works
```javascript
// server/config/env.js — Centralized secrets management
const config = {
  port: process.env.PORT || 5001,
  jwtSecret: process.env.JWT_SECRET,      // Never hardcoded
  mongoUri: process.env.MONGO_URI,         // Database connection string
  postgresUri: process.env.POSTGRES_URI,   // PostgreSQL connection string
  llmApiKey: process.env.LLM_API_KEY,      // AI API key
};

// Fail-fast validation — app crashes early if secrets are missing
const requiredSecrets = ['jwtSecret', 'mongoUri', 'postgresUri', 'llmApiKey'];
```

### Viva Q&A
- **Q: Why use environment variables?**
- **A:** To separate configuration from code. Secrets like API keys and database passwords should NEVER be committed to version control. Environment variables allow different configurations per environment (dev/staging/production).

---

## 3. Git Workflow (0.3 pts)

### Where Implemented
- **CI/CD:** `.github/workflows/main.yml`
- **Branch Strategy:** Feature branching with PR-based merges

### Branch History
| Branch | Purpose | Merged To |
|---|---|---|
| `feature/database-setup` | MongoDB + PostgreSQL schemas | `main` |
| `feature/authentication` | JWT auth endpoints | `main` |
| `feature/project-crud` | Project CRUD API | `main` |
| `docs/system-architecture` | Documentation + AI features | `main` (PR #1) |

### Viva Q&A
- **Q: What git workflow did you follow?**
- **A:** Feature branching. Each feature was developed on a separate branch (`feature/database-setup`, `feature/authentication`, etc.) and merged into `main` via pull requests. We also have GitHub Actions CI that runs on every push/PR.

---

## 4. Async Data Fetching from API (0.2 pts)

### Where Implemented
- **API Client:** `client/src/services/api.js`
- **Custom Hooks:** `client/src/hooks/useProjects.js`, `client/src/hooks/useTasks.js`
- **Auth Context:** `client/src/context/AuthContext.jsx`

### How It Works
```javascript
// client/src/services/api.js — Axios with JWT interceptor
const api = axios.create({ baseURL: 'http://localhost:5001/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// client/src/hooks/useProjects.js — Async fetch inside useEffect
const fetchProjects = useCallback(async () => {
  setLoading(true);
  const res = await api.getProjects();  // async/await
  setProjects(res.data.data.projects);
  setLoading(false);
}, []);

useEffect(() => { fetchProjects(); }, [fetchProjects]);
```

### Viva Q&A
- **Q: How does your frontend fetch data from the backend?**
- **A:** We use Axios with a configured base URL. A request interceptor automatically attaches the JWT token from localStorage to every request. Custom React hooks (useProjects, useTasks) use useEffect to trigger async fetches on component mount and manage loading/error states with useState.

---

## 5. Client-Side Routing (0.2 pts)

### Where Implemented
- **File:** `client/src/routes/AppRoutes.jsx`

### How It Works
```javascript
// React Router v6 with protected routes and code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));

const ProtectedLayout = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;  // Renders child routes
};

// Routes: /, /login, /register, /dashboard, /projects, /ai-planner
```

### Viva Q&A
- **Q: What is client-side routing and how did you implement it?**
- **A:** Client-side routing handles navigation in the browser without full page reloads. We use React Router v6 with `<BrowserRouter>`, `<Routes>`, and `<Route>` components. Protected routes redirect unauthenticated users to `/login`. We use `React.lazy()` for code-splitting.

---

## 6. JavaScript — async/await (0.1 pts)

### Where Implemented
- **Concept File:** `client/src/concepts/AsyncAwait.js`
- **Production Usage:** `client/src/hooks/useProjects.js`, `server/controllers/*.js`

### Viva Q&A
- **Q: What is async/await?**
- **A:** Syntactic sugar over Promises. `async` makes a function return a Promise. `await` pauses execution until the Promise resolves. Errors are caught with try/catch.

---

## 7. JavaScript — Closures (0.1 pts)

### Where Implemented
- **Concept File:** `client/src/concepts/Closures.js`
- **Production Usage:** `server/middleware/validationMiddleware.js` (validate() factory), `client/src/hooks/useProjects.js`

### Viva Q&A
- **Q: What is a closure?**
- **A:** A function that remembers variables from its outer lexical scope even after the outer function has returned. Example: our `validate(validationFn)` middleware returns a function that "closes over" `validationFn`.

---

## 8. JavaScript — Event Loop (0.1 pts)

### Where Implemented
- **Concept File:** `client/src/concepts/EventLoop.js`
- **Production Usage:** `client/src/hooks/useProjects.js` (setTimeout for non-blocking logging)

### Viva Q&A
- **Q: Explain the event loop.**
- **A:** JS is single-threaded. The event loop checks: (1) run all synchronous code on the call stack, (2) process ALL microtasks (Promises), (3) process ONE macro-task (setTimeout). Repeat.

---

## 9. JavaScript — Hoisting (0.1 pts)

### Where Implemented
- **Concept File:** `client/src/concepts/Hoisting.js`
- **Production Usage:** `client/src/App.jsx` — `testHoisting()` called before declaration

### Viva Q&A
- **Q: What is hoisting?**
- **A:** JS moves declarations to the top of their scope during compilation. Function declarations are fully hoisted. `var` declarations are hoisted but set to `undefined`. `let`/`const` are in the Temporal Dead Zone.

---

## 10. JavaScript — Promises vs Callbacks (0.1 pts)

### Where Implemented
- **Concept File:** `client/src/concepts/PromisesVsCallbacks.js`
- **Production Usage:** `client/src/services/api.js` (all API calls return Promises)

### Viva Q&A
- **Q: Why are Promises better than callbacks?**
- **A:** Promises avoid callback hell (nested callbacks), provide centralized error handling with `.catch()`, support chaining with `.then()`, and enable parallel execution with `Promise.all()`.

---

## 11. React Component Composition (0.2 pts)

### Where Implemented
- **Files:** `client/src/pages/ProjectDetails.jsx`, `client/src/components/ui/card.jsx`, `client/src/components/ui/button.jsx`
- **Pattern:** `AppRoutes.jsx` uses `ProtectedLayout` wrapping child routes via `<Outlet />`

### How It Works
```jsx
// Composition: Breaking complex UI into small, reusable pieces
<AuthProvider>           {/* Context Provider (global state) */}
  <AppRoutes>            {/* Router composition */}
    <ProtectedLayout>    {/* Authenticated shell with navbar */}
      <Dashboard />      {/* Page composed of Card, Button components */}
    </ProtectedLayout>
  </AppRoutes>
</AuthProvider>
```

### Viva Q&A
- **Q: What is component composition in React?**
- **A:** Building complex UIs by combining small, reusable components. Our app composes `AuthProvider` → `AppRoutes` → `ProtectedLayout` → Page Components → UI primitives (Card, Button). Each component has a single responsibility.

---

## 12. Side Effects with useEffect (0.2 pts)

### Where Implemented
- **Files:** `client/src/hooks/useProjects.js`, `client/src/hooks/useTasks.js`, `client/src/context/AuthContext.jsx`

### How It Works
```javascript
// useProjects.js — fetch data on mount
useEffect(() => {
  fetchProjects();  // Side effect: API call
}, [fetchProjects]); // Dependency array controls when effect re-runs

// AuthContext.jsx — check authentication on mount
useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const res = await getMe();
      setUser(res.data.data.user);
    }
    setLoading(false);
  };
  checkAuth();
}, []);  // Empty array = runs ONCE on mount
```

### Viva Q&A
- **Q: What is useEffect and when does it run?**
- **A:** useEffect handles side effects (API calls, subscriptions, DOM manipulation). It runs AFTER the component renders. The dependency array controls re-execution: empty array = once on mount; with deps = when deps change; no array = every render.

---

## 13. State Management with useState (0.2 pts)

### Where Implemented
- **Files:** `client/src/pages/AIPlanner.jsx`, `client/src/pages/Register.jsx`, `client/src/context/AuthContext.jsx`, `client/src/hooks/useProjects.js`

### How It Works
```javascript
// AIPlanner.jsx — multiple state variables
const [idea, setIdea] = useState('');         // Form input
const [plan, setPlan] = useState(null);       // API response data
const [loading, setLoading] = useState(false); // Loading state
const [error, setError] = useState(null);      // Error state

// AuthContext.jsx — global auth state
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
```

### Viva Q&A
- **Q: What is useState?**
- **A:** A React hook that adds reactive state to functional components. It returns a [value, setter] pair. When the setter is called, React re-renders the component with the new value. State is preserved between re-renders.

---

## 14. CRUD Operations — MongoDB (0.2 pts)

### Where Implemented
- **Files:** `server/services/projectService.js`, `server/services/taskService.js`

### Operations
| Operation | Method | File |
|---|---|---|
| **C**reate | `new Project({...}).save()` | `projectService.js` |
| **R**ead | `Project.find()`, `Project.findOne()` | `projectService.js` |
| **U**pdate | `Project.findOneAndUpdate()` | `projectService.js` |
| **D**elete | `Project.findOneAndDelete()` (with transaction) | `projectService.js` |

### Viva Q&A
- **Q: How do you perform CRUD operations with MongoDB?**
- **A:** Using Mongoose ODM. Create: `new Model(data).save()`. Read: `Model.find()` or `Model.findOne()`. Update: `Model.findOneAndUpdate()` with `$set`. Delete: `Model.findOneAndDelete()`. Our delete operation uses MongoDB transactions to cascade-delete related tasks atomically.

---

## 15. Schema Modeling — MongoDB (0.2 pts)

### Where Implemented
- **Files:** `server/models/Project.js`, `server/models/Task.js`, `server/models/AIPlan.js`, `server/models/AIConversation.js`

### Features Demonstrated
```javascript
// Task.js — Rich schema modeling features
const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 140 }, // Validation
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'] },  // Enums
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },     // References
  subtasks: { type: [SubtaskSchema], default: [] }                       // Subdocuments
}, { timestamps: true });                                                 // Auto timestamps

TaskSchema.index({ project: 1, status: 1 });                             // Indexes
```

### Viva Q&A
- **Q: How did you model your MongoDB schemas?**
- **A:** Using Mongoose schemas with field-level validation (required, minlength, maxlength), enum constraints, ObjectId references between collections, embedded subdocuments (subtasks inside tasks), automatic timestamps, and compound indexes for query performance.

---

## 16. Relational Schema Design with PK/FK — PostgreSQL (0.2 pts)

### Where Implemented
- **File:** `server/sql/schema.sql`

### Schema
```sql
-- Primary Keys, Foreign Keys, Unique Constraints, Cascading Deletes
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL,
    CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id)
        REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE project_members (
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    CONSTRAINT fk_members_project FOREIGN KEY (project_id)
        REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT unique_project_user UNIQUE (project_id, user_id)
);
```

### Normalization (3NF)
- **1NF:** All columns hold atomic values (no arrays/repeating groups).
- **2NF:** No partial dependencies — all non-key attributes depend on the entire primary key.
- **3NF:** No transitive dependencies — non-key attributes depend only on the primary key.

### Viva Q&A
- **Q: Explain your relational schema design.**
- **A:** Four tables in 3NF: `users` (PK: id), `projects` (FK: owner_id → users), `project_members` (join table with compound unique constraint), and `activity_logs` (FK: user_id, project_id with CASCADE/SET NULL). Foreign keys enforce referential integrity, and cascading deletes clean up dependent records.

---

## 17. SQL JOINs — PostgreSQL (0.2 pts)

### Where Implemented
- **Files:** `server/sql/queries.js`, `server/sql/schema.sql`

### Three Types of JOINs Used
```sql
-- 1. INNER JOIN (3-table): User → Memberships → Projects
SELECT p.title, pm.role, u_owner.name AS owner_name
FROM project_members pm
INNER JOIN projects p ON pm.project_id = p.id
INNER JOIN users u_owner ON p.owner_id = u_owner.id
WHERE pm.user_id = $1;

-- 2. INNER JOIN (2-table): Project → Members with user details
SELECT u.name, pm.role FROM project_members pm
INNER JOIN users u ON pm.user_id = u.id
WHERE pm.project_id = $1;

-- 3. LEFT JOIN: Activity logs with user info (user may be null)
SELECT al.action, u.name AS user_name FROM activity_logs al
LEFT JOIN users u ON al.user_id = u.id
WHERE al.project_id = $1;
```

### Viva Q&A
- **Q: What SQL JOINs did you use and why?**
- **A:** INNER JOIN to fetch projects with member/owner data (only returns matching rows). LEFT JOIN for activity logs because the user might be deleted (SET NULL on FK) but we still want the log entry. We have a SQL VIEW (`user_projects_view`) demonstrating a permanent INNER JOIN.
