# e-RecordBook - Student Record Management System

A modern web-based Student Record Management System built with Java Spring Boot backend and HTML/CSS/JavaScript frontend.

## Features

- **Admin Authentication**: Secure login/logout system with password encryption
- **Student Management**: Add, view, update, and delete student records
- **Search Functionality**: Search students by name, email, or faculty
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dashboard**: Overview of total students and faculties
- **Modern UI**: Clean and intuitive user interface

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Database
- BCrypt Password Encryption

### Frontend
- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- Font Awesome Icons
- Responsive Design

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Web browser (Chrome, Firefox, Safari, Edge)

## Installation & Setup

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/Nir010/e-record-book.git
cd e-record-book
\`\`\`

### 2. Database Setup
1. Install MySQL and create a database:
\`\`\`sql
CREATE DATABASE erecordbook;
\`\`\`

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.username=root
spring.datasource.password=root
