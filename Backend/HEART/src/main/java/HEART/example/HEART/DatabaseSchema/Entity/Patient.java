package HEART.example.HEART.DatabaseSchema.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonManagedReference;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 

    @Column(name = "created_at", nullable = false)
private LocalDateTime createdAt;

@PrePersist
void prePersist() {
    if (createdAt == null) createdAt = LocalDateTime.now();
    if (isArchived == null) isArchived = false; 
}

    
    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String firstName;

    @Column(length = 2)
    private String middleInitial;

    private Integer age;
    private Integer ageMonths;

    private String sex;

    private LocalDate birthday;

    private String religion;
    private String civilStatus;

    @Column(length = 11)
    private String contactNumber;

    private String educationalAttainment;
    private String occupation;

    
    private String spouseName;
    private String spouseOccupation;

    @Column(length = 11)
    private String spouseContact;

    // ADDRESS :contentReference[oaicite:4]{index=4}
    private String address;
    private String purok;
    private String barangay;
    private String city;

    // HEALTH PROGRAM :contentReference[oaicite:5]{index=5}
    private String program;
    private Boolean familyPlanning;
    private Boolean vitamins;
    private Integer children;

    // MEDICAL / CLINICAL :contentReference[oaicite:6]{index=6}
    @Column(columnDefinition = "TEXT")
    private String coMorbidities; // comma string or "None"

    private String cancer;        // "None" or free text
    private String allergies;     // "None" or free text

    @Column(columnDefinition = "TEXT")
    private String maintenanceMedication;

    @Column(columnDefinition = "TEXT")
    private String previousIllnesses;

    // LATEST VITALS :contentReference[oaicite:7]{index=7}
    private LocalDate lastVisit;
    private String bloodPressure; // "X/Y mmHg"
    private String weight;        // "X kg"
    private String height;        // "X cm"

    // NEWBORN VACCINES :contentReference[oaicite:8]{index=8}
    private String bcgVaccine;    // YES/NO/N/A
    private String hepBVaccine;   // YES/NO/N/A
    private String vitaminK;      // YES/NO/N/A

    // FAMILY HISTORY :contentReference[oaicite:9]{index=9}
   @JdbcTypeCode(SqlTypes.JSON)
@Column(columnDefinition = "jsonb")
private List<String> familyHistoryConditions = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String familyHistoryOther;

    

    private String familyHistoryMother; // YES/NO/N/A

    // ARCHIVE STATUS :contentReference[oaicite:10]{index=10}
    private Boolean isArchived;
    private LocalDateTime archivedAt;

    // NEWBORN CARE
private String typeOfDelivery;
private String birthWeight;
private String birthHeight;
private String bcgDate;
private String hepBDate;
private String vitaminKDate;
private String motherTetanusShots;
private Boolean newbornScreening;
private LocalDate screeningDate;
private String screeningResults;
private Boolean initiatedBreastfeeding;
private LocalDate breastfeedingDate;
private String placeOfDelivery;

    // ===== Relationships =====

    // 1:1 lifestyle row per patient :contentReference[oaicite:11]{index=11}
    @OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
private PhysicalExam physicalExam;

@OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
private PersonalSocialHistory personalSocialHistory;

@OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
private MaternalRecord maternalRecord;

