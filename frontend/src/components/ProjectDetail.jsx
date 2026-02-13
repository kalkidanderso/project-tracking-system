import React from 'react';
import apiService from '../services/api';

const STATUS_TRANSITIONS = {
    active: ['on_hold', 'completed'],
    on_hold: ['active', 'completed'],
    completed: []
};

const ProjectDetail = ({ project, onClose, onUpdate }) => {
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [error, setError] = React.useState(null);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleStatusUpdate = async (newStatus) => {
        setIsUpdating(true);
        setError(null);

        try {
            const updatedProject = await apiService.updateProjectStatus(project.id, newStatus);
            onUpdate(updatedProject);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    const allowedTransitions = STATUS_TRANSITIONS[project.status] || [];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{project.name}</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    <div className="detail-section">
                        <h3>Project Information</h3>

                        <div className="detail-row">
                            <span className="detail-label">Client Name:</span>
                            <span className="detail-value">{project.clientName}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Status:</span>
                            <span className="detail-value status-text">{project.status.replace('_', ' ')}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Start Date:</span>
                            <span className="detail-value">{formatDate(project.startDate)}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">End Date:</span>
                            <span className="detail-value">{formatDate(project.endDate)}</span>
                        </div>

                        {project.priority && (
                            <div className="detail-row">
                                <span className="detail-label">Priority:</span>
                                <span className="detail-value">{project.priority}</span>
                            </div>
                        )}

                        <div className="detail-row">
                            <span className="detail-label">Created:</span>
                            <span className="detail-value">{formatDate(project.createdAt)}</span>
                        </div>

                        <div className="detail-row">
                            <span className="detail-label">Last Updated:</span>
                            <span className="detail-value">{formatDate(project.updatedAt)}</span>
                        </div>
                    </div>

                    {allowedTransitions.length > 0 && (
                        <div className="detail-section">
                            <h3>Update Status</h3>

                            {error && <div className="error-message">{error}</div>}

                            <div className="status-buttons">
                                {allowedTransitions.map((status) => (
                                    <button
                                        key={status}
                                        className="status-button"
                                        onClick={() => handleStatusUpdate(status)}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? 'Updating...' : `Mark as ${status.replace('_', ' ')}`}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {allowedTransitions.length === 0 && (
                        <div className="info-message">
                            This project is completed and cannot be modified.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail;
