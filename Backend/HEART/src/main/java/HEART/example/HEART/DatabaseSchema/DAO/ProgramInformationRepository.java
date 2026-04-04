package HEART.example.HEART.DatabaseSchema.DAO;

import HEART.example.HEART.DatabaseSchema.Entity.ProgramInformation;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface ProgramInformationRepository extends JpaRepository<ProgramInformation, Long> {
    List<ProgramInformation> findByPatientId(Long patientId);
    Optional<ProgramInformation> findByPatientIdAndProgramName(Long patientId, String programName);
    @Modifying
@Transactional
void deleteByPatientIdAndProgramName(Long patientId, String programName);
}
