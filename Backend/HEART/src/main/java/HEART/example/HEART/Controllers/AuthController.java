package HEART.example.HEART.Controllers;

import HEART.example.HEART.Controllers.DTO.*;
import HEART.example.HEART.Controllers.Service.MailOtpSender;
import HEART.example.HEART.Controllers.Service.OtpService;
import HEART.example.HEART.DatabaseSchema.DAO.StaffAccountRepository;
import HEART.example.HEART.DatabaseSchema.Entity.StaffAccount;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    public static class CreateStaffRequest {
    public String id;
    public String fullName;
    public String username;
    public String email;
    public String passwordHash;
    public String role;
}

    private final StaffAccountRepository staffRepo;
    private final OtpService otpService;
    private final MailOtpSender mailOtpSender;

    public AuthController(StaffAccountRepository staffRepo, OtpService otpService, MailOtpSender mailOtpSender) {
    this.staffRepo = staffRepo;
    this.otpService = otpService;
    this.mailOtpSender = mailOtpSender;
}

    // POST /auth/login  { identifier, password } → { token, user }
    @PostMapping("/login")
public LoginResponse login(@RequestBody LoginRequest req) {
    String identifier = req.getIdentifier();
    String password = req.getPassword();

    if (identifier == null || identifier.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Identifier is required.");
    }

    if (password == null || password.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required.");
    }

    StaffAccount staff = null;

    // 1) Try UUID ID login
    try {
        UUID id = UUID.fromString(identifier.trim());
        staff = staffRepo.findById(id).orElse(null);
    } catch (IllegalArgumentException ignored) {
        // not a UUID, skip
    }

    // 2) Try username login
    if (staff == null) {
        staff = staffRepo.findByUsername(identifier.trim()).orElse(null);
    }

    // 3) Try email login
    if (staff == null) {
        staff = staffRepo.findByEmailIgnoreCase(identifier.trim()).orElse(null);
    }

    if (staff == null) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials. Please try again.");
    }

    // Password check
    if (staff.getPasswordHash() == null || !staff.getPasswordHash().equals(password)) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials. Please try again.");
    }

    AuthUserDto user = new AuthUserDto(
            staff.getId().toString(),
            staff.getFullName(),
            staff.getEmail(),
            staff.getRole(),
            staff.getCreatedAt() != null ? staff.getCreatedAt().toString() : null,
            staff.getUpdatedAt() != null ? staff.getUpdatedAt().toString() : null
    );

    String token = "mock-jwt-" + UUID.randomUUID();
    return new LoginResponse(token, user);
}

@PostMapping("/staff")
@ResponseStatus(HttpStatus.CREATED)
public AuthUserDto createStaff(@RequestBody CreateStaffRequest body) {
    if (body.fullName == null || body.fullName.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Full name is required.");
    }
    if (body.username == null || body.username.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username is required.");
    }
    if (body.email == null || body.email.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
    }
    if (body.passwordHash == null || body.passwordHash.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Password is required.");
    }
    if (body.role == null || body.role.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role is required.");
    }

    String role = body.role.trim();
    if (!role.equals("Admin") && !role.equals("Staff")) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Role must be Admin or Staff.");
    }

    if (staffRepo.existsByEmailIgnoreCase(body.email.trim())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already in use.");
    }

    if (staffRepo.existsByUsername(body.username.trim())) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Username is already in use.");
    }

    if (body.id == null || body.id.isBlank()) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Staff ID is required.");
}

UUID staffId;
try {
    staffId = UUID.fromString(body.id.trim());
} catch (IllegalArgumentException ex) {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Staff ID format is invalid.");
}

if (staffRepo.findById(staffId).isPresent()) {
    throw new ResponseStatusException(HttpStatus.CONFLICT, "Staff ID is already in use.");
}

StaffAccount staff = new StaffAccount();
staff.setId(staffId);
staff.setFullName(body.fullName.trim());
staff.setUsername(body.username.trim());
staff.setEmail(body.email.trim());
staff.setPasswordHash(body.passwordHash);
staff.setRole(role);

StaffAccount saved = staffRepo.save(staff);

    return new AuthUserDto(
    saved.getId().toString(),
    saved.getFullName(),
    saved.getEmail(),
    saved.getRole(),
    saved.getCreatedAt() != null ? saved.getCreatedAt().toString() : null,
    saved.getUpdatedAt() != null ? saved.getUpdatedAt().toString() : null
);
}


    // POST /auth/logout → 204
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return ResponseEntity.noContent().build();
    }

    // GET /auth/me (Bearer token) → AuthUser
    @GetMapping("/me")
    public AuthUserDto me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        // For now: return first staff.
        StaffAccount staff = staffRepo.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("No staff accounts found"));

        return new AuthUserDto(
    staff.getId().toString(),
    staff.getFullName(),
    staff.getEmail(),
    staff.getRole(),
    staff.getCreatedAt() != null ? staff.getCreatedAt().toString() : null,
    staff.getUpdatedAt() != null ? staff.getUpdatedAt().toString() : null
);
    }

   // POST /auth/forgot-password { email } → { message }
    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@RequestBody ForgotPasswordRequest body) {
        String email = body.getEmail();
        if (email == null || email.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required.");
        }

        StaffAccount staff = staffRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existing email in the database."));

        // Generate OTP (valid 10 minutes)
        String code = otpService.generateAndStore("PASSWORD_RESET", staff.getEmail(), 10);

        // Send email
        mailOtpSender.sendOtp(staff.getEmail(), code);

        return Map.of("message", "Verification code sent.");
    }


    // POST /auth/verify-reset-code { email, code } → { token, user }
    @PostMapping("/verify-reset-code")
    public LoginResponse verifyResetCode(@RequestBody VerifyResetCodeRequest body) {
        String email = body.getEmail();
        String code = body.getCode();

        if (email == null || email.isBlank() || code == null || code.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email and code are required.");
        }

        StaffAccount staff = staffRepo.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No existing email in the database."));

        boolean ok = otpService.verify("PASSWORD_RESET", email, code);
        if (!ok) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect code. Please try again.");
        }

        // Verified → return session like login (token + user)
        AuthUserDto user = new AuthUserDto(
                staff.getId().toString(),
                staff.getFullName(),
                staff.getEmail(),
                staff.getRole(),
                staff.getCreatedAt() != null ? staff.getCreatedAt().toString() : null,
                staff.getUpdatedAt() != null ? staff.getUpdatedAt().toString() : null
        );

        String token = "mock-jwt-reset-" + UUID.randomUUID();
        return new LoginResponse(token, user);
    }

    // POST /auth/me/email/send-code { newEmail } → { message }
    @PostMapping("/me/email/send-code")
public Map<String, String> sendEmailVerification(@RequestBody SendEmailCodeRequest body) {
    String newEmail = body.getNewEmail();
    if (newEmail == null || newEmail.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New email is required.");
    }

    // prevent using an email that already belongs to someone
    if (staffRepo.existsByEmailIgnoreCase(newEmail)) {
        throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already in use.");
    }

    // generate OTP for EMAIL_CHANGE purpose
    String code = otpService.generateAndStore("EMAIL_CHANGE", newEmail, 10);

    // send email
    mailOtpSender.sendOtp(newEmail, code);

    return Map.of("message", "Verification code sent.");
}

    // PATCH /auth/me/email { newEmail, code } → AuthUser
    @PatchMapping("/me/email")
public AuthUserDto updateEmail(@RequestBody UpdateEmailRequest body) {
    String newEmail = body.getNewEmail();
    String code = body.getCode();

    if (newEmail == null || newEmail.isBlank() || code == null || code.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New email and code are required.");
    }

    // verify OTP for EMAIL_CHANGE
    boolean ok = otpService.verify("EMAIL_CHANGE", newEmail, code);
    if (!ok) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Incorrect verification code.");
    }

    // update the "current user" (temporary: first staff)
    StaffAccount staff = staffRepo.findAll().stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No staff accounts found"));

    staff.setEmail(newEmail);
    staffRepo.save(staff);

    return new AuthUserDto(
    staff.getId().toString(),
    staff.getFullName(),
    staff.getEmail(),
    staff.getRole(),
    staff.getCreatedAt() != null ? staff.getCreatedAt().toString() : null,
    staff.getUpdatedAt() != null ? staff.getUpdatedAt().toString() : null
);
}

    // PATCH /auth/me/password { currentPassword, newPassword } → 204
    @PatchMapping("/me/password")
public ResponseEntity<Void> updatePassword(@RequestBody UpdatePasswordRequest body) {
    String currentPassword = body.getCurrentPassword();
    String newPassword = body.getNewPassword();

    if (currentPassword == null || currentPassword.isBlank() ||
        newPassword == null || newPassword.isBlank()) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current and new password are required.");
    }

    // TEMP: "current user" = first staff (same as your /me endpoint)
    StaffAccount staff = staffRepo.findAll().stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No staff accounts found"));

    // Plaintext check against password_hash column (dev only)
    if (staff.getPasswordHash() == null || !staff.getPasswordHash().equals(currentPassword)) {
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Current password is incorrect.");
    }

    // Update password (still plaintext in dev mode)
    staff.setPasswordHash(newPassword);
    staffRepo.save(staff);

    return ResponseEntity.noContent().build();
}
}
