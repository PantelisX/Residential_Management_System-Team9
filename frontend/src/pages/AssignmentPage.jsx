import React, { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/AssignmentPage.css';

import PendingAssignments from '../components/assignment/PendingAssignments';
import CurrentTasks from '../components/assignment/CurrentTasks';

function AssignmentsPage() {

  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Refresh assignments data
   */
  const refreshData = async () => {

    try {

      const [pendingRes, acceptedRes] = await Promise.all([
        api.get('/api/assignments/pending'),
        api.get('/api/assignments/accepted')
      ]);

      setPendingAssignments(pendingRes.data || []);
      setAcceptedTasks(acceptedRes.data || []);

      setError(null);

    } catch (err) {

      console.error('Error refreshing assignments:', err);

      setError(
        err.response?.data?.error ||
        'Error fetching assignments'
      );

    } finally {

      setLoading(false);
    }
  };

  /**
   * Fetch assignments on component mount
   */
  useEffect(() => {

    refreshData();

  }, []);

  /**
   * Loading state
   */
  if (loading) {

    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  /**
   * Error state
   */
  if (error) {

    return (
      <div className="error">
        {error}
      </div>
    );
  }

  return (

    <div className="assignment-page">

      <h1 className="page-title">
        Assignment Page
      </h1>

      <div className="sections-container">

        {/* Pending Assignments */}
        <section className="section">

          <h2>
            Pending Assignments
          </h2>

          <PendingAssignments
            assignments={pendingAssignments}
            onRefresh={refreshData}
          />

        </section>

        {/* Current Tasks */}
        <section className="section">

          <h2>
            Current Tasks
          </h2>

          <CurrentTasks
            tasks={acceptedTasks}
            onRefresh={refreshData}
          />

        </section>

      </div>

    </div>
  );
}

export default AssignmentsPage;