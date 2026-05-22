import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import residenceService from '../../services/residenceService';
import maintenanceService from '../../services/maintenanceService';
import userService from '../../services/userService';
import '../../styles/ResidencesPage.css';

function ResidencesPage() {
  const { user } = useAuth();
  const [residences, setResidences] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResidenceId, setSelectedResidenceId] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    start_date: '',
    tech_id: ''
  });

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

  const fetchTechnicians = async () => {
    try {
      const techData = await userService.getTechnicians();
      setTechnicians(techData || []);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };

  useEffect(() => {
    if (user?.user_id) {
      fetchResidences();
      fetchTechnicians();
    }
  }, [user?.user_id]);

  const handleAddResidence = () => {
    console.log('Add Residence button clicked - placeholder');
  };

  const handleNewTask = (residenceId) => {
    setSelectedResidenceId(residenceId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null);
    try {
      await maintenanceService.createTask({
        residence_id: selectedResidenceId,
        category: formData.category,
        description: formData.description,
        start_date: formData.start_date,
        tech_id: formData.tech_id
      });
      
      setIsModalOpen(false);
      setFormData({ category: '', description: '', start_date: '', tech_id: '' });
      
      fetchResidences();
    } catch (err) {
      console.error("Error creating task:", err);
      setError(err.message || "Error creating task.");
    }
  };

  if (loading) {
    return (
      <div className="residences-page">
        <div className="residences-container">
          <div className="loading">Loading residences...</div>
        </div>
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

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>
                Create New Task for{' '}
                {residences.find((r) => r.residence_id === selectedResidenceId)?.address}
              </h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select 
                  id="category" 
                  required 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
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
                <textarea 
                  id="description" 
                  required 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="start_date">Start Date</label>
                <input 
                  id="start_date" 
                  type="date" 
                  required 
                  value={formData.start_date} 
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})} 
                />
              </div>

              <div className="form-group">
                <label htmlFor="technician">Assign Technician</label>
                <select 
                  id="technician" 
                  required 
                  value={formData.tech_id} 
                  onChange={(e) => setFormData({...formData, tech_id: e.target.value})}
                >
                  <option value="">Select Technician</option>
                  {technicians.map(tech => (
                    <option key={tech.user_id} value={tech.user_id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidencesPage;
