package HEART.example.HEART.Controllers.DTO;

public class LoginResponse {
    private String token;
    private AuthUserDto user;

    public LoginResponse() {}

    public LoginResponse(String token, AuthUserDto user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public AuthUserDto getUser() { return user; }
    public void setUser(AuthUserDto user) { this.user = user; }
}
