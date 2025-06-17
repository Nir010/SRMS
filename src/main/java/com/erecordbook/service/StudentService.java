package com.erecordbook.service;

import com.erecordbook.model.Student;
import com.erecordbook.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }
    
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }
    
    public Student updateStudent(Long id, Student studentDetails) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        student.setName(studentDetails.getName());
        student.setDateOfBirth(studentDetails.getDateOfBirth());
        student.setTemporaryAddress(studentDetails.getTemporaryAddress());
        student.setPermanentAddress(studentDetails.getPermanentAddress());
        student.setParentsName(studentDetails.getParentsName());
        student.setContactNumber(studentDetails.getContactNumber());
        student.setEmail(studentDetails.getEmail());
        student.setFaculty(studentDetails.getFaculty());
        student.setSemester(studentDetails.getSemester());
        student.setEnrolledCourses(studentDetails.getEnrolledCourses());
        
        return studentRepository.save(student);
    }
    
    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }
    
    public List<Student> searchStudents(String searchTerm) {
        return studentRepository.searchStudents(searchTerm);
    }
}
