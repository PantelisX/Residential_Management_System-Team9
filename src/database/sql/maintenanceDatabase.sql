CREATE DATABASE maintenance_system;
USE maintenance_system;


CREATE TABLE Residence 
(
    residence_id INT AUTO_INCREMENT PRIMARY KEY, 
    address VARCHAR(255) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    is_technician BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE MaintenanceTask (
    task_id INT AUTO_INCREMENT PRIMARY KEY,

    residence_id INT NOT NULL,

    status ENUM('open','in_progress','completed','cancelled') NOT NULL DEFAULT 'open',

    accepted BOOLEAN NOT NULL DEFAULT FALSE,

    tech_id INT,

    category ENUM('electrical','plumbing','hvac','landscaping','other') NOT NULL,

    description TEXT,start_date DATE,end_date DATE,

    FOREIGN KEY (residence_id)
        REFERENCES Residence(residence_id),

    FOREIGN KEY (tech_id)
        REFERENCES users(user_id)
);


CREATE TABLE TaskHistory (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    category ENUM('electrical', 'plumbing', 'hvac', 'landscaping', 'other') NOT NULL,
    description TEXT,
    completion_date DATE,
    FOREIGN KEY (task_id) REFERENCES MaintenanceTask(task_id)
);

CREATE TABLE UserResidence 
(
    user_id INT,
    residence_id INT,
    user_role ENUM('tenant', 'owner', 'manager') NOT NULL,

    PRIMARY KEY (user_id, residence_id),

    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,

    FOREIGN KEY (residence_id) REFERENCES Residence(residence_id) ON DELETE CASCADE
);

CREATE TABLE Notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
