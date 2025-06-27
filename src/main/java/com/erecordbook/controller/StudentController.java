package com.erecordbook.controller;

import com.erecordbook.model.Student;
import com.erecordbook.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    private boolean isAuthenticated(HttpSession session) {
        return session.getAttribute("admin") != null;
    }
    
    @GetMapping
    public ResponseEntity<?> getAllStudents(HttpSession session) {
        if (!isAuthenticated(session)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        List<Student> students = studentService.getAllStudents();
        return ResponseEntity.ok(students);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Long id, HttpSession session) {
        if (!isAuthenticated(session)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        return studentService.getStudentById(id.intValue())
                .map(student -> ResponseEntity.ok(student))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody Student student, HttpSession session) {
        if (!isAuthenticated(session)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        Student savedStudent = studentService.saveStudent(student);
        return ResponseEntity.ok(savedStudent);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody Student student, HttpSession session) {
        if (!isAuthenticated(session)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        try {
            Student updatedStudent = studentService.updateStudent(id.intValue(), student);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Integer id, HttpSession session) {
        if (!isAuthenticated(session)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchStudents(@RequestParam String q, HttpSession session) {
        if (!isAuthenticated(session)) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        
        List<Student> students = studentService.searchStudents(q);
        return ResponseEntity.ok(students);
    }
}
