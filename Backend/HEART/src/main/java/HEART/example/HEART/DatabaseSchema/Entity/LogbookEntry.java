package HEART.example.HEART.DatabaseSchema.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "logbook_entries")
public class LogbookEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // staff username / name
    @Column(nullable = false)
    private String username;

    // "Add Record" | "Edit Record" | "Delete Record" | "Archive" | "Restore"
    @Column(nullable = false)
    private String action;

    // snapshot of patient name (e.g. "Juan Dela Cruz")
    @Column(nullable = false)
    private String patientName;

    // optional FK reference (not enforced unless you want)
    private Long patientId;

    // server-generated timestamp
    @Column(nullable = false)
    private LocalDateTime timestamp;

    @PrePersist
    void prePersist() {
        if (timestamp == null) timestamp = LocalDateTime.now();
    }

    // ---- getters/setters ----
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
}
