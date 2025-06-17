// Global variables
let currentUser = null
let students = []

// API Base URL
const API_BASE = "/api"

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  checkAuthStatus()
  setupEventListeners()
})

// Setup event listeners
function setupEventListeners() {
  // Login form
  document.getElementById("loginForm").addEventListener("submit", handleLogin)

  // Register form
  document.getElementById("registerForm").addEventListener("submit", handleRegister)

  // Student form
  document.getElementById("studentForm").addEventListener("submit", handleAddStudent)

  // Edit student form
  document.getElementById("editStudentForm").addEventListener("submit", handleEditStudent)

  // Search input
  document.getElementById("searchInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      searchStudents()
    }
  })
}

// Authentication functions
async function checkAuthStatus() {
  try {
    const response = await fetch(`${API_BASE}/auth/check`)
    const data = await response.json()

    if (data.authenticated) {
      currentUser = data.username
      showDashboard()
      loadDashboardData()
    } else {
      showLoginPage()
    }
  } catch (error) {
    console.error("Auth check failed:", error)
    showLoginPage()
  }
}

function showLoginForm() {
  document.querySelector(".tab-btn.active").classList.remove("active")
  document.querySelector(".tab-btn").classList.add("active")
  document.querySelector(".auth-form.active").classList.remove("active")
  document.getElementById("loginForm").classList.add("active")
}

function showRegisterForm() {
  document.querySelector(".tab-btn.active").classList.remove("active")
  document.querySelectorAll(".tab-btn")[1].classList.add("active")
  document.querySelector(".auth-form.active").classList.remove("active")
  document.getElementById("registerForm").classList.add("active")
}

async function handleLogin(e) {
  e.preventDefault()

  const username = document.getElementById("loginUsername").value
  const password = document.getElementById("loginPassword").value

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (response.ok) {
      currentUser = data.username
      showMessage("authMessage", "Login successful!", "success")
      setTimeout(() => {
        showDashboard()
        loadDashboardData()
      }, 1000)
    } else {
      showMessage("authMessage", data.error, "error")
    }
  } catch (error) {
    showMessage("authMessage", "Login failed. Please try again.", "error")
  }
}

async function handleRegister(e) {
  e.preventDefault()

  const username = document.getElementById("registerUsername").value
  const password = document.getElementById("registerPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  if (password !== confirmPassword) {
    showMessage("authMessage", "Passwords do not match!", "error")
    return
  }

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (response.ok) {
      showMessage("authMessage", "Registration successful! Please login.", "success")
      setTimeout(() => {
        showLoginForm()
        document.getElementById("registerForm").reset()
      }, 1500)
    } else {
      showMessage("authMessage", data.error, "error")
    }
  } catch (error) {
    showMessage("authMessage", "Registration failed. Please try again.", "error")
  }
}

async function logout() {
  try {
    await fetch(`${API_BASE}/auth/logout`, { method: "POST" })
    currentUser = null
    showLoginPage()
  } catch (error) {
    console.error("Logout failed:", error)
  }
}

// Page navigation functions
function showLoginPage() {
  document.getElementById("loginPage").classList.add("active")
  document.getElementById("dashboardPage").classList.remove("active")
}

function showDashboard() {
  document.getElementById("loginPage").classList.remove("active")
  document.getElementById("dashboardPage").classList.add("active")
  document.getElementById("welcomeUser").textContent = `Welcome, ${currentUser}`
}

function showSection(sectionName) {
  // Remove active class from all sections
  document.querySelectorAll(".content-section").forEach((section) => {
    section.classList.remove("active")
  })

  // Remove active class from all nav links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.classList.remove("active")
  })

  // Show selected section
  document.getElementById(sectionName).classList.add("active")

  // Add active class to clicked nav link
  event.target.classList.add("active")

  // Load data based on section
  if (sectionName === "students") {
    loadStudents()
  } else if (sectionName === "dashboard") {
    loadDashboardData()
  }
}

