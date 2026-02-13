import React from 'react';

const STATUS_COLORS = {
    active: '#10b981',
    on_hold: '#f59e0b',
    completed: '#6366f1'
};

const PRIORITY_COLORS = {
    low: '#94a3b8',
    medium: '#f59e0b',
    high: '#ef4444'
};

const ProjectCard = ({ project, onClick }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="project-card" onClick={() => onClick(project)}>
            <div className="project-card-header">
                <h3>{project.name}</h3>
                <span
                    className="status-badge"
                    style={{ backgroundColor: STATUS_COLORS[project.status] }}
                >
                    {project.status.replace('_', ' ')}
                </span>
            </div>

            <div className="project-card-body">
                <div className="info-row">
                    <span className="label">Client:</span>
                    <span className="value">{project.clientName}</span>
                </div>

                <div className="info-row">
                    <span className="label">Start Date:</span>
                    <span className="value">{formatDate(project.startDate)}</span>
                </div>

                {project.endDate && (
                    <div className="info-row">
                        <span className="label">End Date:</span>
                        <span className="value">{formatDate(project.endDate)}</span>
                    </div>
                )}

                {project.priority && (
                    <div className="info-row">
                        <span className="label">Priority:</span>
                        <span
                            className="priority-badge"
                            style={{ color: PRIORITY_COLORS[project.priority] }}
                        >
                            {project.priority}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
