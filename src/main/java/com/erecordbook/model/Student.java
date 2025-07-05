package com.erecordbook.model;

import jakarta.persistence.*;


@Entity
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer studentId;

    @Column(name = "name") 
    private String name;

    @Column(name = "dob")
    private String dateOfBirth;

    @Column(name = "temp_address")
    private String temporaryAddress;

    @Column(name = "perm_address")
    private String permanentAddress;

    @Column(name = "parent_name")
    private String parentsName;

    @Column(name = "contact")
    private String contactNumber;

    private String email;
    private String faculty;
    private String semester;

    @Column(name = "enrolled_courses")
    private String enrolledCourses;

    @Lob
    @Column(name = "photo", columnDefinition = "LONGTEXT")
    private String photo;

    // Constructors
    public Student() {}

    // Getters and Setters
    public int getStudentId() { return studentId; }
    public void setStudentId(int studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getTemporaryAddress() { return temporaryAddress; }
    public void setTemporaryAddress(String temporaryAddress) { this.temporaryAddress = temporaryAddress; }

    public String getPermanentAddress() { return permanentAddress; }
    public void setPermanentAddress(String permanentAddress) { this.permanentAddress = permanentAddress; }

    public String getParentsName() { return parentsName; }
    public void setParentsName(String parentsName) { this.parentsName = parentsName; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getSemester() { return semester; }
    public void setSemester(String semester) { this.semester = semester; }

    public String getEnrolledCourses() { return enrolledCourses; }
    public void setEnrolledCourses(String enrolledCourses) { this.enrolledCourses = enrolledCourses; }

    public String getPhoto() { return photo; }
    public void setPhoto(String photo) { this.photo = photo; }
}
