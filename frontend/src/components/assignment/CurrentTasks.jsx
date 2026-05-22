import React from 'react';
import TaskModal from './TaskModal';
import './CurrentTasks.css';

function CurrentTasks({ tasks, onRefresh }) {
  const [selectedTask, setSelectedTask] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  return (
    <div className="current-tasks">
      {tasks.length === 0 ? (
        <p className="no-tasks">No current tasks</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.task_id}
            className="task-card"
            onClick={() => handleTaskClick(task)}
          >
            <div className="task-details">
              <p className="task-field">
                <strong>Address:</strong> {task.address}
              </p>
              <p className="task-field">
                <strong>Category:</strong> {task.category}
              </p>
              <p className="task-field">
                <strong>Description:</strong> {task.description}
              </p>
              <p className="task-field">
                <strong>Status:</strong> {task.status}
              </p>
            </div>
          </div>
        ))
      )}
      <TaskModal
        task={selectedTask}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onRefresh={onRefresh}
      />
    </div>
  );
}

export default CurrentTasks;
