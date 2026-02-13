// Centralized error handling middleware

export const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation failed',
            details: err.message
        });
    }

    if (err.name === 'NotFoundError') {
        return res.status(404).json({
            error: 'Resource not found',
            details: err.message
        });
    }

    // Default server error
    res.status(500).json({
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred'
    });
};

// Custom error classes
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}
