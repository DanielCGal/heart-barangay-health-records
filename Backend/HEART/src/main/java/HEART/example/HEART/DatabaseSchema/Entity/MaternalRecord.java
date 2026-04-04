package HEART.example.HEART.DatabaseSchema.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "maternal_records")
public class MaternalRecord {

    @Id
    @Column(name = "patient_id")
    private Long patientId;

    @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "patient_id")
    private Patient patient;

    // OB HISTORY :contentReference[oaicite:14]{index=14}
    private Integer gravida;
    private Integer para;
    private Integer fullTerm;
    private Integer preterm;
    private Integer abortion;
    private Integer living;

    // MENSTRUAL :contentReference[oaicite:15]{index=15}
    private Integer menarcheAge;
    private String menstrualCycle;
    private Integer menstrualFlowDays;
    private Integer coitarcheAge;

    // FAMILY PLANNING :contentReference[oaicite:16]{index=16}
    private String currentFpMethod;

    // SCREENING :contentReference[oaicite:17]{index=17}
    private Boolean papSmear;
    @Column(columnDefinition = "TEXT")
private String papSmearDate;
    private String papSmearResult;

    private Boolean via;
    @Column(columnDefinition = "TEXT")
private String viaDate;
    private String viaResult;

    private Boolean historyOfSti;
    @Column(columnDefinition = "TEXT")
private String stiDate;
    private String stiResult;

    // RISK :contentReference[oaicite:18]{index=18}
    private String riskCode;
    private Boolean motherBabyBook;

    // CURRENT PREGNANCY :contentReference[oaicite:19]{index=19}
   @Column(columnDefinition = "TEXT")
private String lmp;

@Column(columnDefinition = "TEXT")
private String edd;
    private String planToDeliverAt;
    private String ageOfGestation;
    private String accompanyingPerson;

    // DENTAL/PHYSICIAN :contentReference[oaicite:20]{index=20}
    private Boolean seenByDentist;
    @Column(columnDefinition = "TEXT")
private String dentistDate;
    private Integer dentistVisit1;
    private Integer dentistVisit2;
    private Integer dentistVisit3;

    private Boolean seenByPhysician;
    @Column(columnDefinition = "TEXT")
private String physicianDate;
    private Integer physicianVisit1;
    private Integer physicianVisit2;
    private Integer physicianVisit3;

    // TT VACCINE (Month YYYY) :contentReference[oaicite:21]{index=21}
    private String tt1;
    private String tt2;
    private String tt3;
    private String tt4;
    private String tt5;

    // SUPPLEMENTS :contentReference[oaicite:22]{index=22}
    private Boolean iodizedSalt;
    private Boolean ironSupplement;

    // PRENATAL LABS
private String bloodType;
@Column(columnDefinition = "TEXT")
private String bloodTypeDate;

private String fbsRbsHba1c;
@Column(columnDefinition = "TEXT")
private String fbsRbsHba1cDate;

private String hbsag;
@Column(columnDefinition = "TEXT")
private String hbsagDate;

private String hemoglobinPrenatal;
@Column(columnDefinition = "TEXT")
private String hemoglobinPrenatalDate;

private String hiv;
@Column(columnDefinition = "TEXT")
private String hivDate;

private String syphilis;
@Column(columnDefinition = "TEXT")
private String syphilisDate;

private String tuberculosis;
@Column(columnDefinition = "TEXT")
private String tuberculosisDate;

private String urinalysisPrenatal;
@Column(columnDefinition = "TEXT")
private String urinalysisPrenatalDate;

private String otherTestsPrenatal;
@Column(columnDefinition = "TEXT")
private String otherTestsPrenatalDate;

// POSTNATAL CARE
@Column(columnDefinition = "TEXT")
private String dateOfDelivery;

private String postnatalPlaceOfDelivery;
private String typeOfDelivery;
private String outcomeOfPregnancy;
private String attendedBy;
private String complications;
private String sexOfNewborn;
private String birthweight;

private Boolean hemoglobinDone;
private String hemoglobinPostnatal;
@Column(columnDefinition = "TEXT")
private String hemoglobinPostnatalDate;

