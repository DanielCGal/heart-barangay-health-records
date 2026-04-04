package HEART.example.HEART.DatabaseSchema.DAO;

import org.springframework.data.jpa.repository.JpaRepository;

import HEART.example.HEART.DatabaseSchema.Entity.PatientImmunizationStatus;

public interface PatientImmunizationStatusRepository
        extends JpaRepository<PatientImmunizationStatus, Long> {}
