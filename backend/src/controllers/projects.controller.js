import projectsService from '../services/projects.service.js';

class ProjectsController {
    // Create a new project
    async createProject(req, res, next) {
        try {
            const project = projectsService.createProject(req.body);
            res.status(201).json(project);
        } catch (error) {
            next(error);
        }
    }

    // Get all projects with optional filters
    async getProjects(req, res, next) {
        try {
            const filters = {
                status: req.query.status,
                search: req.query.search,
                sort_by: req.query.sort_by
            };

            const projects = projectsService.getProjects(filters);
            res.json(projects);
        } catch (error) {
            next(error);
        }
    }

    // Get a single project by ID
    async getProjectById(req, res, next) {
        try {
            const project = projectsService.getProjectById(req.params.id);
            res.json(project);
        } catch (error) {
            next(error);
        }
    }

    // Update project status
    async updateProjectStatus(req, res, next) {
        try {
            const project = projectsService.updateProjectStatus(req.params.id, req.body.status);
            res.json(project);
        } catch (error) {
            next(error);
        }
    }

    // Delete a project (soft delete)
    async deleteProject(req, res, next) {
        try {
            const result = projectsService.deleteProject(req.params.id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

export default new ProjectsController();
