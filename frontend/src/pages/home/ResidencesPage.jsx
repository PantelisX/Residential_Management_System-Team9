import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import residenceService from '../../services/residenceService';
import '../../styles/ResidencesPage.css';

function ResidencesPage() {
  const { user } = useAuth();
  const [residences, setResidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResidences = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await residenceService.getUserResidences();
        setResidences(data.residences || []);
      } catch (err) {
        setError(err.message || 'Failed to load residences');
        console.error('Error fetching residences:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.user_id) {
      fetchResidences();
    }
  }, [user?.user_id]);

  const handleAddResidence = () => {
    console.log('Add Residence button clicked - placeholder');
    // Placeholder for future functionality
  };

  const handleNewTask = (residenceId) => {
    console.log(`New Task button clicked for residence ${residenceId} - placeholder`);
    // Placeholder for future functionality
  };

  if (loading) {
    return (
      <div className="residences-page">
        <div className="residences-container">
          <div className="loading">Loading residences...</div>
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Create New Task for {residences.find(r => r.residence_id === selectedResidenceId)?.address}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                    <option value="">Select category</option>
                    <option value="electrical">Electrical</option>
                    <option value="plumbing">Plumbing</option>
                    <option value="hvac">HVAC</option>
                    <option value="landscaping">Landscaping</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label htmlFor="start_date">Start Date</label>
                  <input id="start_date" type="date" value={formData.start_date} onChange={(e) => setFormData({...formData, start_date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label htmlFor="technician">Technician</label>
                  <select id="technician" value={formData.technician_id} onChange={(e) => setFormData({...formData, technician_id: e.target.value})}>
                    {technicians.map(tech => (
                      <option key={tech.user_id} value={tech.user_id}>{tech.name}</option>
                    ))}
                  </select>
                </div>
                <div className="modal-footer">
                  <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Task</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="residences-page">
      <div className="residences-container">
        <div className="residences-header">
          <h1>My Residences</h1>
          <button className="btn btn-primary add-residence-btn" onClick={handleAddResidence}>
            Add Residence
          </button>
        </div>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {residences.length === 0 ? (
          <div className="empty-state">
            <p>No residences found. Add one to get started!</p>
          </div>
        ) : (
          <div className="residences-list">
            {residences.map((residence) => (
              <div key={residence.residence_id} className="residence-card">
                <div className="residence-content">
                  <h2 className="residence-address">{residence.address}</h2>
                  {residence.description && (
                    <p className="residence-description">{residence.description}</p>
                  )}
                  <div className="residence-meta">
                    <span className="task-count">
                      📋 {residence.active_task_count} Active Task{residence.active_task_count !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <button
                  className="btn btn-secondary new-task-btn"
                  onClick={() => handleNewTask(residence.residence_id)}
                >
                  New Task
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResidencesPage;