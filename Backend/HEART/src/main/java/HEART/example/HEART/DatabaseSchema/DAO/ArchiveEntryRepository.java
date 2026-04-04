package HEART.example.HEART.DatabaseSchema.DAO;

import HEART.example.HEART.DatabaseSchema.Entity.ArchiveEntry;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ArchiveEntryRepository extends JpaRepository<ArchiveEntry, Long> {

    List<ArchiveEntry> findByPatientIdOrderByChangedAtDesc(Long patientId);
    Optional<ArchiveEntry> findTopByPatientIdOrderByChangedAtDesc(Long patientId);
    
}
