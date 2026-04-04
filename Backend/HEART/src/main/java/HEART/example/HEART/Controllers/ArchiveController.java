package HEART.example.HEART.Controllers;

import HEART.example.HEART.DatabaseSchema.DAO.ArchiveEntryRepository;
import HEART.example.HEART.DatabaseSchema.Entity.ArchiveEntry;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/archive")
public class ArchiveController {

    private final ArchiveEntryRepository archiveRepo;

    public ArchiveController(ArchiveEntryRepository archiveRepo) {
        this.archiveRepo = archiveRepo;
    }

    @GetMapping
    public List<ArchiveEntry> getAll() {
        return archiveRepo.findAll();
    }

    @GetMapping("/patient/{patientId}")
    public List<ArchiveEntry> getByPatientId(@PathVariable Long patientId) {
        return archiveRepo.findByPatientIdOrderByChangedAtDesc(patientId);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        archiveRepo.deleteById(id);
    }
}