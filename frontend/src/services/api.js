const API_BASE_URL = '/projects';

class ApiService {
    // Handle API errors consistently
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: 'Request failed' }));
            throw new Error(error.error || error.details || 'Request failed');
        }
        return response.json();
    }

    // Fetch all projects with optional filters
    async getProjects(filters = {}) {
        const params = new URLSearchParams();

        if (filters.status) params.append('status', filters.status);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sort_by', filters.sortBy);

        const url = `${API_BASE_URL}${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);
        return this.handleResponse(response);
    }

    // Get a single project by ID
    async getProject(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        return this.handleResponse(response);
    }

    // Create a new project
    async createProject(projectData) {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectData)
        });
        return this.handleResponse(response);
    }

    // Update project status
    async updateProjectStatus(id, status) {
        const response = await fetch(`${API_BASE_URL}/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        return this.handleResponse(response);
    }

    // Delete a project
    async deleteProject(id) {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        return this.handleResponse(response);
    }
}

export default new ApiService();
