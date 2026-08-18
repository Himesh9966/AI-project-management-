# AI Project Mentor

A production-quality MERN stack application with PostgreSQL and Generative AI integration, designed to help students plan, manage, and complete software engineering projects.

## Project Overview
AI Project Mentor is a full-stack Minimum Viable Product (MVP) that provides intelligent project planning, task breakdown, and technical mentorship. It leverages a dual-database architecture (MongoDB for agile document storage and PostgreSQL for strict relational schemas) and integrates with Google Generative AI to act as a virtual software architect.

## Project Documentation
- [Product Requirements Document (PRD)](./PRD.md)
- [High-Level Design (HLD)](./HLD.md)
- [Low-Level Design (LLD)](./LLD.md)

---

## Architecture & Tech Stack

**Frontend**:
- React 19 (Vite)
- React Router DOM
- Custom Hooks (`useAuth`, `useProjects`, `useTasks`)
- Context API (`AuthContext`)
- CSS Modules & Variables

**Backend**:
- Node.js & Express.js
- JWT Authentication (`jsonwebtoken`) & Password Hashing (`bcryptjs`)
- Google Generative AI SDK (`@google/generative-ai`)

**Databases**:
- **MongoDB** (Mongoose): Stores flexible project data, tasks, nested subtasks, AI plans, and chat contexts.
- **PostgreSQL** (`pg`): Manages relational user identities, project memberships, and audit trails.

---

## Installation & Running Locally

### 1. Prerequisites
Ensure you have installed:
- Node.js (v18+)
- MongoDB (Running locally on default port `27017`)
- PostgreSQL (Running locally on default port `5432`)

### 2. Environment Variables
Duplicate the template file and fill in your secrets (especially `LLM_API_KEY`):
```bash
cp .env.example .env
```

### 3. Installation
Install root, backend, and frontend dependencies in one command:
```bash
npm run install:all
```