private Boolean vitaminA;
@Column(columnDefinition = "TEXT")
private String vitaminADate;

private Boolean breastfeeding;
@Column(columnDefinition = "TEXT")
private String breastfeedingDateInitiated;

private Boolean counseling;
@Column(columnDefinition = "TEXT")
private String counselingDate;

private Boolean dentistPostnatalYes;
private Integer dentistPostnatalVisits1;
private Integer dentistPostnatalVisits2;
private Integer dentistPostnatalVisits3;

private Boolean physicianPostnatalYes;
private Integer physicianPostnatalVisits1;
private Integer physicianPostnatalVisits2;
private Integer physicianPostnatalVisits3;

// POSTNATAL LABS
private String bloodTypePostnatal;
@Column(columnDefinition = "TEXT")
private String bloodTypePostnatalDate;

private String fbsRbsHba1cPostnatal;
@Column(columnDefinition = "TEXT")
private String fbsRbsHba1cPostnatalDate;

private String hbsagPostnatal;
@Column(columnDefinition = "TEXT")
private String hbsagPostnatalDate;

private String hemoglobinLabPostnatal;
@Column(columnDefinition = "TEXT")
private String hemoglobinLabPostnatalDate;

private String hivPostnatal;
@Column(columnDefinition = "TEXT")
private String hivPostnatalDate;

private String syphilisPostnatal;
@Column(columnDefinition = "TEXT")
private String syphilisPostnatalDate;

private String tuberculosisPostnatal;
@Column(columnDefinition = "TEXT")
private String tuberculosisPostnatalDate;

private String urinalysisPostnatal;
@Column(columnDefinition = "TEXT")
private String urinalysisPostnatalDate;

