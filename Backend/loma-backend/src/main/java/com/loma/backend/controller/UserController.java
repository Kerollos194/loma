package com.loma.backend.controller;

import com.loma.backend.entity.User;
import com.loma.backend.service.UserService;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<User> getAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Integer id) {
        return userService.findById(id)
                .map(user -> ResponseEntity.ok((Object) user))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            User saved = userService.signup(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        return userService.login(loginRequest.getEmail(), loginRequest.getPasswordHash())
                .map(user -> ResponseEntity.ok((Object) user))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials"));
    }
}
