import React from 'react';
import assignmentApi from '../../services/assignmentApi';
import './PendingAssignments.css';

function PendingAssignments({ assignments, onRefresh }) {
  const handleAccept = async (assignmentId) => {
    try {
      await assignmentApi.acceptAssignment(assignmentId);
      onRefresh();
    } catch (error) {
      console.error('Error accepting assignment:', error);
    }
  };

  const handleDecline = async (assignmentId) => {
    try {
      await assignmentApi.declineAssignment(assignmentId);
      onRefresh();
    } catch (error) {
      console.error('Error declining assignment:', error);
    }
  };

  return (
    <div className="pending-assignments">
      {assignments.length === 0 ? (
        <p className="no-assignments">No pending assignments</p>
      ) : (
        assignments.map((assignment) => (
          <div key={assignment.task_id} className="assignment-card">
            <div className="assignment-details">
              <p className="assignment-field">
                <strong>Address:</strong> {assignment.residence_address}
              </p>
              <p className="assignment-field">
                <strong>Category:</strong> {assignment.category}
              </p>
              <p className="assignment-field">
                <strong>Description:</strong> {assignment.description}
              </p>
              <p className="assignment-field">
                <strong>Start Date:</strong> {assignment.start_date}
              </p>
            </div>
            <div className="assignment-actions">
              <button
                className="btn-accept"
                onClick={() => handleAccept(assignment.task_id)}
              >
                Accept
              </button>
              <button
                className="btn-decline"
                onClick={() => handleDecline(assignment.task_id)}
              >
                Decline
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PendingAssignments;
