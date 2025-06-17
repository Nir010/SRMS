-- Insert default admin user (password: admin123)
INSERT INTO admins (username, password) VALUES 
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9P2.nHb8GdHm6Ey')
ON DUPLICATE KEY UPDATE username = username;

-- Insert sample students
INSERT INTO students (name, date_of_birth, temporary_address, permanent_address, parents_name, contact_number, email, faculty, semester, enrolled_courses) VALUES
('John Doe', '2000-05-15', '123 Main St, Kathmandu', '456 Oak Ave, Pokhara', 'Robert Doe', '+977-9841234567', 'john.doe@email.com', 'BCA', '6th', 'Java Programming, Database Management, Web Development'),
('Jane Smith', '1999-08-22', '789 Pine Rd, Lalitpur', '321 Elm St, Chitwan', 'Michael Smith', '+977-9851234568', 'jane.smith@email.com', 'BIT', '4th', 'Software Engineering, Computer Networks, Mobile App Development'),
('Ram Sharma', '2001-03-10', '555 Cedar Ln, Bhaktapur', '777 Birch Dr, Butwal', 'Krishna Sharma', '+977-9861234569', 'ram.sharma@email.com', 'CSIT', '2nd', 'Programming Fundamentals, Mathematics, Digital Logic'),
('Sita Poudel', '2000-11-05', '999 Maple Ave, Biratnagar', '111 Spruce St, Dharan', 'Hari Poudel', '+977-9871234570', 'sita.poudel@email.com', 'BBA', '3rd', 'Business Management, Accounting, Marketing'),
('Hari Thapa', '1998-12-18', '222 Willow Rd, Nepalgunj', '444 Poplar Ave, Janakpur', 'Gopal Thapa', '+977-9881234571', 'hari.thapa@email.com', 'BBM', '5th', 'Financial Management, Human Resources, Operations Management');
