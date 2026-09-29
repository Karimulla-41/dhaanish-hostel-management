-- ====================================================================
-- Dhaanish Chennai Autonomous College of Engineering - Hostel Management System
-- Database Schema for MySQL (Production Release v2.4.0)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS dhaanish_hostel;
USE dhaanish_hostel;

-- 1. USERS & AUTHENTICATION TABLE
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('Admin', 'Warden', 'CC', 'Student', 'Security') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. HOSTEL BLOCKS TABLE
CREATE TABLE IF NOT EXISTS hostel_blocks (
  name VARCHAR(50) PRIMARY KEY,
  status ENUM('Active', 'Under Construction') DEFAULT 'Active',
  capacity INT NOT NULL DEFAULT 100,
  occupied INT NOT NULL DEFAULT 0,
  floors INT NOT NULL DEFAULT 4,
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. STUDENTS REGISTRY TABLE
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT,
  name VARCHAR(255) NOT NULL,
  reg_no VARCHAR(50) NOT NULL UNIQUE,
  department VARCHAR(50) NOT NULL,
  year VARCHAR(50) NOT NULL,
  block VARCHAR(50) NOT NULL,
  floor VARCHAR(20) NOT NULL,
  room VARCHAR(20) NOT NULL,
  bed_no VARCHAR(20) NOT NULL,
  hostel_id VARCHAR(50) NOT NULL UNIQUE,
  photo_url TEXT,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  parent_name VARCHAR(255) NOT NULL,
  parent_contact VARCHAR(50) NOT NULL,
  status ENUM('Present', 'Absent', 'Outing', 'Leave') DEFAULT 'Present',
  verification_status ENUM('Pending Verification', 'Active') DEFAULT 'Active',
  join_date VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (block) REFERENCES hostel_blocks(name) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. REGISTERED STAFF (WARDENS & CCs) TABLE
CREATE TABLE IF NOT EXISTS registered_staff (
  id VARCHAR(50) PRIMARY KEY,
  user_id INT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('Warden', 'CC') NOT NULL,
  staff_id VARCHAR(50) NOT NULL UNIQUE,
  phone VARCHAR(50) NOT NULL,
  assigned_block VARCHAR(50),
  assigned_dept VARCHAR(50),
  designation VARCHAR(255),
  join_date VARCHAR(50) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. OUTING REQUESTS & LEAVE PASSES TABLE
CREATE TABLE IF NOT EXISTS outing_requests (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  reg_no VARCHAR(50) NOT NULL,
  dept VARCHAR(50) NOT NULL,
  year VARCHAR(50) NOT NULL,
  room VARCHAR(50) NOT NULL,
  block VARCHAR(50) NOT NULL,
  type VARCHAR(50) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  reason TEXT NOT NULL,
  out_time VARCHAR(100) NOT NULL,
  return_time VARCHAR(100) NOT NULL,
  parent_phone VARCHAR(50) NOT NULL,
  status ENUM('Pending CC', 'Pending Warden', 'Approved', 'CC Rejected', 'Warden Rejected') DEFAULT 'Pending CC',
  applied_at VARCHAR(100) NOT NULL,
  approved_at VARCHAR(100),
  monthly_pass_verified BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. MONTHLY WARDEN RENEWAL QR TOKENS TABLE
CREATE TABLE IF NOT EXISTS monthly_qr_tokens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  month_year VARCHAR(50) NOT NULL,
  warden_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. GATE ENTRY/EXIT SCANS LOG TABLE
CREATE TABLE IF NOT EXISTS gate_scans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  scan_type ENUM('Entry', 'Exit') NOT NULL,
  scanned_by VARCHAR(50) NOT NULL,
  scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Initial Blocks
INSERT INTO hostel_blocks (name, status, capacity, occupied, floors, description) VALUES
('Block A', 'Active', 120, 85, 4, 'Senior Boys Hostel Block'),
('Block B', 'Active', 100, 72, 4, 'Junior Boys Hostel Block'),
('Block C', 'Active', 150, 110, 4, 'Girls Hostel Block 1'),
('Block D', 'Active', 90, 65, 3, 'Girls Hostel Block 2'),
('Block E', 'Under Construction', 100, 0, 4, 'International Student Wing')
ON DUPLICATE KEY UPDATE status=VALUES(status), capacity=VALUES(capacity);