// Dashboard functions
async function loadDashboardData() {
  try {
    const response = await fetch(`${API_BASE}/students`)
    if (response.ok) {
      const students = await response.json()
      document.getElementById("totalStudents").textContent = students.length

      // Count unique faculties
      const faculties = new Set(students.map((s) => s.faculty).filter((f) => f))
      document.getElementById("activeFaculties").textContent = faculties.size
    }
  } catch (error) {
    console.error("Failed to load dashboard data:", error)
  }
}

// Student management functions
async function loadStudents() {
  try {
    const response = await fetch(`${API_BASE}/students`)
    if (response.ok) {
      students = await response.json()
      displayStudents(students)
    } else {
      showMessage("studentMessage", "Failed to load students", "error")
    }
  } catch (error) {
    console.error("Failed to load students:", error)
    showMessage("studentMessage", "Failed to load students", "error")
  }
}

function displayStudents(studentsData) {
  const tbody = document.getElementById("studentsTableBody")
  tbody.innerHTML = ""

  if (studentsData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center">No students found</td></tr>'
    return
  }

  studentsData.forEach((student) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${student.studentId}</td>
            <td>${student.name}</td>
            <td>${student.email || "N/A"}</td>
            <td>${student.faculty || "N/A"}</td>
            <td>${student.semester || "N/A"}</td>
            <td>
                <button class="btn btn-success" onclick="editStudent(${student.studentId})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger" onclick="deleteStudent(${student.studentId})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `
    tbody.appendChild(row)
  })
}

async function handleAddStudent(e) {
  e.preventDefault()

  const studentData = {
    name: document.getElementById("studentName").value,
    dateOfBirth: document.getElementById("studentDob").value || null,
    email: document.getElementById("studentEmail").value,
    contactNumber: document.getElementById("studentContact").value,
    temporaryAddress: document.getElementById("studentTempAddress").value,
    permanentAddress: document.getElementById("studentPermAddress").value,
    parentsName: document.getElementById("studentParents").value,
    faculty: document.getElementById("studentFaculty").value,
    semester: document.getElementById("studentSemester").value,
    enrolledCourses: document.getElementById("studentCourses").value,
  }

  try {
    const response = await fetch(`${API_BASE}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    })

    if (response.ok) {
      showMessage("studentMessage", "Student added successfully!", "success")
      document.getElementById("studentForm").reset()
      loadDashboardData() // Update dashboard stats
    } else {
      const error = await response.json()
      showMessage("studentMessage", error.error || "Failed to add student", "error")
    }
  } catch (error) {
    console.error("Failed to add student:", error)
    showMessage("studentMessage", "Failed to add student", "error")
  }
}

async function editStudent(studentId) {
  try {
    const response = await fetch(`${API_BASE}/students/${studentId}`)
    if (response.ok) {
      const student = await response.json()
      populateEditForm(student)
      document.getElementById("editModal").style.display = "block"
    } else {
      alert("Failed to load student data")
    }
  } catch (error) {
    console.error("Failed to load student:", error)
    alert("Failed to load student data")
  }
}

function populateEditForm(student) {
  document.getElementById("editStudentId").value = student.studentId
  document.getElementById("editStudentName").value = student.name || ""
  document.getElementById("editStudentDob").value = student.dateOfBirth || ""
  document.getElementById("editStudentEmail").value = student.email || ""
  document.getElementById("editStudentContact").value = student.contactNumber || ""
  document.getElementById("editStudentTempAddress").value = student.temporaryAddress || ""
  document.getElementById("editStudentPermAddress").value = student.permanentAddress || ""
  document.getElementById("editStudentParents").value = student.parentsName || ""
  document.getElementById("editStudentFaculty").value = student.faculty || ""
  document.getElementById("editStudentSemester").value = student.semester || ""
  document.getElementById("editStudentCourses").value = student.enrolledCourses || ""
}

async function handleEditStudent(e) {
  e.preventDefault()

  const studentId = document.getElementById("editStudentId").value
  const studentData = {
    name: document.getElementById("editStudentName").value,
    dateOfBirth: document.getElementById("editStudentDob").value || null,
    email: document.getElementById("editStudentEmail").value,
    contactNumber: document.getElementById("editStudentContact").value,
    temporaryAddress: document.getElementById("editStudentTempAddress").value,
    permanentAddress: document.getElementById("editStudentPermAddress").value,
    parentsName: document.getElementById("editStudentParents").value,
    faculty: document.getElementById("editStudentFaculty").value,
    semester: document.getElementById("editStudentSemester").value,
    enrolledCourses: document.getElementById("editStudentCourses").value,
  }

  try {
    const response = await fetch(`${API_BASE}/students/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    })

    if (response.ok) {
      alert("Student updated successfully!")
      closeEditModal()
      loadStudents() // Refresh the students list
      loadDashboardData() // Update dashboard stats
    } else {
      const error = await response.json()
      alert(error.error || "Failed to update student")
    }
  } catch (error) {
    console.error("Failed to update student:", error)
    alert("Failed to update student")
  }
}

