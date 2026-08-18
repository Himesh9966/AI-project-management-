-- ==============================================================================
-- AI PROJECT MENTOR - RELATIONAL POSTGRESQL SCHEMA
-- 
-- CONCEPTS DEMONSTRATED:
-- 1. Relational Schema Design & 3NF Normalization
-- 2. Primary Keys (SERIAL PRIMARY KEY)
-- 3. Foreign Keys with Referential Integrity (REFERENCES ... ON DELETE CASCADE/SET NULL)
-- 4. Unique Constraints (UNIQUE email, UNIQUE(project_id, user_id))
-- 5. Structured Data Types & JSONB Storage
-- 6. B-Tree Performance Indexes
-- ==============================================================================

-- Drop tables in reverse order of foreign key dependencies if re-running
DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
-- Stores authenticated student and mentor profiles
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'STUDENT', -- 'STUDENT', 'MENTOR', 'ADMIN'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROJECTS REGISTRY TABLE
-- Relational mapping of projects with owner foreign key
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    project_uuid VARCHAR(64) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    owner_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. PROJECT MEMBERS TABLE (Many-to-Many Join Table with Attributes)
-- Models team collaborations, memberships, and role assignments
CREATE TABLE project_members (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER', -- 'OWNER', 'COLLABORATOR', 'MENTOR'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_members_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT unique_project_user UNIQUE (project_id, user_id)
);

-- 4. ACTIVITY LOGS TABLE
-- Comprehensive audit trail demonstrating 1-to-many relationship with users and projects
CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    project_id INTEGER,
    action VARCHAR(100) NOT NULL, -- 'CREATED_PROJECT', 'GENERATED_AI_PLAN', 'COMPLETED_TASK'
    entity_type VARCHAR(50) NOT NULL, -- 'PROJECT', 'TASK', 'AI', 'AUTH'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_logs_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_owner ON projects(owner_id);
CREATE INDEX idx_members_project_id ON project_members(project_id);
CREATE INDEX idx_members_user_id ON project_members(user_id);
CREATE INDEX idx_logs_project_id ON activity_logs(project_id);
CREATE INDEX idx_logs_created_at ON activity_logs(created_at DESC);

-- ==============================================================================
-- 5. Normalization basics & ORM usage (Prisma/Sequelize)
-- ==============================================================================
-- The schema above adheres to 3NF (Third Normal Form):
-- 1NF: All columns hold atomic values (no repeating groups).
-- 2NF: No partial dependency; all non-key attributes are fully functionally dependent on the primary key.
-- 3NF: No transitive dependency; non-key attributes depend strictly on the primary key, avoiding anomalies.
--
-- Note on ORM usage (Prisma/Sequelize):
-- While this project utilizes raw pg queries for performance, this relational schema
-- is fully compatible with modern ORMs like Prisma or Sequelize. A corresponding Prisma
-- schema is provided in `server/prisma/schema.prisma` for integration.

-- ==============================================================================
-- 6. SQL JOINs Demonstration
-- ==============================================================================
-- This view demonstrates an INNER JOIN between users and projects, 
-- simplifying the retrieval of project owners and their respective projects.
CREATE OR REPLACE VIEW user_projects_view AS 
SELECT 
    u.id AS user_id, 
    u.name AS owner_name, 
    u.email AS owner_email,
    p.id AS project_id, 
    p.title AS project_title
FROM users u
INNER JOIN projects p ON u.id = p.owner_id;
