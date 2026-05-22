import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AssignmentPage.css';
import PendingAssignments from '../components/assignment/PendingAssignments';
import CurrentTasks from '../components/assignment/CurrentTasks';

//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_URL = 'http://localhost:5000/api';
/*
function AssignmentPage() {
  return (
    <div>
      <h1>Assignment Page Works</h1>
    </div>
  );
}

export default AssignmentPage;
*/

function AssignmentPage() {
  const [pendingAssignments, setPendingAssignments] = useState([]);
  const [acceptedTasks, setAcceptedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshData = async () => {
    try {
      const [pendingRes, acceptedRes] = await Promise.all([
        axios.get(`${API_URL}/assignments/pending`),
        axios.get(`${API_URL}/assignments/accepted`)
      ]);
      setPendingAssignments(pendingRes.data);
      setAcceptedTasks(acceptedRes.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Error fetching data');
      console.error('Error refreshing assignments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pendingRes, acceptedRes] = await Promise.all([
          axios.get(`${API_URL}/assignments/pending`),
          axios.get(`${API_URL}/assignments/accepted`)
        ]);
        setPendingAssignments(pendingRes.data);
        setAcceptedTasks(acceptedRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching data');
        console.error('Error fetching assignments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="assignment-page">
      <h1 className="page-title">Assignment Page</h1>
      <div className="sections-container">
        <section className="section">
          <h2>Pending Assignments</h2>
          <PendingAssignments assignments={pendingAssignments} onRefresh={refreshData} />
        </section>
        <section className="section">
          <h2>Current Tasks</h2>
          <CurrentTasks tasks={acceptedTasks} onRefresh={refreshData} />
        </section>
      </div>
    </div>
  );
}

export default AssignmentPage;