### 4. Running the Application
Start both the Express backend and React frontend concurrently:
```bash
npm run dev
```
- **Frontend URL**: [http://localhost:5173](http://localhost:5173)
- **Backend URL**: [http://localhost:5001](http://localhost:5001)

---

## Viva Concept Mapping

This table maps the grading rubric directly to the codebase implementation for quick reference during evaluation.

| Concept | Where Used | File | Explanation |
|---|---|---|---|
| **HTTP status codes used correctly (0.2 pts • Backend & System Design)** | Controllers & Middleware | `server/utils/responseHelper.js` | Proper usage of HTTP status codes (200, 201, 400, 401, 403, 404, 409, 500) across all endpoints. |
| **JavaScript — Event loop (0.1 pts • Frontend)** | JS Concepts Utility | `client/src/utils/jsConcepts.js` | Uses `setTimeout` to push non-blocking callbacks to the macro-task queue. |
| **JavaScript — Promises vs callbacks (0.1 pts • Frontend)** | JS Concepts Utility | `client/src/utils/jsConcepts.js` | Demonstrates fetching data via legacy callbacks versus modern Promises. |
| **JavaScript — async/await (0.1 pts • Frontend)** | JS Concepts Utility | `client/src/utils/jsConcepts.js` | Uses syntactic sugar over Promises to handle asynchronous operations cleanly. |
| **JavaScript — Closures (0.1 pts • Frontend)** | JS Concepts Utility | `client/src/utils/jsConcepts.js` | An inner `increment` function capturing the `count` variable from its lexical scope. |
| **JavaScript — Hoisting (0.1 pts • Frontend)** | JS Concepts Utility | `client/src/utils/jsConcepts.js` | Calling a function declaration before it appears in the code, proving it's hoisted. |
| **SQL JOINs (0.2 pts • SQL (Postgres))** | PostgreSQL Schema | `server/sql/schema.sql` | `user_projects_view` utilizes an `INNER JOIN` to fetch project owner details. |
| **Normalization basics (0.2 pts • SQL (Postgres))** | PostgreSQL Schema | `server/sql/schema.sql` | Schema is designed up to 3NF, removing transitive dependencies and ensuring atomic values. |
| **ORM usage (Prisma/Sequelize) (0.2 pts • SQL (Postgres))** | Database Configuration | `server/prisma/schema.prisma` | Full Prisma schema implementation mapping to the PostgreSQL database for ORM-based access. |
| **Aggregation pipelines (0.2 pts • NoSQL (Mongo))** | Mongoose Models | `server/models/AIConversation.js` | Uses `$match`, `$unwind`, and `$group` pipeline stages for deriving conversation statistics. |
| **File upload handling** | Upload Routes | `server/routes/uploadRoutes.js` | Uses `multer` middleware to parse `multipart/form-data` and handle file uploads safely. |
| **Form validation (0.2 pts • Frontend)** | React Pages | `client/src/pages/Register.jsx` | Explicit React state-based validation before form submission (e.g., password length, email format). |
| **Git workflow (0.3 pts • Engineering Practices)** | CI/CD Workflows | `.github/workflows/main.yml` | Fully configured GitHub Actions pipeline running dependency installs and test suites on pushes/PRs to main. |
| **Frontend deployment (0.2 pts • Frontend)** | Vercel Configuration | `vercel.json` | Ready for Vercel deployment with correct build commands and routing rules for Single Page Applications. |
| **Environment variables & secrets management (0.2 pts • Engineering Practices)** | Global configuration | `.env.example` | Secrets (e.g. `LLM_API_KEY`) are managed strictly through environment variables. |
| **Responsive layout & styling competence (0.2 pts • Frontend)** | CSS System | `client/src/index.css` | Employs CSS Variables, Flexbox, and CSS Grid ensuring the UI adapts gracefully to varying screen sizes. |
| **Request body validation (0.2 pts • Backend & System Design)** | Validation Middleware | `server/middleware/validationMiddleware.js` | Server explicitly rejects malformed request bodies before they reach the controller layer. |
| **LLM API Integration** | AI Controllers & Services | `server/services/aiService.js` | Direct integration with `@google/generative-ai` securely isolated in backend. |
| **Prompt Engineering** | Prompt Modules | `server/prompts/` | System roles, context snapshotting, and strict JSON structural requirements. |
| **Structured Outputs** | AI Planner / Subtasks | `server/prompts/projectPlannerPrompt.js` | LLM is instructed to bypass markdown and return raw, parseable JSON payloads. |
| **RESTful Endpoints** | All Routers | `server/routes/*.js` | Adheres to strict REST conventions (GET, POST, PATCH, DELETE) on resources. |
| **Middleware** | Auth, Errors, Logging, Validation | `server/middleware/*.js` | Intercepts HTTP lifecycle for auth (`req.user`), payload validation, and errors. |
| **Environment Variables** | Global | `.env` / `.gitignore` | `PORT`, `JWT_SECRET`, `MONGO_URI`, `LLM_API_KEY` kept secure and untracked. |
| **React Component Composition**| UI Components | `client/src/pages/ProjectDetails.jsx` | Breaks down complex UI into nested mapping loops (Task rendering). |
| **Hooks (useState/useEffect)** | Frontend State | `client/src/hooks/useProjects.js` | Manages async data lifecycles, network loading states, and error states. |
| **MongoDB CRUD** | Project & Task Services | `server/services/projectService.js` | Mongoose operations (`find`, `save`, `findByIdAndUpdate`, `findOneAndDelete`). |
| **MongoDB Schema** | Mongoose Models | `server/models/*.js` | Validation rules, enums, required fields, embedded subdocuments, timestamps. |
| **PostgreSQL Schema** | SQL DDL | `server/sql/schema.sql` | Primary Keys (`SERIAL`), Foreign Keys (`ON DELETE CASCADE`), Unique constraints. |
| **SQL JOINs** | SQL Queries | `server/sql/queries.js` | 3-table `INNER JOIN` (Projects/Members/Users) and `LEFT JOIN` (Logs/Users). |
| **JavaScript Async/Await** | Global | `server/controllers/*.js` | Avoids callback hell; wraps async I/O in `try/catch` for robust error handling. |
| **JavaScript Closures** | Validation Middleware | `server/middleware/validationMiddleware.js` | Inner middleware function retains access to `validationFn` injected from outer scope. |

*(Detailed JavaScript concept explanations are found in `server/docs/javascript-concepts.md`)*

---

## Git Workflow
This project was developed strictly using feature branching:
1. `feature/database-setup` -> `main`
2. `feature/authentication` -> `main`
3. `feature/project-crud` -> `main`
4. Consolidated AI and Frontend integration commits directly to `main` for deployment readiness.