private String otherTestsPostnatal;
@Column(columnDefinition = "TEXT")
private String otherTestsPostnatalDate;

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Integer getGravida() { return gravida; }
    public void setGravida(Integer gravida) { this.gravida = gravida; } 

    public Integer getPara() { return para; }
    public void setPara(Integer para) { this.para = para; } 

    public Integer getFullTerm() { return fullTerm; }
    public void setFullTerm(Integer fullTerm) { this.fullTerm = fullTerm; } 

    public Integer getPreterm() { return preterm; }
    public void setPreterm(Integer preterm) { this.preterm = preterm; } 

    public Integer getAbortion() { return abortion; }
    public void setAbortion(Integer abortion) { this.abortion = abortion; } 

    public Integer getLiving() { return living; }
    public void setLiving(Integer living) { this.living = living; } 

    public Integer getMenarcheAge() { return menarcheAge; }
    public void setMenarcheAge(Integer menarcheAge) { this.menarcheAge = menarcheAge; }

    public String getMenstrualCycle() { return menstrualCycle; }
    public void setMenstrualCycle(String menstrualCycle) { this.menstrualCycle = menstrualCycle; }

    public Integer getMenstrualFlowDays() { return menstrualFlowDays; }
    public void setMenstrualFlowDays(Integer menstrualFlowDays) { this.menstrualFlowDays = menstrualFlowDays; }

    public Integer getCoitarcheAge() { return coitarcheAge; }
    public void setCoitarcheAge(Integer coitarcheAge) { this.coitarcheAge = coitarcheAge; }

    public String getCurrentFpMethod() { return currentFpMethod; }
    public void setCurrentFpMethod(String currentFpMethod) { this.currentFpMethod = currentFpMethod; }

    public Boolean getPapSmear() { return papSmear; }
    public void setPapSmear(Boolean papSmear) { this.papSmear = papSmear; }

    public String getPapSmearDate() { return papSmearDate; }
    public void setPapSmearDate(String papSmearDate) { this.papSmearDate = papSmearDate; }

    public String getPapSmearResult() { return papSmearResult; }
    public void setPapSmearResult(String papSmearResult) { this.papSmearResult = papSmearResult; }

    public Boolean getVia() { return via; }
    public void setVia(Boolean via) { this.via = via; }

    public String getViaDate() { return viaDate; }
    public void setViaDate(String viaDate) { this.viaDate = viaDate; }

    public String getViaResult() { return viaResult; }
    public void setViaResult(String viaResult) { this.viaResult = viaResult;}

    public Boolean getHistoryOfSti() { return historyOfSti; }
    public void setHistoryOfSti(Boolean historyOfSti) { this.historyOfSti = historyOfSti; }

    public String getStiDate() { return stiDate; }
    public void setStiDate(String stiDate) { this.stiDate = stiDate; }

    public String getStiResult() { return stiResult; }
    public void setStiResult(String stiResult) { this.stiResult = stiResult; }

    public String getRiskCode() { return riskCode; }
    public void setRiskCode(String riskCode) { this.riskCode = riskCode;}

    public Boolean getMotherBabyBook() { return motherBabyBook; }
    public void setMotherBabyBook(Boolean motherBabyBook) { this.motherBabyBook = motherBabyBook; }

    public String getLmp() { return lmp; }
    public void setLmp(String lmp) { this.lmp = lmp;}

    public String getEdd() { return edd; }
    public void setEdd(String edd) { this.edd = edd;}

    public String getPlanToDeliverAt() { return planToDeliverAt; }
    public void setPlanToDeliverAt(String planToDeliverAt) { this.planToDeliverAt = planToDeliverAt; }

    public String getAgeOfGestation() { return ageOfGestation; }
    public void setAgeOfGestation(String ageOfGestation) { this.ageOfGestation = ageOfGestation; }

    public String getAccompanyingPerson() { return accompanyingPerson; }
    public void setAccompanyingPerson(String accompanyingPerson) { this.accompanyingPerson = accompanyingPerson; }

    public Boolean getSeenByDentist() { return seenByDentist; }
    public void setSeenByDentist(Boolean seenByDentist) { this.seenByDentist = seenByDentist; }

    public String getDentistDate() { return dentistDate; }
    public void setDentistDate(String dentistDate) { this.dentistDate = dentistDate; }

    public Integer getDentistVisit1() { return dentistVisit1; }
    public void setDentistVisit1(Integer dentistVisit1) { this.dentistVisit1 = dentistVisit1; }

    public Integer getDentistVisit2() { return dentistVisit2; }
    public void setDentistVisit2(Integer dentistVisit2) { this.dentistVisit2 = dentistVisit2; }

    public Integer getDentistVisit3() { return dentistVisit3; }
    public void setDentistVisit3(Integer dentistVisit3) { this.dentistVisit3 = dentistVisit3; }

    public Boolean getSeenByPhysician() { return seenByPhysician; }
    public void setSeenByPhysician(Boolean seenByPhysician) { this.seenByPhysician = seenByPhysician; }

    public String getPhysicianDate() { return physicianDate; }
    public void setPhysicianDate(String physicianDate) { this.physicianDate = physicianDate; }

    public Integer getPhysicianVisit1() { return physicianVisit1; }
    public void setPhysicianVisit1(Integer physicianVisit1) { this.physicianVisit1 = physicianVisit1; }

    public Integer getPhysicianVisit2() { return physicianVisit2; }
    public void setPhysicianVisit2(Integer physicianVisit2) { this.physicianVisit2 = physicianVisit2; }

    public Integer getPhysicianVisit3() { return physicianVisit3; }
    public void setPhysicianVisit3(Integer physicianVisit3) { this.physicianVisit3 = physicianVisit3; }

    public String getTt1() { return tt1; }
    public void setTt1(String tt1) { this.tt1 = tt1;}

    public String getTt2() { return tt2; }
    public void setTt2(String tt2) { this.tt2 = tt2;}

    public String getTt3() { return tt3; }
    public void setTt3(String tt3) { this.tt3 = tt3;}

    public String getTt4() { return tt4; }
    public void setTt4(String tt4) { this.tt4 = tt4;}

    public String getTt5() { return tt5; }
    public void setTt5(String tt5) { this.tt5 = tt5;}
    public Boolean getIodizedSalt() { return iodizedSalt; }
public void setIodizedSalt(Boolean iodizedSalt) { this.iodizedSalt = iodizedSalt; }

public Boolean getIronSupplement() { return ironSupplement; }
public void setIronSupplement(Boolean ironSupplement) { this.ironSupplement = ironSupplement; }

