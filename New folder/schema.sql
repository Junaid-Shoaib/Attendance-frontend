-- ============================================================
-- Attendance Management System - MySQL Schema
-- Generated to match Laravel 12 migrations
-- ============================================================

SET FOREIGN_KEY_CHECKS=0;
CREATE DATABASE IF NOT EXISTS attendance_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE attendance_management;

-- ------------------------------------------------------------
CREATE TABLE departments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255) UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE designations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE offices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NULL,
  latitude DECIMAL(10,7) NOT NULL,
  longitude DECIMAL(10,7) NOT NULL,
  radius_meters INT UNSIGNED NOT NULL DEFAULT 200,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(255) NULL,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('super_admin','manager','employee') NOT NULL DEFAULT 'employee',
  department_id BIGINT UNSIGNED NULL,
  designation_id BIGINT UNSIGNED NULL,
  manager_id BIGINT UNSIGNED NULL,
  office_id BIGINT UNSIGNED NULL,
  joining_date DATE NULL,
  profile_picture VARCHAR(255) NULL,
  emergency_contact_name VARCHAR(255) NULL,
  emergency_contact_phone VARCHAR(255) NULL,
  status ENUM('active','disabled') NOT NULL DEFAULT 'active',
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL, deleted_at TIMESTAMP NULL,
  CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
  CONSTRAINT fk_users_designation FOREIGN KEY (designation_id) REFERENCES designations(id) ON DELETE SET NULL,
  CONSTRAINT fk_users_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_users_office FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE password_reset_tokens (
  email VARCHAR(255) PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  payload LONGTEXT NOT NULL,
  last_activity INT NOT NULL,
  INDEX (user_id), INDEX (last_activity)
) ENGINE=InnoDB;

CREATE TABLE devices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  device_id VARCHAR(255) NOT NULL,
  device_name VARCHAR(255) NULL,
  platform VARCHAR(255) NULL,
  os_version VARCHAR(255) NULL,
  app_version VARCHAR(255) NULL,
  is_rooted_or_jailbroken TINYINT(1) NOT NULL DEFAULT 0,
  is_primary TINYINT(1) NOT NULL DEFAULT 0,
  is_approved TINYINT(1) NOT NULL DEFAULT 0,
  approved_at TIMESTAMP NULL,
  approved_by BIGINT UNSIGNED NULL,
  last_used_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  UNIQUE KEY uq_user_device (user_id, device_id),
  CONSTRAINT fk_devices_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_devices_approved_by FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE fcm_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  device_id VARCHAR(255) NULL,
  platform VARCHAR(255) NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  CONSTRAINT fk_fcm_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE holidays (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  is_recurring_yearly TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE attendances (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  date DATE NOT NULL,
  time_in DATETIME NULL,
  time_in_latitude DECIMAL(10,7) NULL,
  time_in_longitude DECIMAL(10,7) NULL,
  time_in_address VARCHAR(255) NULL,
  time_in_selfie VARCHAR(255) NULL,
  time_in_device_id BIGINT UNSIGNED NULL,
  time_in_ip VARCHAR(255) NULL,
  time_in_mock_location_flag TINYINT(1) NOT NULL DEFAULT 0,
  time_in_distance_meters DECIMAL(8,2) NULL,
  time_out DATETIME NULL,
  time_out_latitude DECIMAL(10,7) NULL,
  time_out_longitude DECIMAL(10,7) NULL,
  time_out_address VARCHAR(255) NULL,
  time_out_selfie VARCHAR(255) NULL,
  time_out_device_id BIGINT UNSIGNED NULL,
  time_out_ip VARCHAR(255) NULL,
  time_out_mock_location_flag TINYINT(1) NOT NULL DEFAULT 0,
  time_out_distance_meters DECIMAL(8,2) NULL,
  working_hours DECIMAL(5,2) NULL,
  status ENUM('present','absent','late','half_day','on_leave','holiday','weekend') NOT NULL DEFAULT 'present',
  is_regularized TINYINT(1) NOT NULL DEFAULT 0,
  office_id BIGINT UNSIGNED NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  UNIQUE KEY uq_user_date (user_id, date),
  INDEX idx_date_status (date, status),
  CONSTRAINT fk_att_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_att_office FOREIGN KEY (office_id) REFERENCES offices(id) ON DELETE SET NULL,
  CONSTRAINT fk_att_tin_device FOREIGN KEY (time_in_device_id) REFERENCES devices(id) ON DELETE SET NULL,
  CONSTRAINT fk_att_tout_device FOREIGN KEY (time_out_device_id) REFERENCES devices(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE leave_types (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(255) NOT NULL UNIQUE,
  default_days_per_year INT UNSIGNED NOT NULL DEFAULT 0,
  requires_attachment TINYINT(1) NOT NULL DEFAULT 0,
  is_paid TINYINT(1) NOT NULL DEFAULT 1,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE leave_balances (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  leave_type_id BIGINT UNSIGNED NOT NULL,
  year SMALLINT UNSIGNED NOT NULL,
  allocated_days DECIMAL(5,1) NOT NULL DEFAULT 0,
  used_days DECIMAL(5,1) NOT NULL DEFAULT 0,
  carried_forward_days DECIMAL(5,1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  UNIQUE KEY uq_balance (user_id, leave_type_id, year),
  CONSTRAINT fk_bal_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_bal_type FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE leaves (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  leave_type_id BIGINT UNSIGNED NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days DECIMAL(5,1) NOT NULL,
  reason TEXT NOT NULL,
  attachment_path VARCHAR(255) NULL,
  status ENUM('pending','manager_approved','approved','rejected','cancelled') NOT NULL DEFAULT 'pending',
  manager_id BIGINT UNSIGNED NULL,
  manager_action_at TIMESTAMP NULL,
  manager_remarks TEXT NULL,
  admin_id BIGINT UNSIGNED NULL,
  admin_action_at TIMESTAMP NULL,
  admin_remarks TEXT NULL,
  rejection_reason TEXT NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  INDEX idx_leaves_user_status (user_id, status),
  CONSTRAINT fk_leaves_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_leaves_type FOREIGN KEY (leave_type_id) REFERENCES leave_types(id),
  CONSTRAINT fk_leaves_manager FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_leaves_admin FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE regularizations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  attendance_id BIGINT UNSIGNED NULL,
  attendance_date DATE NOT NULL,
  requested_time_in DATETIME NULL,
  requested_time_out DATETIME NULL,
  reason TEXT NOT NULL,
  attachment_path VARCHAR(255) NULL,
  status ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  reviewed_by BIGINT UNSIGNED NULL,
  reviewed_at TIMESTAMP NULL,
  review_remarks TEXT NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  INDEX idx_reg_user_status (user_id, status),
  CONSTRAINT fk_reg_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_reg_attendance FOREIGN KEY (attendance_id) REFERENCES attendances(id) ON DELETE SET NULL,
  CONSTRAINT fk_reg_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  action VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45) NULL,
  device_info JSON NULL,
  meta JSON NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  INDEX idx_audit_user_action (user_id, action),
  CONSTRAINT fk_audit_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE company_settings (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) NOT NULL UNIQUE,
  value TEXT NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL
) ENGINE=InnoDB;

CREATE TABLE notifications (
  id CHAR(36) PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  notifiable_type VARCHAR(255) NOT NULL,
  notifiable_id BIGINT UNSIGNED NOT NULL,
  data TEXT NOT NULL,
  read_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  INDEX idx_notifiable (notifiable_type, notifiable_id)
) ENGINE=InnoDB;

CREATE TABLE personal_access_tokens (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  tokenable_type VARCHAR(255) NOT NULL,
  tokenable_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  abilities TEXT NULL,
  last_used_at TIMESTAMP NULL,
  expires_at TIMESTAMP NULL,
  created_at TIMESTAMP NULL, updated_at TIMESTAMP NULL,
  INDEX idx_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS=1;

-- ------------------------------------------------------------
-- Seed data
-- ------------------------------------------------------------
INSERT INTO departments (name, code, is_active, created_at, updated_at) VALUES
('Engineering','DEPT01',1,NOW(),NOW()),
('Human Resources','DEPT02',1,NOW(),NOW()),
('Sales','DEPT03',1,NOW(),NOW()),
('Marketing','DEPT04',1,NOW(),NOW()),
('Finance','DEPT05',1,NOW(),NOW()),
('Operations','DEPT06',1,NOW(),NOW());

INSERT INTO offices (name, address, latitude, longitude, radius_meters, is_active, created_at, updated_at) VALUES
('Head Office', 'Main Business District', 24.8607000, 67.0011000, 200, 1, NOW(), NOW());

INSERT INTO leave_types (name, code, default_days_per_year, requires_attachment, is_paid, is_active, created_at, updated_at) VALUES
('Annual Leave','ANNUAL',14,0,1,1,NOW(),NOW()),
('Sick Leave','SICK',10,1,1,1,NOW(),NOW()),
('Casual Leave','CASUAL',7,0,1,1,NOW(),NOW()),
('Emergency Leave','EMERGENCY',5,0,1,1,NOW(),NOW()),
('Half Day Leave','HALF_DAY',0,0,1,1,NOW(),NOW()),
('Work From Home','WFH',0,0,1,1,NOW(),NOW());

-- Default super admin password is "Password@123" (bcrypt hash below).
-- IMPORTANT: change this password immediately after first login in production.
INSERT INTO users (employee_id, name, email, phone, password, role, department_id, office_id, joining_date, status, created_at, updated_at) VALUES
('EMP0001','System Administrator','admin@attendance.app','+92 300 0000001','$2y$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','super_admin',1,1,CURDATE(),'active',NOW(),NOW());