async function deleteStudent(studentId) {
  if (!confirm("Are you sure you want to delete this student?")) {
    return
  }

  try {
    const response = await fetch(`${API_BASE}/students/${studentId}`, {
      method: "DELETE",
    })

    if (response.ok) {
      alert("Student deleted successfully!")
      loadStudents() // Refresh the students list
      loadDashboardData() // Update dashboard stats
    } else {
      const error = await response.json()
      alert(error.error || "Failed to delete student")
    }
  } catch (error) {
    console.error("Failed to delete student:", error)
    alert("Failed to delete student")
  }
}

// Search functions
async function searchStudents() {
  const searchTerm = document.getElementById("searchInput").value.trim()

  if (!searchTerm) {
    document.getElementById("searchResults").innerHTML = '<p class="text-center">Please enter a search term</p>'
    return
  }

  try {
    const response = await fetch(`${API_BASE}/students/search?q=${encodeURIComponent(searchTerm)}`)
    if (response.ok) {
      const results = await response.json()
      displaySearchResults(results)
    } else {
      document.getElementById("searchResults").innerHTML = '<p class="text-center">Search failed</p>'
    }
  } catch (error) {
    console.error("Search failed:", error)
    document.getElementById("searchResults").innerHTML = '<p class="text-center">Search failed</p>'
  }
}

function displaySearchResults(results) {
  const container = document.getElementById("searchResults")

  if (results.length === 0) {
    container.innerHTML = '<p class="text-center">No students found matching your search</p>'
    return
  }

  let html = '<div class="table-container"><table class="data-table"><thead><tr>'
  html += "<th>ID</th><th>Name</th><th>Email</th><th>Faculty</th><th>Semester</th><th>Actions</th>"
  html += "</tr></thead><tbody>"

  results.forEach((student) => {
    html += `
            <tr>
                <td>${student.studentId}</td>
                <td>${student.name}</td>
                <td>${student.email || "N/A"}</td>
                <td>${student.faculty || "N/A"}</td>
                <td>${student.semester || "N/A"}</td>
                <td>
                    <button class="btn btn-success" onclick="editStudent(${student.studentId})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteStudent(${student.studentId})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `
  })

  html += "</tbody></table></div>"
  container.innerHTML = html
}

// Modal functions
function closeEditModal() {
  document.getElementById("editModal").style.display = "none"
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("editModal")
  if (event.target === modal) {
    modal.style.display = "none"
  }
}

// Utility functions
function showMessage(elementId, message, type) {
  const messageElement = document.getElementById(elementId)
  messageElement.textContent = message
  messageElement.className = `message ${type}`
  messageElement.style.display = "block"

  // Hide message after 5 seconds
  setTimeout(() => {
    messageElement.style.display = "none"
  }, 5000)
}

// Format date for display
function formatDate(dateString) {
  if (!dateString) return "N/A"
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate phone number format
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone)
}
