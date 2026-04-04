package HEART.example.HEART.Controllers.DTO;

public class UpdateEmailRequest {
    private String newEmail;
    private String code;

    public String getNewEmail() { return newEmail; }
    public void setNewEmail(String newEmail) { this.newEmail = newEmail; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
}
