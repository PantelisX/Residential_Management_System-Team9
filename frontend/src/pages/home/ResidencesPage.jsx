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