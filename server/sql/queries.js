/**
 * CONCEPTS USED:
 * - Relational SQL Queries & Parameterization
 * - SQL INNER JOIN, LEFT JOIN, and Aggregations
 * - SQL Injection Protection (Parameterized Queries)
 * - Multi-table Relationship Querying
 *
 * PURPOSE:
 * Contains production SQL queries demonstrating relational relationships and SQL JOINs.
 *
 * RESPONSIBILITY:
 * Executes user management, membership checks, relational project queries,
 * and audit activity log recording via PostgreSQL.
 */

const { query } = require('../config/postgres');

/**
 * 1. Find User By Email (Primary lookup for Authentication)
 */
const findUserByEmail = async (email) => {
  const sql = `
    SELECT id, name, email, password_hash, role, created_at
    FROM users
    WHERE email = $1;
  `;
  const result = await query(sql, [email.toLowerCase().trim()]);
  return result.rows[0] || null;
};

/**
 * 2. Find User By ID
 */
const findUserById = async (userId) => {
  const sql = `
    SELECT id, name, email, role, created_at
    FROM users
    WHERE id = $1;
  `;
  const result = await query(sql, [userId]);
  return result.rows[0] || null;
};

/**
 * 3. Create New User
 */
const createUser = async (name, email, passwordHash, role = 'STUDENT') => {
  const sql = `
    INSERT INTO users (name, email, password_hash, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at;
  `;
  const result = await query(sql, [name.trim(), email.toLowerCase().trim(), passwordHash, role]);
  return result.rows[0];
};

/**
 * 4. DEMONSTRATION OF SQL JOIN 1:
 * Query: User -> Project Membership -> Project (3-table JOIN)
 * Fetches all projects a user belongs to along with their role in that project and owner details.
 */
const getUserProjectsWithMembership = async (userId) => {
  const sql = `
    SELECT 
      p.id AS project_id,
      p.project_uuid,
      p.title AS project_title,
      pm.role AS member_role,
      pm.joined_at,
      u_owner.name AS owner_name,
      u_owner.email AS owner_email
    FROM project_members pm
    INNER JOIN projects p ON pm.project_id = p.id
    INNER JOIN users u_owner ON p.owner_id = u_owner.id
    WHERE pm.user_id = $1
    ORDER BY pm.joined_at DESC;
  `;
  const result = await query(sql, [userId]);
  return result.rows;
};

/**
 * 5. DEMONSTRATION OF SQL JOIN 2:
 * Query: Project Members with User Details (2-table JOIN)
 * Retrieves all team members for a specific project.
 */
const getProjectMembers = async (projectId) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.name,
      u.email,
      pm.role,
      pm.joined_at
    FROM project_members pm
    INNER JOIN users u ON pm.user_id = u.id
    WHERE pm.project_id = $1
    ORDER BY pm.joined_at ASC;
  `;
  const result = await query(sql, [projectId]);
  return result.rows;
};

/**
 * 6. DEMONSTRATION OF SQL JOIN 3:
 * Query: Activity Logs with User Profile (LEFT JOIN)
 * Fetches audit logs showing user actions with their name and email.
 */
const getActivityLogsByProject = async (projectId, limit = 20) => {
  const sql = `
    SELECT 
      al.id,
      al.action,
      al.entity_type,
      al.metadata,
      al.created_at,
      u.name AS user_name,
      u.email AS user_email
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.project_id = $1
    ORDER BY al.created_at DESC
    LIMIT $2;
  `;
  const result = await query(sql, [projectId, limit]);
  return result.rows;
};

/**
 * 7. Record Activity Log
 */
const logActivity = async (userId, projectId, action, entityType, metadata = {}) => {
  const sql = `
    INSERT INTO activity_logs (user_id, project_id, action, entity_type, metadata)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, created_at;
  `;
  try {
    const result = await query(sql, [userId, projectId, action, entityType, JSON.stringify(metadata)]);
    return result.rows[0];
  } catch (error) {
    console.error('Failed to write activity log:', error.message);
    return null;
  }
};

module.exports = {
  findUserByEmail,
  findUserById,
  createUser,
  getUserProjectsWithMembership,
  getProjectMembers,
  getActivityLogsByProject,
  logActivity
};
