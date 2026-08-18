# Product Requirements Document (PRD)
**Project Name:** AI Project Mentor
**Version:** 1.0 (MVP)
**Date:** August 2026

## 1. Executive Summary
AI Project Mentor is a full-stack web application designed to help software engineering students and junior developers plan, manage, and execute their coding projects. By integrating a virtual AI Mentor powered by Generative AI, the platform assists users in breaking down vague ideas into structured roadmaps, generating actionable subtasks, and providing contextual technical guidance.

## 2. Problem Statement
Students often struggle with the "blank canvas" problem when starting a new software project. They have ideas but lack the architectural experience to break those ideas down into a Minimum Viable Product (MVP), define tech stacks, and sequence their tasks logically. Furthermore, when they get stuck, generic AI chatbots lack context about their specific project's state.

## 3. Target Audience
- **Computer Science Students:** Looking to build portfolio projects.
- **Bootcamp Graduates:** Needing structured workflows for independent learning.
- **Junior Developers:** Seeking architectural guidance and task management.

## 4. Key Features (MVP Scope)

### 4.1 User Management
- Secure user registration and authentication using JWT.
- Password hashing via bcrypt.

### 4.2 Project & Task Management (CRUD)
- Users can create, read, update, and delete multiple software projects.
- Users can create tasks within a project, assign priorities (LOW, MEDIUM, HIGH), and track status (TODO, IN_PROGRESS, COMPLETED).
- Visual dashboard displaying project statistics and overall progress.

### 4.3 AI Project Planner
- Users can input a raw project idea (e.g., "I want to build a food delivery app").
- The system connects to an LLM to generate a structured JSON response containing:
  - Professional Project Title
  - Summary
  - Recommended Tech Stack
  - Sequenced list of MVP tasks with time estimations.
- 1-click conversion from "AI Plan" to an active project in the database.

### 4.4 Contextual AI Mentor
- A chat interface tied to a specific project.
- The AI Mentor is injected with real-time context (project title, progress, task completion rate).
- Users can ask architectural or debugging questions and receive highly contextual, educational answers.

### 4.5 AI Subtask Generator
- Users can click a button to have the AI break down a complex, high-level task into 3-5 actionable subtasks.

## 5. Non-Functional Requirements
- **Performance:** API responses (excluding LLM calls) must resolve in < 200ms.
- **Security:** 
  - Passwords must not be stored in plaintext.
  - Users must only be able to view and modify their own projects (Strict authorization).
  - External API keys (LLM) must remain securely on the backend.
- **Reliability:** The system must gracefully handle AI API rate limits or failures, allowing standard CRUD operations to continue working.

## 6. Future Roadmap (Post-MVP)
- Team collaboration (inviting multiple users to a project).
- GitHub repository integration (syncing commits with tasks).
- Real-time notifications for task updates.
- Exporting AI-generated project plans to PDF.
