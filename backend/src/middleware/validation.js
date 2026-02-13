// Validation middleware for project endpoints

const VALID_STATUSES = ['active', 'on_hold', 'completed'];
const VALID_PRIORITIES = ['low', 'medium', 'high'];

// Helper function to check if a string is a valid ISO date
const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && dateString === date.toISOString().split('T')[0];
};

// Validate project creation request
export const validateCreateProject = (req, res, next) => {
    const { name, client_name, status, start_date, end_date, priority } = req.body;
    const errors = [];

    // Check required fields
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('name is required and must be a non-empty string');
    }

    if (!client_name || typeof client_name !== 'string' || client_name.trim().length === 0) {
        errors.push('client_name is required and must be a non-empty string');
    }

    if (!status || !VALID_STATUSES.includes(status)) {
        errors.push(`status is required and must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (!start_date || !isValidDate(start_date)) {
        errors.push('start_date is required and must be a valid date (YYYY-MM-DD)');
    }

    // Check optional fields
    if (end_date) {
        if (!isValidDate(end_date)) {
            errors.push('end_date must be a valid date (YYYY-MM-DD)');
        } else if (start_date && new Date(end_date) < new Date(start_date)) {
            errors.push('end_date must be greater than or equal to start_date');
        }
    }

    if (priority && !VALID_PRIORITIES.includes(priority)) {
        errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    next();
};

// Validate status update request
export const validateUpdateStatus = (req, res, next) => {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
        return res.status(400).json({
            error: 'Validation failed',
            details: [`status is required and must be one of: ${VALID_STATUSES.join(', ')}`]
        });
    }

    next();
};

// Validate query parameters for listing projects
export const validateListQuery = (req, res, next) => {
    const { status, sort_by } = req.query;
    const errors = [];

    if (status && !VALID_STATUSES.includes(status)) {
        errors.push(`status must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (sort_by && !['createdAt', 'startDate'].includes(sort_by)) {
        errors.push('sort_by must be either createdAt or startDate');
    }

    if (errors.length > 0) {
        return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    next();
};
