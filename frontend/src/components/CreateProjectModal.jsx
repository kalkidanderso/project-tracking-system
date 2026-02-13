import React from 'react';
import apiService from '../services/api';

const VALID_STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' }
];

const VALID_PRIORITIES = [
    { value: '', label: 'None' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
];

const todayIsoDate = () => new Date().toISOString().slice(0, 10);

const CreateProjectModal = ({ onClose, onCreated }) => {
    const [form, setForm] = React.useState({
        name: '',
        clientName: '',
        status: 'active',
        startDate: todayIsoDate(),
        endDate: '',
        priority: ''
    });

    const [submitting, setSubmitting] = React.useState(false);
    const [error, setError] = React.useState(null);

    const onChange = (key) => (e) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                name: form.name,
                client_name: form.clientName,
                status: form.status,
                start_date: form.startDate,
                end_date: form.endDate ? form.endDate : undefined,
                priority: form.priority ? form.priority : undefined
            };

            const created = await apiService.createProject(payload);
            onCreated(created);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>New Project</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    {error && <div className="error-message">{error}</div>}

                    <form className="form" onSubmit={onSubmit}>
                        <div className="form-grid">
                            <div className="form-field">
                                <label>Name</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={onChange('name')}
                                    placeholder="e.g. Website Redesign"
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Client Name</label>
                                <input
                                    type="text"
                                    value={form.clientName}
                                    onChange={onChange('clientName')}
                                    placeholder="e.g. Acme Corp"
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>Status</label>
                                <select value={form.status} onChange={onChange('status')}>
                                    {VALID_STATUSES.map((s) => (
                                        <option key={s.value} value={s.value}>{s.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Priority</label>
                                <select value={form.priority} onChange={onChange('priority')}>
                                    {VALID_PRIORITIES.map((p) => (
                                        <option key={p.value} value={p.value}>{p.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-field">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    value={form.startDate}
                                    onChange={onChange('startDate')}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label>End Date (optional)</label>
                                <input
                                    type="date"
                                    value={form.endDate}
                                    onChange={onChange('endDate')}
                                />
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="button" className="secondary-button" onClick={onClose} disabled={submitting}>
                                Cancel
                            </button>
                            <button type="submit" className="primary-button" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