public String getBloodType() { return bloodType; }
public void setBloodType(String bloodType) { this.bloodType = bloodType; }

public String getBloodTypeDate() { return bloodTypeDate; }
public void setBloodTypeDate(String bloodTypeDate) { this.bloodTypeDate = bloodTypeDate; }

public String getFbsRbsHba1c() { return fbsRbsHba1c; }
public void setFbsRbsHba1c(String fbsRbsHba1c) { this.fbsRbsHba1c = fbsRbsHba1c; }

public String getFbsRbsHba1cDate() { return fbsRbsHba1cDate; }
public void setFbsRbsHba1cDate(String fbsRbsHba1cDate) { this.fbsRbsHba1cDate = fbsRbsHba1cDate; }

public String getHbsag() { return hbsag; }
public void setHbsag(String hbsag) { this.hbsag = hbsag; }

public String getHbsagDate() { return hbsagDate; }
public void setHbsagDate(String hbsagDate) { this.hbsagDate = hbsagDate; }

public String getHemoglobinPrenatal() { return hemoglobinPrenatal; }
public void setHemoglobinPrenatal(String hemoglobinPrenatal) { this.hemoglobinPrenatal = hemoglobinPrenatal; }

public String getHemoglobinPrenatalDate() { return hemoglobinPrenatalDate; }
public void setHemoglobinPrenatalDate(String hemoglobinPrenatalDate) { this.hemoglobinPrenatalDate = hemoglobinPrenatalDate; }

public String getHiv() { return hiv; }
public void setHiv(String hiv) { this.hiv = hiv; }

public String getHivDate() { return hivDate; }
public void setHivDate(String hivDate) { this.hivDate = hivDate;}

public String getSyphilis() { return syphilis; }
public void setSyphilis(String syphilis) { this.syphilis = syphilis; }

public String getSyphilisDate() { return syphilisDate; }
public void setSyphilisDate(String syphilisDate) { this.syphilisDate = syphilisDate; }

public String getTuberculosis() { return tuberculosis; }
public void setTuberculosis(String tuberculosis) { this.tuberculosis = tuberculosis; }

public String getTuberculosisDate() { return tuberculosisDate; }
public void setTuberculosisDate(String tuberculosisDate) { this.tuberculosisDate = tuberculosisDate; }

public String getUrinalysisPrenatal() { return urinalysisPrenatal; }
public void setUrinalysisPrenatal(String urinalysisPrenatal) { this.urinalysisPrenatal = urinalysisPrenatal; }

public String getUrinalysisPrenatalDate() { return urinalysisPrenatalDate; }
public void setUrinalysisPrenatalDate(String urinalysisPrenatalDate) { this.urinalysisPrenatalDate = urinalysisPrenatalDate; }

public String getOtherTestsPrenatal() { return otherTestsPrenatal; }
public void setOtherTestsPrenatal(String otherTestsPrenatal) { this.otherTestsPrenatal = otherTestsPrenatal; }

public String getOtherTestsPrenatalDate() { return otherTestsPrenatalDate; }
public void setOtherTestsPrenatalDate(String otherTestsPrenatalDate) { this.otherTestsPrenatalDate = otherTestsPrenatalDate; }

public String getDateOfDelivery() { return dateOfDelivery; }
public void setDateOfDelivery(String dateOfDelivery) { this.dateOfDelivery = dateOfDelivery; }

public String getPostnatalPlaceOfDelivery() { return postnatalPlaceOfDelivery; }
public void setPostnatalPlaceOfDelivery(String postnatalPlaceOfDelivery) { this.postnatalPlaceOfDelivery = postnatalPlaceOfDelivery; }

public String getTypeOfDelivery() { return typeOfDelivery; }
public void setTypeOfDelivery(String typeOfDelivery) { this.typeOfDelivery = typeOfDelivery; }

public String getOutcomeOfPregnancy() { return outcomeOfPregnancy; }
public void setOutcomeOfPregnancy(String outcomeOfPregnancy) { this.outcomeOfPregnancy = outcomeOfPregnancy; }

