package com.collegefinder.backend.auth;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.*;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth") @CrossOrigin(origins = "*")
public class AuthController {
  private final UserRepository users; private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
  public AuthController(UserRepository users) { this.users = users; }
  @PostMapping("/register") public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
    if (users.findByEmail(request.email().toLowerCase()).isPresent()) return ResponseEntity.badRequest().body(new Message("This email is already registered."));
    User user = new User(); user.setName(request.name()); user.setEmail(request.email().toLowerCase()); user.setPasswordHash(encoder.encode(request.password())); users.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(new UserResponse(user.getName(), user.getEmail()));
  }
  @PostMapping("/login") public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    return users.findByEmail(request.email().toLowerCase()).filter(u -> encoder.matches(request.password(), u.getPasswordHash()))
      .<ResponseEntity<?>>map(u -> ResponseEntity.ok(new UserResponse(u.getName(), u.getEmail())))
      .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new Message("Email or password is incorrect.")));
  }
  public record RegisterRequest(@NotBlank String name, @Email String email, @Size(min=6, message="Password must have at least 6 characters") String password) {}
  public record LoginRequest(@Email String email, @NotBlank String password) {}
  public record UserResponse(String name, String email) {} public record Message(String message) {}
}
