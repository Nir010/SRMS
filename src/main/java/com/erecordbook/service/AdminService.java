package com.erecordbook.service;

import com.erecordbook.model.Admin;
import com.erecordbook.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    
    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    public Admin registerAdmin(String username, String hashedPassword) {
        if (adminRepository.existsByUsername(username)) {
            throw new RuntimeException("Username already exists");
        }
        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(hashedPassword); 
        return adminRepository.save(admin);
    }
    
    public boolean authenticateAdmin(String username, String password) {
        return adminRepository.findByUsername(username)
                .map(admin -> passwordEncoder.matches(password, admin.getPassword()))
                .orElse(false);
    }
    
    public Admin findByUsername(String username) {
        return adminRepository.findByUsername(username).orElse(null);
    }
}