public String getAttendedBy() { return attendedBy; }
public void setAttendedBy(String attendedBy) { this.attendedBy = attendedBy; }

public String getComplications() { return complications; }
public void setComplications(String complications) { this.complications = complications; }

public String getSexOfNewborn() { return sexOfNewborn; }
public void setSexOfNewborn(String sexOfNewborn) { this.sexOfNewborn = sexOfNewborn; }

public String getBirthweight() { return birthweight; }
public void setBirthweight(String birthweight) { this.birthweight = birthweight; }

public Boolean getHemoglobinDone() { return hemoglobinDone; }
public void setHemoglobinDone(Boolean hemoglobinDone) { this.hemoglobinDone = hemoglobinDone; }

public String getHemoglobinPostnatal() { return hemoglobinPostnatal; }
public void setHemoglobinPostnatal(String hemoglobinPostnatal) { this.hemoglobinPostnatal = hemoglobinPostnatal; }

public String getHemoglobinPostnatalDate() { return hemoglobinPostnatalDate; }
public void setHemoglobinPostnatalDate(String hemoglobinPostnatalDate) { this.hemoglobinPostnatalDate = hemoglobinPostnatalDate; }

public Boolean getVitaminA() { return vitaminA; }
public void setVitaminA(Boolean vitaminA) { this.vitaminA = vitaminA;}

public String getVitaminADate() { return vitaminADate; }
public void setVitaminADate(String vitaminADate) { this.vitaminADate = vitaminADate; }

public Boolean getBreastfeeding() { return breastfeeding; }
public void setBreastfeeding(Boolean breastfeeding) { this.breastfeeding = breastfeeding; }

public String getBreastfeedingDateInitiated() { return breastfeedingDateInitiated; }
public void setBreastfeedingDateInitiated(String breastfeedingDateInitiated) { this.breastfeedingDateInitiated = breastfeedingDateInitiated; }

public Boolean getCounseling() { return counseling; }
public void setCounseling(Boolean counseling) { this.counseling = counseling; }

public String getCounselingDate() { return counselingDate; }
public void setCounselingDate(String counselingDate) { this.counselingDate = counselingDate; }

public Boolean getDentistPostnatalYes() { return dentistPostnatalYes; }
public void setDentistPostnatalYes(Boolean dentistPostnatalYes) { this.dentistPostnatalYes = dentistPostnatalYes; }

public Integer getDentistPostnatalVisits1() { return dentistPostnatalVisits1; }
public void setDentistPostnatalVisits1(Integer dentistPostnatalVisits1) { this.dentistPostnatalVisits1 = dentistPostnatalVisits1; }

public Integer getDentistPostnatalVisits2() { return dentistPostnatalVisits2; }
public void setDentistPostnatalVisits2(Integer dentistPostnatalVisits2) { this.dentistPostnatalVisits2 = dentistPostnatalVisits2; }

public Integer getDentistPostnatalVisits3() { return dentistPostnatalVisits3; }
public void setDentistPostnatalVisits3(Integer dentistPostnatalVisits3) { this.dentistPostnatalVisits3 = dentistPostnatalVisits3; }

public Boolean getPhysicianPostnatalYes() { return physicianPostnatalYes; }
public void setPhysicianPostnatalYes(Boolean physicianPostnatalYes) { this.physicianPostnatalYes = physicianPostnatalYes; }

public Integer getPhysicianPostnatalVisits1() { return physicianPostnatalVisits1; }
public void setPhysicianPostnatalVisits1(Integer physicianPostnatalVisits1) { this.physicianPostnatalVisits1 = physicianPostnatalVisits1; }

public Integer getPhysicianPostnatalVisits2() { return physicianPostnatalVisits2; }
public void setPhysicianPostnatalVisits2(Integer physicianPostnatalVisits2) { this.physicianPostnatalVisits2 = physicianPostnatalVisits2; }

public Integer getPhysicianPostnatalVisits3() { return physicianPostnatalVisits3; }
public void setPhysicianPostnatalVisits3(Integer physicianPostnatalVisits3) { this.physicianPostnatalVisits3 = physicianPostnatalVisits3; }

