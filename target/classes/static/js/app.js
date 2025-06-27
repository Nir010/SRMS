// --- UI Navigation ---
function showLoginForm() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

function showRegisterForm() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('loginError').textContent = '';
    document.getElementById('registerError').textContent = '';
}

// --- FIX: Only show one section at a time ---
function showSection(sectionId) {
    // Hide all content sections
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    // Show the selected section
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');

    // Highlight the active nav-link
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });
}


// --- Authentication (Simple Local Storage Demo) ---
let users = JSON.parse(localStorage.getItem('users') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

function updateWelcomeUser() {
    const welcomeUser = document.getElementById('welcomeUser');
    if (currentUser && welcomeUser) {
        welcomeUser.innerHTML = `Welcome, <span class="value">${currentUser.username}</span>`;
    }
}

// Login
document.getElementById('loginForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const loginError = document.getElementById('loginError');
    const user = users.find(u => u.username === username);
    if (!user) {
        loginError.textContent = "User does not exist.";
    } else if (user.password !== password) {
        loginError.textContent = "Invalid Password.";
    } else {
        loginError.textContent = "";
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('dashboardPage').classList.add('active');
        updateWelcomeUser();
        loadStudents();
        showSection('dashboard');
    }
};


// Register
document.getElementById('registerForm').onsubmit = function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerError = document.getElementById('registerError');
    if (users.find(u => u.username === username)) {
        registerError.textContent = "User already exists.";
        return;
    }
    if (password !== confirmPassword) {
        registerError.textContent = "Passwords did not match.";
        return;
    }
    
    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    registerError.textContent = "";
    document.getElementById('authMessage').textContent = "Registration successful! Please login.";

    // Clear the form fields
    document.getElementById('registerForm').reset();

    showLoginForm();

};


// Logout
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    document.getElementById('dashboardPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');
}

// --- Student Data Management ---
let students = JSON.parse(localStorage.getItem('students') || '[]');

function saveStudents() {
    localStorage.setItem('students', JSON.stringify(students));
}

function loadStudents() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    students.forEach((student, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${student.photo}" alt="Photo" class="student-photo"></td>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.faculty}</td>
            <td>${student.semester}</td>
            <td>
                <button class="btn btn-primary" onclick="openEditModal(${idx})"><i class="fas fa-edit"></i> Edit</button>
                <button class="btn btn-secondary" onclick="deleteStudent(${idx})"><i class="fas fa-trash"></i> Delete</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    if (document.getElementById('totalStudents'))
        document.getElementById('totalStudents').textContent = students.length;
    if (document.getElementById('activeFaculties'))
        document.getElementById('activeFaculties').textContent = new Set(students.map(s => s.faculty)).size;
}

// --- Photo Preview
document.addEventListener('DOMContentLoaded', function() {
    const photoInput = document.getElementById('studentPhoto');
    const preview = document.getElementById('photoPreview');
    if (photoInput && preview) {
        photoInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file && file.type.match('image.*')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            } else {
                preview.src = '';
                preview.style.display = 'none';
            }
        });
    }
});

// --- Course Selection 
function updateSelectedCourses() {
    const checked = [];
    document.querySelectorAll('#coursesDropdown input[type="checkbox"]:checked').forEach(cb => {
        checked.push(cb.value);
    });
    document.getElementById('selectedCourses').textContent = checked.length ? 'Selected: ' + checked.join(', ') : '';
}
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('#coursesDropdown input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedCourses);
    });
});

// --- Add Student: 
window.validateForm = function() {
    const photoInput = document.getElementById('studentPhoto');
    const photoFile = photoInput.files[0];
    if (!photoFile || !/\.(jpe?g|png)$/i.test(photoFile.name)) {
        document.getElementById('studentMessage').textContent = "Please select a valid photo (jpg, jpeg, png).";
        return false;
    }
    const name = document.getElementById('studentName').value.trim();
    const dob = document.getElementById('dob').value;
    const temp_address = document.getElementById('temp_address').value.trim();
    const perm_address = document.getElementById('perm_address').value.trim();
    const parent_name = document.getElementById('parent_name').value.trim();
    const contact = document.getElementById('contact').value.trim();
    const email = document.getElementById('email').value.trim();
    const faculty = document.getElementById('faculty').value;
    const semester = document.getElementById('semester').value;
    const courses = Array.from(document.querySelectorAll('#coursesDropdown input[type="checkbox"]:checked')).map(cb => cb.value);
    if (!name || !dob || !temp_address || !perm_address || !parent_name || !contact || !email || !faculty || !semester || courses.length === 0) {
        document.getElementById('studentMessage').textContent = "Please fill all fields and select at least one course.";
        return false;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        students.push({
            name,
            dob,
            temp_address,
            perm_address,
            parent_name,
            contact,
            email,
            faculty,
            semester,
            courses,
            photo: e.target.result
        });
        saveStudents();
        document.getElementById('studentMessage').textContent = "Student added successfully!";
        loadStudents();
        setTimeout(() => document.getElementById('studentMessage').textContent = "", 5000);
        document.querySelector('#addStudent form').reset();
        document.getElementById('selectedCourses').textContent = '';
        document.getElementById('photoPreview').style.display = 'none';
    };
    reader.readAsDataURL(photoFile);
    return false;
};

