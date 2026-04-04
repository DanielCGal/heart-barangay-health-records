package HEART.example.HEART.Controllers;

import HEART.example.HEART.DatabaseSchema.Entity.LogbookEntry;
import HEART.example.HEART.DatabaseSchema.DAO.LogbookEntryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/logbook")
public class LogbookController {

    private final LogbookEntryRepository logbookRepo;

    public LogbookController(LogbookEntryRepository logbookRepo) {
        this.logbookRepo = logbookRepo;
    }

    // DTO for POST body
    public static class NewLogbookEntryRequest {
        public String staffUsername;
        public String action;
        public String patientName;
        public Long patientId;
    }

    @GetMapping
    public List<LogbookEntry> getAll() {
        return logbookRepo.findAllByOrderByTimestampDesc();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LogbookEntry create(@RequestBody NewLogbookEntryRequest req) {
        LogbookEntry e = new LogbookEntry();
        e.setUsername(req.staffUsername);
        e.setAction(req.action);
        e.setPatientName(req.patientName);
        e.setPatientId(req.patientId);
        // timestamp is auto-set by @PrePersist
        return logbookRepo.save(e);
    }

    @PutMapping("/{id}")
    public LogbookEntry update(@PathVariable Long id, @RequestBody LogbookEntry updated) {
        LogbookEntry existing = logbookRepo.findById(id)
            .orElseThrow(() -> new RuntimeException("Logbook entry not found"));

        existing.setUsername(updated.getUsername());
        existing.setAction(updated.getAction());
        existing.setPatientName(updated.getPatientName());
        existing.setPatientId(updated.getPatientId());
        existing.setTimestamp(updated.getTimestamp());

        return logbookRepo.save(existing);
    }
}