public String getBloodTypePostnatal() { return bloodTypePostnatal; }
public void setBloodTypePostnatal(String bloodTypePostnatal) { this.bloodTypePostnatal = bloodTypePostnatal; }

public String getBloodTypePostnatalDate() { return bloodTypePostnatalDate; }
public void setBloodTypePostnatalDate(String bloodTypePostnatalDate) { this.bloodTypePostnatalDate = bloodTypePostnatalDate; }

public String getFbsRbsHba1cPostnatal() { return fbsRbsHba1cPostnatal; }
public void setFbsRbsHba1cPostnatal(String fbsRbsHba1cPostnatal) { this.fbsRbsHba1cPostnatal = fbsRbsHba1cPostnatal; }

public String getFbsRbsHba1cPostnatalDate() { return fbsRbsHba1cPostnatalDate; }
public void setFbsRbsHba1cPostnatalDate(String fbsRbsHba1cPostnatalDate) { this.fbsRbsHba1cPostnatalDate = fbsRbsHba1cPostnatalDate; }

public String getHbsagPostnatal() { return hbsagPostnatal; }
public void setHbsagPostnatal(String hbsagPostnatal) { this.hbsagPostnatal = hbsagPostnatal; }

public String getHbsagPostnatalDate() { return hbsagPostnatalDate; }
public void setHbsagPostnatalDate(String hbsagPostnatalDate) { this.hbsagPostnatalDate = hbsagPostnatalDate; }

public String getHemoglobinLabPostnatal() { return hemoglobinLabPostnatal; }
public void setHemoglobinLabPostnatal(String hemoglobinLabPostnatal) { this.hemoglobinLabPostnatal = hemoglobinLabPostnatal; }

public String getHemoglobinLabPostnatalDate() { return hemoglobinLabPostnatalDate; }
public void setHemoglobinLabPostnatalDate(String hemoglobinLabPostnatalDate) { this.hemoglobinLabPostnatalDate = hemoglobinLabPostnatalDate; }

public String getHivPostnatal() { return hivPostnatal; }
public void setHivPostnatal(String hivPostnatal) { this.hivPostnatal = hivPostnatal; }

public String getHivPostnatalDate() { return hivPostnatalDate; }
public void setHivPostnatalDate(String hivPostnatalDate) { this.hivPostnatalDate = hivPostnatalDate; }

public String getSyphilisPostnatal() { return syphilisPostnatal; }
public void setSyphilisPostnatal(String syphilisPostnatal) { this.syphilisPostnatal = syphilisPostnatal; }

public String getSyphilisPostnatalDate() { return syphilisPostnatalDate; }
public void setSyphilisPostnatalDate(String syphilisPostnatalDate) { this.syphilisPostnatalDate = syphilisPostnatalDate; }  

public String getTuberculosisPostnatal() { return tuberculosisPostnatal; }
public void setTuberculosisPostnatal(String tuberculosisPostnatal) { this.tuberculosisPostnatal = tuberculosisPostnatal; }

public String getTuberculosisPostnatalDate() { return tuberculosisPostnatalDate; }
public void setTuberculosisPostnatalDate(String tuberculosisPostnatalDate) { this.tuberculosisPostnatalDate = tuberculosisPostnatalDate; }

public String getUrinalysisPostnatal() { return urinalysisPostnatal; }
public void setUrinalysisPostnatal(String urinalysisPostnatal) { this.urinalysisPostnatal = urinalysisPostnatal; }

public String getUrinalysisPostnatalDate() { return urinalysisPostnatalDate; }
public void setUrinalysisPostnatalDate(String urinalysisPostnatalDate) { this.urinalysisPostnatalDate = urinalysisPostnatalDate; }

public String getOtherTestsPostnatal() { return otherTestsPostnatal; }
public void setOtherTestsPostnatal(String otherTestsPostnatal) { this.otherTestsPostnatal = otherTestsPostnatal; }

public String getOtherTestsPostnatalDate() { return otherTestsPostnatalDate; }
public void setOtherTestsPostnatalDate(String otherTestsPostnatalDate) { this.otherTestsPostnatalDate = otherTestsPostnatalDate; }




}
