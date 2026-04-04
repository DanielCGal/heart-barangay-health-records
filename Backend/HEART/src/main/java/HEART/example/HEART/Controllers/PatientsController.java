package HEART.example.HEART.Controllers;

import HEART.example.HEART.DatabaseSchema.DAO.PatientRepository;
import HEART.example.HEART.DatabaseSchema.DAO.PhysicalExamRepository;
import HEART.example.HEART.DatabaseSchema.Entity.MaternalRecord;
import HEART.example.HEART.DatabaseSchema.Entity.Patient;
import HEART.example.HEART.DatabaseSchema.Entity.PatientImmunizationStatus;
import HEART.example.HEART.DatabaseSchema.Entity.PersonalSocialHistory;
import HEART.example.HEART.DatabaseSchema.DAO.ProgramInformationRepository;
import HEART.example.HEART.DatabaseSchema.Entity.ProgramInformation;

import org.springframework.transaction.annotation.Transactional;

import HEART.example.HEART.DatabaseSchema.DAO.ArchiveEntryRepository;
import HEART.example.HEART.DatabaseSchema.Entity.ArchiveEntry;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import HEART.example.HEART.DatabaseSchema.DAO.LogbookEntryRepository;
import HEART.example.HEART.DatabaseSchema.Entity.LogbookEntry;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/patients")
public class PatientsController {

    private final PatientRepository patientRepo;
    private final PhysicalExamRepository physicalExamRepo;
    private final LogbookEntryRepository logbookRepo;
    private final ProgramInformationRepository programInformationRepo;

    private final ArchiveEntryRepository archiveRepo;
private final ObjectMapper objectMapper = new ObjectMapper()
        .registerModule(new JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    public PatientsController(
    PatientRepository patientRepo,
    PhysicalExamRepository physicalExamRepo,
    ArchiveEntryRepository archiveRepo,
    LogbookEntryRepository logbookRepo,
    ProgramInformationRepository programInformationRepo
) {
    this.patientRepo = patientRepo;
    this.physicalExamRepo = physicalExamRepo;
    this.archiveRepo = archiveRepo;
    this.logbookRepo = logbookRepo;
    this.programInformationRepo = programInformationRepo;
}

private void archiveOldPatient(Patient existing, String changedBy) {
    try {
        ArchiveEntry entry = new ArchiveEntry();
        LocalDateTime now = LocalDateTime.now();

        ArchiveEntry lastArchive = archiveRepo
            .findTopByPatientIdOrderByChangedAtDesc(existing.getId())
            .orElse(null);

        entry.setPatientId(existing.getId());
        entry.setLastName(existing.getLastName());
        entry.setFirstName(existing.getFirstName());
        entry.setMiddleInitial(existing.getMiddleInitial());

        if (lastArchive == null) {
            entry.setStartDatetime(existing.getCreatedAt());
        } else {
            entry.setStartDatetime(lastArchive.getChangedAt());
        }

        entry.setEndDatetime(now);
        entry.setChangedAt(now);
        entry.setChangedBy(
            changedBy != null && !changedBy.isBlank() ? changedBy : "staff"
        );

        existing.getPersonalSocialHistory();
        existing.getPhysicalExam();
        existing.getMaternalRecord();
        existing.getImmunizationStatus();
        existing.getProgramsInformation().size();

        entry.setSnapshotJson(objectMapper.writeValueAsString(existing));

        archiveRepo.save(entry);
    } catch (Exception e) {
        throw new RuntimeException("Failed to archive old patient snapshot", e);
    }
}



    @GetMapping
    public List<Patient> getAll() {
        return patientRepo.findAll();
    }

    @Transactional
@DeleteMapping("/{id}/program-information/{programName}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteProgramInformation(
    @PathVariable Long id,
    @PathVariable String programName,
    @RequestParam(required = false) String changedBy,
    @RequestParam(defaultValue = "true") boolean archive
) {
    Patient patient = patientRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Patient not found"));

    if (archive) {
        archiveOldPatient(patient, changedBy);
    }

    programInformationRepo.deleteByPatientIdAndProgramName(id, programName);
}

    @GetMapping("/{id}")
    public Patient getById(@PathVariable Long id) {
        return patientRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }

   @PostMapping
@ResponseStatus(HttpStatus.CREATED)
public Patient create(@RequestBody Patient patient) {
    patient.setId(null);
    patient.setCreatedAt(null);

    if (patient.getPersonalSocialHistory() != null) {
        patient.getPersonalSocialHistory().setPatient(patient);
    }

    if (patient.getPhysicalExam() != null) {
    patient.getPhysicalExam().setPatient(patient); // REQUIRED for @MapsId
    if (patient.getPhysicalExam().getExamDate() == null) {
        patient.getPhysicalExam().setExamDate(LocalDate.now());
    }
}

    return patientRepo.save(patient);
}

public class ExamSectionDTO {
    public boolean essentiallyNormal;
    public List<String> findings;
    public String othersSpecify;
}

public class PhysicalExamDTO {
    public ExamSectionDTO sheent;
    public ExamSectionDTO chestBreastLungs;
    public ExamSectionDTO heart;
    public ExamSectionDTO abdomen;
    public ExamSectionDTO genitourinary;
    public ExamSectionDTO extremities;
    public ExamSectionDTO neurological;
}

public class CreatePatientDTO {
    public Patient patient;              // or flatten patient fields too
    public PhysicalExamDTO physicalExam; // match frontend
    public PersonalSocialHistory personalSocialHistory;
}

@PutMapping("/{id}/maternal-record")
public Patient addOrUpdateMaternalRecord(
    @PathVariable Long id,
    @RequestBody MaternalRecord maternalRecord,
    @RequestParam(required = false) String changedBy,
    @RequestParam(defaultValue = "true") boolean archive
) {
    Patient patient = patientRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Patient not found"));

    if (archive) {
        archiveOldPatient(patient, changedBy);
}

    patient.setMaternalRecord(maternalRecord);

    String currentProgram = patient.getProgram();
    if (currentProgram == null || currentProgram.isBlank()) {
        patient.setProgram("Prenatal Care");
    } else {
        List<String> programs = new java.util.ArrayList<>(
            java.util.Arrays.stream(currentProgram.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList()
        );

        if (!programs.contains("Prenatal Care")) {
            programs.add("Prenatal Care");
        }

        patient.setProgram(String.join(", ", programs));
    }

    Patient saved = patientRepo.save(patient);
    return saved;
}

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        patientRepo.deleteById(id);
    }

    @PutMapping("/{id}/immunization-status")
public Patient saveImmunizationStatus(
    @PathVariable Long id,
    @RequestBody PatientImmunizationStatus incoming,
    @RequestParam(required = false) String changedBy,
    @RequestParam(defaultValue = "true") boolean archive
) {
    Patient patient = patientRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Patient not found"));

    if (archive) {
    archiveOldPatient(patient, changedBy);
}

    PatientImmunizationStatus existing = patient.getImmunizationStatus();

    if (existing == null) {
        PatientImmunizationStatus created = new PatientImmunizationStatus();
        created.setAdultImmunization(incoming.getAdultImmunization());
        created.setChildImmunization(incoming.getChildImmunization());
        created.setChildNutrition(incoming.getChildNutrition());
        patient.setImmunizationStatus(created);
    } else {
        existing.setAdultImmunization(incoming.getAdultImmunization());
        existing.setChildImmunization(incoming.getChildImmunization());
        existing.setChildNutrition(incoming.getChildNutrition());
    }

    Patient saved = patientRepo.save(patient);
return saved;
}

@PutMapping("/{id}")
public Patient updatePatient(
    @PathVariable Long id,
    @RequestBody Patient incoming,
    @RequestParam(required = false) String changedBy,
    @RequestParam(defaultValue = "true") boolean archive
) {

    Patient existing = patientRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (archive) {
    archiveOldPatient(existing, changedBy);
}

    // Basic info
    existing.setLastName(incoming.getLastName());
    existing.setFirstName(incoming.getFirstName());
    existing.setMiddleInitial(incoming.getMiddleInitial());
    existing.setAge(incoming.getAge());
    existing.setAgeMonths(incoming.getAgeMonths());
    existing.setSex(incoming.getSex());
    existing.setBirthday(incoming.getBirthday());
    existing.setReligion(incoming.getReligion());
    existing.setCivilStatus(incoming.getCivilStatus());
    existing.setContactNumber(incoming.getContactNumber());
    existing.setEducationalAttainment(incoming.getEducationalAttainment());
    existing.setOccupation(incoming.getOccupation());

    // Spouse
    existing.setSpouseName(incoming.getSpouseName());
    existing.setSpouseOccupation(incoming.getSpouseOccupation());
    existing.setSpouseContact(incoming.getSpouseContact());

    // Address
    existing.setAddress(incoming.getAddress());
    existing.setPurok(incoming.getPurok());
    existing.setBarangay(incoming.getBarangay());
    existing.setCity(incoming.getCity());

    // Program / patient summary
    existing.setProgram(incoming.getProgram());
    existing.setFamilyPlanning(incoming.getFamilyPlanning());
    existing.setVitamins(incoming.getVitamins());
    existing.setChildren(incoming.getChildren());

    // Medical
    existing.setCoMorbidities(incoming.getCoMorbidities());
    existing.setCancer(incoming.getCancer());
    existing.setAllergies(incoming.getAllergies());
    existing.setMaintenanceMedication(incoming.getMaintenanceMedication());
    existing.setPreviousIllnesses(incoming.getPreviousIllnesses());

    // Vitals
    existing.setLastVisit(incoming.getLastVisit());
    existing.setBloodPressure(incoming.getBloodPressure());
    existing.setWeight(incoming.getWeight());
    existing.setHeight(incoming.getHeight());

    // Vaccines
    existing.setBcgVaccine(incoming.getBcgVaccine());
    existing.setHepBVaccine(incoming.getHepBVaccine());
    existing.setVitaminK(incoming.getVitaminK());

    // Family history
    existing.setFamilyHistoryConditions(incoming.getFamilyHistoryConditions());
    existing.setFamilyHistoryOther(incoming.getFamilyHistoryOther());
    existing.setFamilyHistoryMother(incoming.getFamilyHistoryMother());

    // Newborn care
    existing.setTypeOfDelivery(incoming.getTypeOfDelivery());
    existing.setBirthWeight(incoming.getBirthWeight());
    existing.setBirthHeight(incoming.getBirthHeight());
    existing.setBcgDate(incoming.getBcgDate());
    existing.setHepBDate(incoming.getHepBDate());
    existing.setVitaminKDate(incoming.getVitaminKDate());
    existing.setMotherTetanusShots(incoming.getMotherTetanusShots());
    existing.setNewbornScreening(incoming.getNewbornScreening());
    existing.setScreeningDate(incoming.getScreeningDate());
    existing.setScreeningResults(incoming.getScreeningResults());
    existing.setInitiatedBreastfeeding(incoming.getInitiatedBreastfeeding());
    existing.setBreastfeedingDate(incoming.getBreastfeedingDate());
    existing.setPlaceOfDelivery(incoming.getPlaceOfDelivery());

    // Nested 1:1 relations
    existing.setPersonalSocialHistory(incoming.getPersonalSocialHistory());
    existing.setPhysicalExam(incoming.getPhysicalExam());

    // Maternal record only if needed
    if (incoming.getMaternalRecord() != null) {
    MaternalRecord incomingMr = incoming.getMaternalRecord();
    MaternalRecord existingMr = existing.getMaternalRecord();

    if (existingMr == null) {
        existingMr = new MaternalRecord();
        existing.setMaternalRecord(existingMr);
    }

    existingMr.setGravida(incomingMr.getGravida());
    existingMr.setPara(incomingMr.getPara());
    existingMr.setFullTerm(incomingMr.getFullTerm());
    existingMr.setPreterm(incomingMr.getPreterm());
    existingMr.setAbortion(incomingMr.getAbortion());
    existingMr.setLiving(incomingMr.getLiving());

    existingMr.setMenarcheAge(incomingMr.getMenarcheAge());
    existingMr.setMenstrualCycle(incomingMr.getMenstrualCycle());
    existingMr.setMenstrualFlowDays(incomingMr.getMenstrualFlowDays());
    existingMr.setCoitarcheAge(incomingMr.getCoitarcheAge());
    existingMr.setCurrentFpMethod(incomingMr.getCurrentFpMethod());

    existingMr.setPapSmear(incomingMr.getPapSmear());
    existingMr.setPapSmearDate(incomingMr.getPapSmearDate());
    existingMr.setPapSmearResult(incomingMr.getPapSmearResult());

    existingMr.setVia(incomingMr.getVia());
    existingMr.setViaDate(incomingMr.getViaDate());
    existingMr.setViaResult(incomingMr.getViaResult());

    existingMr.setHistoryOfSti(incomingMr.getHistoryOfSti());
    existingMr.setStiDate(incomingMr.getStiDate());
    existingMr.setStiResult(incomingMr.getStiResult());

    existingMr.setRiskCode(incomingMr.getRiskCode());
    existingMr.setMotherBabyBook(incomingMr.getMotherBabyBook());

    existingMr.setLmp(incomingMr.getLmp());
    existingMr.setEdd(incomingMr.getEdd());
    existingMr.setPlanToDeliverAt(incomingMr.getPlanToDeliverAt());
    existingMr.setAgeOfGestation(incomingMr.getAgeOfGestation());
    existingMr.setAccompanyingPerson(incomingMr.getAccompanyingPerson());

    existingMr.setSeenByDentist(incomingMr.getSeenByDentist());
    existingMr.setDentistDate(incomingMr.getDentistDate());
    existingMr.setDentistVisit1(incomingMr.getDentistVisit1());
    existingMr.setDentistVisit2(incomingMr.getDentistVisit2());
    existingMr.setDentistVisit3(incomingMr.getDentistVisit3());

    existingMr.setSeenByPhysician(incomingMr.getSeenByPhysician());
    existingMr.setPhysicianDate(incomingMr.getPhysicianDate());
    existingMr.setPhysicianVisit1(incomingMr.getPhysicianVisit1());
    existingMr.setPhysicianVisit2(incomingMr.getPhysicianVisit2());
    existingMr.setPhysicianVisit3(incomingMr.getPhysicianVisit3());

    existingMr.setTt1(incomingMr.getTt1());
    existingMr.setTt2(incomingMr.getTt2());
    existingMr.setTt3(incomingMr.getTt3());
    existingMr.setTt4(incomingMr.getTt4());
    existingMr.setTt5(incomingMr.getTt5());

    existingMr.setIodizedSalt(incomingMr.getIodizedSalt());
    existingMr.setIronSupplement(incomingMr.getIronSupplement());

    existingMr.setBloodType(incomingMr.getBloodType());
existingMr.setBloodTypeDate(incomingMr.getBloodTypeDate());
existingMr.setFbsRbsHba1c(incomingMr.getFbsRbsHba1c());
existingMr.setFbsRbsHba1cDate(incomingMr.getFbsRbsHba1cDate());
existingMr.setHbsag(incomingMr.getHbsag());
existingMr.setHbsagDate(incomingMr.getHbsagDate());
existingMr.setHemoglobinPrenatal(incomingMr.getHemoglobinPrenatal());
existingMr.setHemoglobinPrenatalDate(incomingMr.getHemoglobinPrenatalDate());
existingMr.setHiv(incomingMr.getHiv());
existingMr.setHivDate(incomingMr.getHivDate());
existingMr.setSyphilis(incomingMr.getSyphilis());
existingMr.setSyphilisDate(incomingMr.getSyphilisDate());
existingMr.setTuberculosis(incomingMr.getTuberculosis());
existingMr.setTuberculosisDate(incomingMr.getTuberculosisDate());
existingMr.setUrinalysisPrenatal(incomingMr.getUrinalysisPrenatal());
existingMr.setUrinalysisPrenatalDate(incomingMr.getUrinalysisPrenatalDate());
existingMr.setOtherTestsPrenatal(incomingMr.getOtherTestsPrenatal());
existingMr.setOtherTestsPrenatalDate(incomingMr.getOtherTestsPrenatalDate());

existingMr.setDateOfDelivery(incomingMr.getDateOfDelivery());
existingMr.setPostnatalPlaceOfDelivery(incomingMr.getPostnatalPlaceOfDelivery());
existingMr.setTypeOfDelivery(incomingMr.getTypeOfDelivery());
existingMr.setOutcomeOfPregnancy(incomingMr.getOutcomeOfPregnancy());
existingMr.setAttendedBy(incomingMr.getAttendedBy());
existingMr.setComplications(incomingMr.getComplications());
existingMr.setSexOfNewborn(incomingMr.getSexOfNewborn());
existingMr.setBirthweight(incomingMr.getBirthweight());

existingMr.setHemoglobinDone(incomingMr.getHemoglobinDone());
existingMr.setHemoglobinPostnatal(incomingMr.getHemoglobinPostnatal());
existingMr.setHemoglobinPostnatalDate(incomingMr.getHemoglobinPostnatalDate());

existingMr.setVitaminA(incomingMr.getVitaminA());
existingMr.setVitaminADate(incomingMr.getVitaminADate());

existingMr.setBreastfeeding(incomingMr.getBreastfeeding());
existingMr.setBreastfeedingDateInitiated(incomingMr.getBreastfeedingDateInitiated());

existingMr.setCounseling(incomingMr.getCounseling());
existingMr.setCounselingDate(incomingMr.getCounselingDate());

existingMr.setDentistPostnatalYes(incomingMr.getDentistPostnatalYes());
existingMr.setDentistPostnatalVisits1(incomingMr.getDentistPostnatalVisits1());
existingMr.setDentistPostnatalVisits2(incomingMr.getDentistPostnatalVisits2());
existingMr.setDentistPostnatalVisits3(incomingMr.getDentistPostnatalVisits3());

existingMr.setPhysicianPostnatalYes(incomingMr.getPhysicianPostnatalYes());
existingMr.setPhysicianPostnatalVisits1(incomingMr.getPhysicianPostnatalVisits1());
existingMr.setPhysicianPostnatalVisits2(incomingMr.getPhysicianPostnatalVisits2());
existingMr.setPhysicianPostnatalVisits3(incomingMr.getPhysicianPostnatalVisits3());

existingMr.setBloodTypePostnatal(incomingMr.getBloodTypePostnatal());
existingMr.setBloodTypePostnatalDate(incomingMr.getBloodTypePostnatalDate());
existingMr.setFbsRbsHba1cPostnatal(incomingMr.getFbsRbsHba1cPostnatal());
existingMr.setFbsRbsHba1cPostnatalDate(incomingMr.getFbsRbsHba1cPostnatalDate());
existingMr.setHbsagPostnatal(incomingMr.getHbsagPostnatal());
existingMr.setHbsagPostnatalDate(incomingMr.getHbsagPostnatalDate());
existingMr.setHemoglobinLabPostnatal(incomingMr.getHemoglobinLabPostnatal());
existingMr.setHemoglobinLabPostnatalDate(incomingMr.getHemoglobinLabPostnatalDate());
existingMr.setHivPostnatal(incomingMr.getHivPostnatal());
existingMr.setHivPostnatalDate(incomingMr.getHivPostnatalDate());
existingMr.setSyphilisPostnatal(incomingMr.getSyphilisPostnatal());
existingMr.setSyphilisPostnatalDate(incomingMr.getSyphilisPostnatalDate());
existingMr.setTuberculosisPostnatal(incomingMr.getTuberculosisPostnatal());
existingMr.setTuberculosisPostnatalDate(incomingMr.getTuberculosisPostnatalDate());
existingMr.setUrinalysisPostnatal(incomingMr.getUrinalysisPostnatal());
existingMr.setUrinalysisPostnatalDate(incomingMr.getUrinalysisPostnatalDate());
existingMr.setOtherTestsPostnatal(incomingMr.getOtherTestsPostnatal());
existingMr.setOtherTestsPostnatalDate(incomingMr.getOtherTestsPostnatalDate());

}


    // Immunization status if included
    existing.setImmunizationStatus(incoming.getImmunizationStatus());


    Patient saved = patientRepo.save(existing);
return saved;
}

@PutMapping("/{id}/program-information")
public ProgramInformation saveProgramInformation(
    @PathVariable Long id,
    @RequestBody ProgramInformationDTO incoming,
    @RequestParam(required = false) String changedBy,
    @RequestParam(defaultValue = "true") boolean archive
) {
    Patient patient = patientRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Patient not found"));

    if (archive) {
    archiveOldPatient(patient, changedBy);
}

    ProgramInformation info = programInformationRepo
        .findByPatientIdAndProgramName(id, incoming.getProgramName())
        .orElseGet(() -> {
            ProgramInformation created = new ProgramInformation();
            created.setPatient(patient);
            created.setProgramName(incoming.getProgramName());
            return created;
        });

    info.setDetails(incoming.getDetails());

    return programInformationRepo.save(info);
}

@GetMapping("/{id}/program-information")
public List<ProgramInformation> getProgramInformation(@PathVariable Long id) {
    return programInformationRepo.findByPatientId(id);
}


private void addLogbook(String staffUsername, String action, Patient patient) {
    LogbookEntry entry = new LogbookEntry();
    entry.setUsername(
        staffUsername != null && !staffUsername.isBlank()
            ? staffUsername
            : "staff"
    );
    entry.setAction(action);
    entry.setPatientName(patient.getFirstName() + " " + patient.getLastName());
    entry.setPatientId(patient.getId());

    // timestamp is auto-set by @PrePersist if left null
    logbookRepo.save(entry);
}


}
