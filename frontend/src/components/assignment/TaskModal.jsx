import React, { useState, useEffect } from 'react';
import assignmentApi from '../../services/assignmentApi';
import './TaskModal.css';

function TaskModal({ task, isOpen, onClose, onRefresh }) {
  const [status, setStatus] = useState('open');

  useEffect(() => {
    if (task) {
      setStatus(task.status || 'open');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      await assignmentApi.updateTaskStatus(task.task_id, status);
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Task Details</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <p className="field">
            <strong>Address:</strong> {task.address}
          </p>
          <p className="field">
            <strong>Category:</strong> {task.category}
          </p>
          <p className="field">
            <strong>Description:</strong> {task.description}
          </p>
          <p className="field">
            <strong>Status:</strong>
            <select value={status} onChange={handleStatusChange}>
              <option value="">Select status</option>
              <option value="open">open</option>
              <option value="in_progress">in_progress</option>
              <option value="completed">completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </p>
        </div>
        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>
            Close
          </button>
          <button className="btn-update" onClick={handleUpdateStatus}>
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
}

export default TaskModal;
