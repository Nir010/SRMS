package com.erecordbook.controller;

import com.erecordbook.model.Admin;
import com.erecordbook.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AdminService adminService;
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            
            Admin admin = adminService.registerAdmin(username, password);
            return ResponseEntity.ok(Map.of("message", "Admin registered successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request, HttpSession session) {
        String username = request.get("username");
        String password = request.get("password");
        
        if (adminService.authenticateAdmin(username, password)) {
            session.setAttribute("admin", username);
            return ResponseEntity.ok(Map.of("message", "Login successful", "username", username));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid credentials"));
        }
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logout successful"));
    }
    
    @GetMapping("/check")
    public ResponseEntity<?> checkAuth(HttpSession session) {
        String admin = (String) session.getAttribute("admin");
        if (admin != null) {
            return ResponseEntity.ok(Map.of("authenticated", true, "username", admin));
        } else {
            return ResponseEntity.ok(Map.of("authenticated", false));
        }
    }
}
