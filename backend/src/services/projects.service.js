import db from '../config/database.js';
import { NotFoundError, ValidationError } from '../middleware/errorHandler.js';

// Valid status transitions
const STATUS_TRANSITIONS = {
    active: ['on_hold', 'completed'],
    on_hold: ['active', 'completed'],
    completed: []
};

class ProjectsService {
    // Create a new project
    createProject(projectData) {
        const { name, client_name, status, start_date, end_date, priority } = projectData;

        const stmt = db.prepare(`
      INSERT INTO projects (name, client_name, status, start_date, end_date, priority)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const result = stmt.run(
            name.trim(),
            client_name.trim(),
            status,
            start_date,
            end_date || null,
            priority || null
        );

        return this.getProjectById(result.lastInsertRowid);
    }

    // Get all projects with optional filters
    getProjects(filters = {}) {
        const { status, search, sort_by = 'createdAt' } = filters;
        let query = 'SELECT * FROM projects WHERE deleted_at IS NULL';
        const params = [];

        // Apply status filter
        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        // Apply search filter (name or client_name)
        if (search) {
            query += ' AND (name LIKE ? OR client_name LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        // Apply sorting
        const sortColumn = sort_by === 'startDate' ? 'start_date' : 'created_at';
        query += ` ORDER BY ${sortColumn} DESC`;

        const stmt = db.prepare(query);
        const projects = stmt.all(...params);

        return projects.map(this.formatProject);
    }

    // Get a single project by ID
    getProjectById(id) {
        const stmt = db.prepare('SELECT * FROM projects WHERE id = ? AND deleted_at IS NULL');
        const project = stmt.get(id);

        if (!project) {
            throw new NotFoundError(`Project with id ${id} not found`);
        }

        return this.formatProject(project);
    }

    // Update project status with transition validation
    updateProjectStatus(id, newStatus) {
        const project = this.getProjectById(id);
        const currentStatus = project.status;

        // Validate status transition
        const allowedTransitions = STATUS_TRANSITIONS[currentStatus];
        if (!allowedTransitions.includes(newStatus)) {
            throw new ValidationError(
                `Invalid status transition: ${currentStatus} → ${newStatus}. ` +
                `Allowed transitions: ${allowedTransitions.length > 0 ? allowedTransitions.join(', ') : 'none'}`
            );
        }

        const stmt = db.prepare(`
      UPDATE projects
      SET status = ?, updated_at = datetime('now')
      WHERE id = ? AND deleted_at IS NULL
    `);

        stmt.run(newStatus, id);

        return this.getProjectById(id);
    }

    // Soft delete a project
    deleteProject(id) {
        // Verify project exists
        this.getProjectById(id);

        const stmt = db.prepare(`
      UPDATE projects
      SET deleted_at = datetime('now'), updated_at = datetime('now')
      WHERE id = ? AND deleted_at IS NULL
    `);

        stmt.run(id);

        return { message: 'Project deleted successfully' };
    }

    // Format project data for API response
    formatProject(project) {
        return {
            id: project.id,
            name: project.name,
            clientName: project.client_name,
            status: project.status,
            startDate: project.start_date,
            endDate: project.end_date,
            priority: project.priority,
            createdAt: project.created_at,
            updatedAt: project.updated_at
        };
    }
}

export default new ProjectsService();
