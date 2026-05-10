package com.loma.backend.service;

import com.loma.backend.entity.User;
import com.loma.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> findAll() {
        return userRepo.findAll();
    }

    public Optional<User> findById(Integer id) {
        return userRepo.findById(id);
    }

    public User signup(User user) {
        if (userRepo.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepo.save(user);
    }

    public Optional<User> login(String email, String password) {
        return userRepo.findByEmail(email)
                .filter(user -> passwordEncoder.matches(password, user.getPasswordHash()));
    }
}
