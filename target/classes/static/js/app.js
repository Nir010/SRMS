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

function showSection(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    const section = document.getElementById(sectionId);
    if (section) section.classList.add('active');
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        }
    });
}

function updateWelcomeUser(username) {
    const welcomeUser = document.getElementById('welcomeUser');
    if (username && welcomeUser) {
        welcomeUser.innerHTML = `Welcome, <span class="value">${username}</span>`;
    }
}

// --- Authentication ---
document.getElementById('loginForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const loginError = document.getElementById('loginError');
    try {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        const data = await res.json();
        if (res.ok) {
            document.getElementById('loginPage').classList.remove('active');
            document.getElementById('dashboardPage').classList.add('active');
            updateWelcomeUser(data.username);
            loadStudents();
            showSection('dashboard');
        } else {
            loginError.textContent = data.error || "Login failed.";
        }
    } catch (err) {
        loginError.textContent = "Network error.";
    }
};

document.getElementById('registerForm').onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const registerError = document.getElementById('registerError');
    if (password !== confirmPassword) {
        registerError.textContent = "Passwords did not match.";
        return;
    }
    try {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({username, password})
        });
        const data = await res.json();
        if (res.ok) {
            registerError.textContent = "";
            document.getElementById('authMessage').textContent = "Registration successful! Please login.";
            document.getElementById('registerForm').reset();
            showLoginForm();
        } else {
            registerError.textContent = data.error || "Registration failed.";
        }
    } catch (err) {
        registerError.textContent = "Network error.";
    }
};

function logout() {
    fetch('/api/auth/logout', {method: 'POST'});
    document.getElementById('dashboardPage').classList.remove('active');
    document.getElementById('loginPage').classList.add('active');
}

// --- Student Data Management ---
async function loadStudents() {
    const tbody = document.getElementById('studentsTableBody');
    if (!tbody) return;
    tbody.innerHTML = '';
    try {
        const res = await fetch('/api/students');
        if (!res.ok) throw new Error();
        const students = await res.json();
        students.forEach((student, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><img src="${student.photo || ''}" alt="Photo" class="student-photo"></td>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td>${student.faculty}</td>
                <td>${student.semester}</td>
                <td>
                    <button class="btn btn-primary" onclick="openEditModal(${student.studentId})"><i class="fas fa-edit"></i> Edit</button>
                    <button class="btn btn-secondary" onclick="deleteStudent(${student.studentId})"><i class="fas fa-trash"></i> Delete</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
        if (document.getElementById('totalStudents'))
            document.getElementById('totalStudents').textContent = students.length;
        if (document.getElementById('activeFaculties'))
            document.getElementById('activeFaculties').textContent = new Set(students.map(s => s.faculty)).size;
    } catch {
        tbody.innerHTML = '<tr><td colspan="7">Failed to load students.</td></tr>';
    }
}

// --- Photo Preview ---
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

// --- Course Selection ---
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

// --- Add Student ---
window.validateForm = function() {
    const photoInput = document.getElementById('studentPhoto');
    const photoFile = photoInput.files[0];
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

    if (!name || !dob || !temp_address || !perm_address || !parent_name || !contact || !email || !faculty || !semester) {
        document.getElementById('studentMessage').textContent = "All fields are required.";
        return false;
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        document.getElementById('studentMessage').textContent = "Please enter a valid email address.";
        return false;
    }
    const contactPattern = /^\d{10,15}$/;
    if (!contactPattern.test(contact)) {
        document.getElementById('studentMessage').textContent = "Please enter a valid contact number (10-15 digits).";
        return false;
    }
    if (courses.length === 0) {
        document.getElementById('studentMessage').textContent = "Please select at least one course.";
        return false;
    }
    if (!photoFile || !/\.(jpe?g|png)$/i.test(photoFile.name)) {
        document.getElementById('studentMessage').textContent = "Please select a valid photo (jpg, jpeg, png).";
        return false;
    }

    const reader = new FileReader();
    reader.onload = async function (e) {
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    name,
                    dateOfBirth: dob,
                    temporaryAddress: temp_address,
                    permanentAddress: perm_address,
                    parentsName: parent_name,
                    contactNumber: contact,
                    email,
                    faculty,
                    semester,
                    enrolledCourses: courses.join(','),
                    photo: e.target.result
                })
            });
            if (res.ok) {
                document.getElementById('studentMessage').textContent = "Student added successfully!";
                loadStudents();
                setTimeout(() => document.getElementById('studentMessage').textContent = "", 5000);
                document.querySelector('#addStudent form').reset();
                document.getElementById('selectedCourses').textContent = '';
                document.getElementById('photoPreview').style.display = 'none';
            } else {
                document.getElementById('studentMessage').textContent = "Failed to add student.";
            }
        } catch {
            document.getElementById('studentMessage').textContent = "Network error.";
        }
    };
    reader.readAsDataURL(photoFile);
    return false;
};

// --- Delete Student ---
window.deleteStudent = async function (studentId) {
    if (confirm("Are you sure you want to delete this student?")) {
        try {
            const res = await fetch(`/api/students/${studentId}`, {method: 'DELETE'});
            if (res.ok) {
                loadStudents();
            } else {
                alert("Failed to delete student.");
            }
        } catch {
            alert("Network error.");
        }
    }
};

// --- Edit Modal ---
async function openEditModal(studentId) {
    try {
        const res = await fetch(`/api/students/${studentId}`);
        if (!res.ok) throw new Error();
        const student = await res.json();
        document.getElementById('editStudentId').value = student.studentId;
        document.getElementById('editStudentName').value = student.name;
        document.getElementById('editStudentDob').value = student.dateOfBirth;
        document.getElementById('editStudentEmail').value = student.email;
        document.getElementById('editStudentContact').value = student.contactNumber;
        document.getElementById('editStudentTempAddress').value = student.temporaryAddress;
        document.getElementById('editStudentPermAddress').value = student.permanentAddress;
        document.getElementById('editStudentParents').value = student.parentsName;
        document.getElementById('editStudentFaculty').value = student.faculty;
        document.getElementById('editStudentSemester').value = student.semester;
        document.getElementById('editStudentCourses').value = student.enrolledCourses;
        document.getElementById('editModal').style.display = 'flex';
    } catch {
        alert("Failed to load student data.");
    }
}
window.openEditModal = openEditModal;

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

// --- Edit Student Save ---
document.getElementById('editStudentForm').onsubmit = async function (e) {
    e.preventDefault();
    const studentId = document.getElementById('editStudentId').value;
    const updatedStudent = {
        name: document.getElementById('editStudentName').value.trim(),
        dateOfBirth: document.getElementById('editStudentDob').value,
        email: document.getElementById('editStudentEmail').value.trim(),
        contactNumber: document.getElementById('editStudentContact').value.trim(),
        temporaryAddress: document.getElementById('editStudentTempAddress').value.trim(),
        permanentAddress: document.getElementById('editStudentPermAddress').value.trim(),
        parentsName: document.getElementById('editStudentParents').value.trim(),
        faculty: document.getElementById('editStudentFaculty').value,
        semester: document.getElementById('editStudentSemester').value,
        enrolledCourses: document.getElementById('editStudentCourses').value
    };
    try {
        const res = await fetch(`/api/students/${studentId}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedStudent)
        });
        if (res.ok) {
            loadStudents();
            closeEditModal();
            const msgDiv = document.getElementById('studentMessage');
            msgDiv.textContent = "Student details updated successfully!";
            msgDiv.style.color = "#28a745";
            setTimeout(() => {
                msgDiv.textContent = "";
                msgDiv.style.color = "";
            }, 4000);
        } else {
            alert("Failed to update student.");
        }
    } catch {
        alert("Network error.");
    }
};

// --- Search ---
window.searchStudents = async function () {
    const query = document.getElementById('searchInput').value.trim();
    const container = document.getElementById('searchResults');
    if (!query) {
        container.innerHTML = '<p style="color: #fda085;">Please enter a search term.</p>';
        return;
    }
    try {
        const res = await fetch(`/api/students/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error();
        const results = await res.json();
        if (results.length === 0) {
            container.innerHTML = "<p style='color: #fda085;'>Student not found.</p>";
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
                            <td><img src="${s.photo || ''}" alt="Photo" class="student-photo"></td>
                            <td>${s.studentId}</td>
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
    } catch {
        container.innerHTML = "<p style='color: #fda085;'>Failed to search students.</p>";
    }
};

// --- Modal Close on Outside Click ---
window.onclick = function (event) {
    const modal = document.getElementById('editModal');
    if (event.target === modal) {
        closeEditModal();
    }
};

// --- On Load: Show dashboard if logged in ---
window.addEventListener('DOMContentLoaded', async function () {
    try {
        const res = await fetch('/api/auth/check');
        const data = await res.json();
        if (data.authenticated) {
            document.getElementById('loginPage').classList.remove('active');
            document.getElementById('dashboardPage').classList.add('active');
            updateWelcomeUser(data.username);
            loadStudents();
            showSection('dashboard');
        } else {
            document.getElementById('loginPage').classList.add('active');
            document.getElementById('dashboardPage').classList.remove('active');
        }
    } catch {
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

document.addEventListener('click', function(event) {
    const btn = document.getElementById('enrolledCoursesBtn');
    const dropdown = document.getElementById('coursesDropdown');
    if (!btn.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.style.display = 'none';
    }
});