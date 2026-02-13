import express from 'express';
import projectsController from '../controllers/projects.controller.js';
import {
    validateCreateProject,
    validateUpdateStatus,
    validateListQuery
} from '../middleware/validation.js';

const router = express.Router();

// Create a new project
router.post('/', validateCreateProject, projectsController.createProject);

// Get all projects with optional filters
router.get('/', validateListQuery, projectsController.getProjects);

// Get a single project by ID
router.get('/:id', projectsController.getProjectById);

// Update project status
router.patch('/:id/status', validateUpdateStatus, projectsController.updateProjectStatus);

// Delete a project
router.delete('/:id', projectsController.deleteProject);

export default router;