@OneToOne(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
private PatientImmunizationStatus immunizationStatus;



    // ===== Getters/Setters (short version; generate in IDE if you want) =====

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleInitial() { return middleInitial; }
    public void setMiddleInitial(String middleInitial) { this.middleInitial = middleInitial; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Integer getAgeMonths() { return ageMonths; }
    public void setAgeMonths(Integer ageMonths) { this.ageMonths = ageMonths; }

    public String getSex() { return sex; }
    public void setSex(String sex) { this.sex = sex; }

    public LocalDate getBirthday() { return birthday; }
    public void setBirthday(LocalDate birthday) { this.birthday = birthday; }

    public String getReligion() { return religion; }
    public void setReligion(String religion) { this.religion = religion; }

    public String getCivilStatus() { return civilStatus; }
    public void setCivilStatus(String civilStatus) { this.civilStatus = civilStatus; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getEducationalAttainment() { return educationalAttainment; }
    public void setEducationalAttainment(String educationalAttainment) { this.educationalAttainment = educationalAttainment; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getSpouseName() { return spouseName; }
    public void setSpouseName(String spouseName) { this.spouseName = spouseName; }

    public String getSpouseOccupation() { return spouseOccupation; }
    public void setSpouseOccupation(String spouseOccupation) { this.spouseOccupation = spouseOccupation; }

    public String getSpouseContact() { return spouseContact; }
    public void setSpouseContact(String spouseContact) { this.spouseContact = spouseContact; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getPurok() { return purok; }
    public void setPurok(String purok) { this.purok = purok; }

    public String getBarangay() { return barangay; }
    public void setBarangay(String barangay) { this.barangay = barangay; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getProgram() { return program; }
    public void setProgram(String program) { this.program = program; }

    public Boolean getFamilyPlanning() { return familyPlanning; }
    public void setFamilyPlanning(Boolean familyPlanning) { this.familyPlanning = familyPlanning; }

    public Boolean getVitamins() { return vitamins; }
    public void setVitamins(Boolean vitamins) { this.vitamins = vitamins; }

    public Integer getChildren() { return children; }
    public void setChildren(Integer children) { this.children = children; }

    public String getCoMorbidities() { return coMorbidities; }
    public void setCoMorbidities(String coMorbidities) { this.coMorbidities = coMorbidities; }

    public String getCancer() { return cancer; }
    public void setCancer(String cancer) { this.cancer = cancer; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getMaintenanceMedication() { return maintenanceMedication; }
    public void setMaintenanceMedication(String maintenanceMedication) { this.maintenanceMedication = maintenanceMedication; }

    public String getPreviousIllnesses() { return previousIllnesses; }
    public void setPreviousIllnesses(String previousIllnesses) { this.previousIllnesses = previousIllnesses; }

    public LocalDate getLastVisit() { return lastVisit; }
    public void setLastVisit(LocalDate lastVisit) { this.lastVisit = lastVisit; }

    public String getBloodPressure() { return bloodPressure; }
    public void setBloodPressure(String bloodPressure) { this.bloodPressure = bloodPressure; }

    public String getWeight() { return weight; }
    public void setWeight(String weight) { this.weight = weight; }

    public String getHeight() { return height; }
    public void setHeight(String height) { this.height = height; }

    public String getBcgVaccine() { return bcgVaccine; }
    public void setBcgVaccine(String bcgVaccine) { this.bcgVaccine = bcgVaccine; }

    public String getHepBVaccine() { return hepBVaccine; }
    public void setHepBVaccine(String hepBVaccine) { this.hepBVaccine = hepBVaccine; }

    public String getVitaminK() { return vitaminK; }
    public void setVitaminK(String vitaminK) { this.vitaminK = vitaminK; }

    public List<String> getFamilyHistoryConditions() { return familyHistoryConditions; }
public void setFamilyHistoryConditions(List<String> familyHistoryConditions) { this.familyHistoryConditions = familyHistoryConditions; }
    
    public String getFamilyHistoryOther() { return familyHistoryOther; }
    public void setFamilyHistoryOther(String familyHistoryOther) { this.familyHistoryOther = familyHistoryOther; }

    public String getFamilyHistoryMother() { return familyHistoryMother; }
    public void setFamilyHistoryMother(String familyHistoryMother) { this.familyHistoryMother = familyHistoryMother; }

    public Boolean getIsArchived() { return isArchived; }
    public void setIsArchived(Boolean archived) { isArchived = archived; }

    public LocalDateTime getArchivedAt() { return archivedAt; }
    public void setArchivedAt(LocalDateTime archivedAt) { this.archivedAt = archivedAt; }

    public PersonalSocialHistory getPersonalSocialHistory() { return personalSocialHistory; }
    public void setPersonalSocialHistory(PersonalSocialHistory personalSocialHistory) {
    this.personalSocialHistory = personalSocialHistory;
    if (personalSocialHistory != null) {
        personalSocialHistory.setPatient(this);// IMPORTANT
    }
    }

    public PhysicalExam getPhysicalExam() { return physicalExam; }
    public void setPhysicalExam(PhysicalExam physicalExam) {
    this.physicalExam = physicalExam;
    if (physicalExam != null) {
        physicalExam.setPatient(this); // IMPORTANT
    }

}

public PatientImmunizationStatus getImmunizationStatus() {
    return immunizationStatus;
}

public void setImmunizationStatus(PatientImmunizationStatus immunizationStatus) {
    this.immunizationStatus = immunizationStatus;
    if (immunizationStatus != null) {
        immunizationStatus.setPatient(this);
    }
}

@OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
@JsonManagedReference
private List<ProgramInformation> programsInformation = new ArrayList<>();

public List<ProgramInformation> getProgramsInformation() {
    return programsInformation;
}

public void setProgramsInformation(List<ProgramInformation> programsInformation) {
    this.programsInformation = programsInformation != null ? programsInformation : new ArrayList<>();
    for (ProgramInformation info : this.programsInformation) {
        info.setPatient(this);
    }
}

public String getTypeOfDelivery() { return typeOfDelivery; }
public void setTypeOfDelivery(String typeOfDelivery) { this.typeOfDelivery = typeOfDelivery; }

public String getBirthWeight() { return birthWeight; }
public void setBirthWeight(String birthWeight) { this.birthWeight = birthWeight; }

public String getBirthHeight() { return birthHeight; }
public void setBirthHeight(String birthHeight) { this.birthHeight = birthHeight; }

public String getBcgDate() { return bcgDate; }
public void setBcgDate(String bcgDate) { this.bcgDate = bcgDate; }

public String getHepBDate() { return hepBDate; }
public void setHepBDate(String hepBDate) { this.hepBDate = hepBDate; }

public String getVitaminKDate() { return vitaminKDate; }
public void setVitaminKDate(String vitaminKDate) { this.vitaminKDate = vitaminKDate; }

public String getMotherTetanusShots() { return motherTetanusShots; }
public void setMotherTetanusShots(String motherTetanusShots) { this.motherTetanusShots = motherTetanusShots; }

public Boolean getNewbornScreening() { return newbornScreening; }
public void setNewbornScreening(Boolean newbornScreening) { this.newbornScreening = newbornScreening; }

public LocalDate getScreeningDate() { return screeningDate; }
public void setScreeningDate(LocalDate screeningDate) { this.screeningDate = screeningDate; }

public String getScreeningResults() { return screeningResults; }
public void setScreeningResults(String screeningResults) { this.screeningResults = screeningResults; }

public Boolean getInitiatedBreastfeeding() { return initiatedBreastfeeding; }
public void setInitiatedBreastfeeding(Boolean initiatedBreastfeeding) { this.initiatedBreastfeeding = initiatedBreastfeeding; }

public LocalDate getBreastfeedingDate() { return breastfeedingDate; }
public void setBreastfeedingDate(LocalDate breastfeedingDate) { this.breastfeedingDate = breastfeedingDate; }

public String getPlaceOfDelivery() { return placeOfDelivery; }
public void setPlaceOfDelivery(String placeOfDelivery) { this.placeOfDelivery = placeOfDelivery; }



public MaternalRecord getMaternalRecord() { return maternalRecord; }

public void setMaternalRecord(MaternalRecord maternalRecord) {
    this.maternalRecord = maternalRecord;
    if (maternalRecord != null) {
        maternalRecord.setPatient(this);
    }
}

public LocalDateTime getCreatedAt() { return createdAt; }
public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

}
