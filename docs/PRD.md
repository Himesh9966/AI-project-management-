# Product Requirements Document (PRD)

## 1. Introduction
### 1.1 Purpose
The **AI Project Mentor** is an intelligent, full-stack project management and planning tool designed to assist developers and teams in scaffolding, managing, and tracking software projects. By leveraging advanced AI, the platform acts as a digital mentor that understands codebase context, plans architecture, and tracks progress.

### 1.2 Target Audience
- **Software Engineers & Developers:** Individuals looking for structured guidance and automated architectural planning.
- **Project Managers:** Professionals needing oversight on project progress, task allocation, and risk management.
- **Development Teams:** Groups requiring a collaborative workspace with built-in AI insights.

---

## 2. Product Vision
To reduce the overwhelming nature of complex software projects by providing an AI companion that sees the workspace, understands the context, and proactively builds and manages technical plans.

---

## 3. Key Features
### 3.1 User Authentication & Authorization
- Secure JWT-based authentication.
- Role-based access control (e.g., Admin, Developer, Viewer).
- Secure password hashing using bcrypt.

### 3.2 AI-Powered Planning (AI Mentor)
- Integration with LLMs (e.g., OpenAI) to generate project structures, timelines, and technical requirements based on simple user prompts.
- Context-aware chat interface for on-the-fly architectural decisions.

### 3.3 Project Workspace & Tracking
- Dashboard overview of total, active, and completed projects.
- Task tracking with statuses (`IN_PROGRESS`, `COMPLETED`, `BACKLOG`).
- Activity logging to maintain a history of actions taken by users and the AI.

### 3.4 Collaborative Workspaces
- Project sharing among team members.
- Real-time updates and notification cards (Context Cards).

---

## 4. User Personas
### 4.1 "Alex" - The Solo Developer
- **Goal:** Build an MVP quickly without getting bogged down in architectural paralysis.
- **Needs:** Automated project scaffolding, clear task lists, and an AI sounding board for technical decisions.

### 4.2 "Sarah" - The Tech Lead
- **Goal:** Ensure the team follows best practices and stays on schedule.
- **Needs:** High-level project overviews, activity logs, and the ability to review AI-generated architectural plans before team implementation.

---

## 5. Non-Functional Requirements
### 5.1 UI/UX Design
- **Theme:** "Metallic" aesthetic. Dark, sleek, glassmorphic interfaces with muted colors (grays, silvers) and strictly no bright colors on primary interaction elements.
- **Animations:** Highly dynamic, smooth scrolling experiences utilizing Framer Motion for staggered reveals and floating elements.
- **Responsiveness:** Fully mobile and desktop optimized via Tailwind CSS.

### 5.2 Performance & Scalability
- **Client:** React Single Page Application (SPA) utilizing code-splitting (lazy loading) for fast initial load times.
- **Server:** Node.js/Express handling asynchronous AI requests efficiently.
- **Database:** PostgreSQL for structured relational data ensuring ACID compliance.

### 5.3 Security
- Input validation on all API endpoints.
- Rate limiting on AI generation endpoints to prevent abuse.
- Environment variable protection for API keys and DB URIs.
