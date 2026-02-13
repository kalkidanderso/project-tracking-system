import React, { useState, useEffect } from 'react';
import apiService from '../services/api';
import ProjectCard from './ProjectCard';
import ProjectDetail from './ProjectDetail';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    const [filters, setFilters] = useState({
        status: '',
        search: '',
        sortBy: 'createdAt'
    });

    // Fetch projects whenever filters change
    useEffect(() => {
        fetchProjects();
    }, [filters]);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await apiService.getProjects(filters);
            setProjects(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleProjectUpdate = (updatedProject) => {
        setProjects(prev =>
            prev.map(p => p.id === updatedProject.id ? updatedProject : p)
        );
        setSelectedProject(updatedProject);
    };

    const handleRetry = () => {
        fetchProjects();
    };

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Project Tracking System</h1>
            </header>

            <div className="filters-section">
                <div className="filter-group">
                    <label>Status:</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="on_hold">On Hold</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Search:</label>
                    <input
                        type="text"
                        placeholder="Search by name or client..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label>Sort By:</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                        <option value="createdAt">Created Date</option>
                        <option value="startDate">Start Date</option>
                    </select>
                </div>
            </div>

            <div className="projects-content">
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading projects...</p>
                    </div>
                )}

                {error && (
                    <div className="error-state">
                        <p className="error-message">{error}</p>
                        <button className="retry-button" onClick={handleRetry}>
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && projects.length === 0 && (
                    <div className="empty-state">
                        {filters.status || filters.search ? (
                            <>
                                <p>No projects found matching your filters.</p>
                                <button
                                    className="clear-filters-button"
                                    onClick={() => setFilters({ status: '', search: '', sortBy: 'createdAt' })}
                                >
                                    Clear Filters
                                </button>
                            </>
                        ) : (
                            <p>No projects yet. Create your first project to get started.</p>
                        )}
                    </div>
                )}

                {!loading && !error && projects.length > 0 && (
                    <div className="projects-grid">
                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={handleProjectClick}
                            />
                        ))}
                    </div>
                )}
            </div>

            {selectedProject && (
                <ProjectDetail
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                    onUpdate={handleProjectUpdate}
                />
            )}
        </div>
    );
};

export default Dashboard;
