import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import residenceService from '../../services/residenceService';
import maintenanceService from '../../services/maintenanceService';
import userService from '../../services/userService';
import '../../styles/ResidencesPage.css';

function ResidencesPage() {
  const { user } = useAuth();

  console.log(user);

  const [residences, setResidences] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResidenceId, setSelectedResidenceId] = useState(null);

  const [formData, setFormData] = useState({
    address: '',
    description: '',
    user_role: 'tenant'
  });

  const [taskFormData, setTaskFormData] = useState({
    category: '',
    description: '',
    start_date: '',
    tech_id: ''
  });

  const [isAddResidenceModalOpen, setIsAddResidenceModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const fetchResidences = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await residenceService.getUserResidences();

      console.log(data);

      setResidences(data.residences || []);
    } catch (err) {
      console.error('Error fetching residences:', err);
      setError(err.message || 'Failed to load residences');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const techData = await userService.getTechnicians();
      console.log('All technicians from API:', techData);
      console.log('Current user:', user);
      console.log('Current user ID:', user?.user_id);
      const filteredTechs = techData.filter(tech => String(tech.user_id) !== String(user?.user_id));
      console.log('After filtering:', filteredTechs);
      setTechnicians(filteredTechs || []);
    } catch (err) {
      console.error('Error fetching technicians:', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchResidences();
    fetchTechnicians();
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddResidence = () => {
    setIsAddResidenceModalOpen(true);
    setFormData({
      address: '',
      description: '',
      user_role: 'tenant'
    });
  };

  const handleNewTask = (residenceId) => {
    setSelectedResidenceId(residenceId);
    setIsTaskModalOpen(true);
    setTaskFormData({
      category: '',
      description: '',
      start_date: '',
      tech_id: ''
    });
  };

  const handleCreateResidence = async (e) => {
    e.preventDefault();

    try {
      await residenceService.createResidence({
        address: formData.address,
        description: formData.description,
        user_role: formData.user_role
      });

      setIsAddResidenceModalOpen(false);
      setFormData({
        address: '',
        description: '',
        user_role: 'tenant'
      });

      fetchResidences();
    } catch (err) {
      console.error('Error creating residence:', err);
      setError(err.message || 'Failed to create residence');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await maintenanceService.createTask({
        residence_id: selectedResidenceId,
        category: taskFormData.category,
        description: taskFormData.description,
        start_date: taskFormData.start_date,
        tech_id: taskFormData.tech_id
      });

      setIsTaskModalOpen(false);
      setTaskFormData({
        category: '',
        description: '',
        start_date: '',
        tech_id: ''
      });

      fetchResidences();
    } catch (err) {
      console.error('Error creating task:', err);
      setError(err.message || 'Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="residences-page">
        <div className="residences-container">
          <div className="loading">
            Loading residences...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="residences-page">
      <div className="residences-container">

        <div className="residences-header">
          <h1>My Residences</h1>

          <button
            className="btn btn-primary add-residence-btn"
            onClick={handleAddResidence}
          >
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
              <div
                key={residence.residence_id}
                className="residence-card"
              >
                <div className="residence-content">

                  <h2 className="residence-address">
                    {residence.address}
                  </h2>

                  {residence.description && (
                    <p className="residence-description">
                      {residence.description}
                    </p>
                  )}

                  {residence.user_role && (
                    <p className="residence-role">
                      Role: {residence.user_role}
                    </p>
                  )}

                  <div className="residence-meta">
                    <span className="task-count">
                      📋 {residence.active_task_count} Active Task
                      {residence.active_task_count !== 1 ? 's' : ''}
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

      {isAddResidenceModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Add New Residence</h3>
              <button
                className="close-btn"
                onClick={() => setIsAddResidenceModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateResidence}>
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      address: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="user_role">Your Role</label>
                <select
                  id="user_role"
                  required
                  value={formData.user_role}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      user_role: e.target.value
                    })
                  }
                >
                  <option value="tenant">Tenant</option>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsAddResidenceModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Residence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Create New Task for{' '}
                {
                  residences.find(
                    (r) => r.residence_id === selectedResidenceId
                  )?.address
                }
              </h3>
              <button
                className="close-btn"
                onClick={() => setIsTaskModalOpen(false)}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  required
                  value={taskFormData.category}
                  onChange={(e) =>
                    setTaskFormData({
                      ...taskFormData,
                      category: e.target.value
                    })
                  }
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
                  value={taskFormData.description}
                  onChange={(e) =>
                    setTaskFormData({
                      ...taskFormData,
                      description: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="start_date">Start Date</label>
                <input
                  id="start_date"
                  type="date"
                  required
                  value={taskFormData.start_date}
                  onChange={(e) =>
                    setTaskFormData({
                      ...taskFormData,
                      start_date: e.target.value
                    })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="technician">Assign Technician</label>
                <select
                  id="technician"
                  required
                  value={taskFormData.tech_id}
                  onChange={(e) =>
                    setTaskFormData({
                      ...taskFormData,
                      tech_id: e.target.value
                    })
                  }
                >
                  <option value="">Select Technician</option>
                  {technicians.map((tech) => (
                    <option key={tech.user_id} value={tech.user_id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsTaskModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResidencesPage;