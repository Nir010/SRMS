-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS erecordbook;

-- Use the database
USE erecordbook;

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    admin_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    student_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    temporary_address VARCHAR(255),
    permanent_address VARCHAR(255),
    parents_name VARCHAR(100),
    contact_number VARCHAR(20),
    email VARCHAR(100),
    faculty VARCHAR(50),
    semester VARCHAR(20),
    enrolled_courses TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