// Delete Student
window.deleteStudent = function (idx) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(idx, 1);
        saveStudents();
        loadStudents();
    }
};

// --- Edit Modal ---
function openEditModal(idx) {
    const student = students[idx];
    document.getElementById('editStudentId').value = idx;
    document.getElementById('editStudentName').value = student.name;
    document.getElementById('editStudentDob').value = student.dob;
    document.getElementById('editStudentEmail').value = student.email;
    document.getElementById('editStudentContact').value = student.contact;
    document.getElementById('editStudentTempAddress').value = student.temp_address;
    document.getElementById('editStudentPermAddress').value = student.perm_address;
    document.getElementById('editStudentParents').value = student.parent_name;
    document.getElementById('editStudentFaculty').value = student.faculty;
    document.getElementById('editStudentSemester').value = student.semester;
    document.getElementById('editStudentCourses').value = student.courses.join(', ');
    document.getElementById('editModal').style.display = 'flex';
}

window.openEditModal = openEditModal;

// Close Edit Modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Edit Student Save
document.getElementById('editStudentForm').onsubmit = function (e) {
    e.preventDefault();
    const idx = document.getElementById('editStudentId').value;
    students[idx] = {
        ...students[idx],
        name: document.getElementById('editStudentName').value.trim(),
        dob: document.getElementById('editStudentDob').value,
        email: document.getElementById('editStudentEmail').value.trim(),
        contact: document.getElementById('editStudentContact').value.trim(),
        temp_address: document.getElementById('editStudentTempAddress').value.trim(),
        perm_address: document.getElementById('editStudentPermAddress').value.trim(),
        parent_name: document.getElementById('editStudentParents').value.trim(),
        faculty: document.getElementById('editStudentFaculty').value,
        semester: document.getElementById('editStudentSemester').value,
        courses: document.getElementById('editStudentCourses').value.split(',').map(c => c.trim()).filter(Boolean)
    };
    saveStudents();
    loadStudents();
    openEditModal();
};

// --- Search ---
window.searchStudents = function () {
    const query = document.getElementById('searchInput').value.trim().toLowerCase();
    const results = students.filter(s =>
        s.id.toString().includes(query) ||
        s.name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.faculty.toLowerCase().includes(query)
    );
    const container = document.getElementById('searchResults');
    if (results.length === 0) {
        container.innerHTML = "<p>No students found.</p>";
        return;
    }
    container.innerHTML = `
    <div class="table-container">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Photo</th><th>ID</th><th>Name</th><th>Email</th><th>Faculty</th><th>Semester</th>
                </tr>
            </thead>
            <tbody>
                ${results.map(s => `
                    <tr>
                        <td><img src="${s.photo}" alt="Photo" class="student-photo"></td>
                        <td>${s.id}</td>
                        <td>${s.name}</td>
                        <td>${s.email}</td>
                        <td>${s.faculty}</td>
                        <td>${s.semester}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
`;
};

// --- Modal Close on Outside Click ---
window.onclick = function (event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
};

// --- On Load: Show dashboard if logged in ---
window.addEventListener('DOMContentLoaded', function () {
    if (currentUser) {
        document.getElementById('loginPage').classList.remove('active');
        document.getElementById('dashboardPage').classList.add('active');
        updateWelcomeUser();
        loadStudents();
        showSection('dashboard'); // Only dashboard is visible
    } else {
        // Show login page only
        document.getElementById('loginPage').classList.add('active');
        document.getElementById('dashboardPage').classList.remove('active');
    }
});

// Toggle Courses Dropdown
function toggleCoursesDropdown() {
    const dropdown = document.getElementById('coursesDropdown');
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

// Optional: Close dropdown if clicked outside
document.addEventListener('click', function(event) {
    const btn = document.getElementById('enrolledCoursesBtn');
    const dropdown = document.getElementById('coursesDropdown');
    if (!btn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});