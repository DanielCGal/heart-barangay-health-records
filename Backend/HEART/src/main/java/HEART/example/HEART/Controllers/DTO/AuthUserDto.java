package HEART.example.HEART.Controllers.DTO;

public class AuthUserDto {
    private String id;
    private String fullName;
    private String email;
    private String role;
    private String createdAt;
    private String updatedAt;

    public AuthUserDto(
        String id,
        String fullName,
        String email,
        String role,
        String createdAt,
        String updatedAt
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public String getId() { return id; }
    public String getFullName() { return fullName; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getCreatedAt() { return createdAt; }
    public String getUpdatedAt() { return updatedAt; }
}
