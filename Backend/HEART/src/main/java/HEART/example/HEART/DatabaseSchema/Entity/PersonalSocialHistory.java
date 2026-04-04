package HEART.example.HEART.DatabaseSchema.Entity;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "personal_social_history")
public class PersonalSocialHistory {

    @Id
    private Long patientId; // use same id as patient :contentReference[oaicite:12]{index=12}

   @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "patient_id")
    private Patient patient;

    private Boolean eatsHealthyDiet;
    private Boolean adequatePhysicalActivity;
    private Boolean sufficientRestSleep;
    private Boolean normalGrowthDevelopment;
    private Boolean multiplePartners;
    private Boolean smokesTobacco;
    private Integer tobaccoPacksPerYear;
    private Boolean drinksAlcohol;
    private Integer alcoholBottlesPerYear;
    private Boolean takesIllegalDrugs;

    @Column(columnDefinition = "TEXT")
    private String illegalDrugsSpecify;

    private Boolean livesWithImmediateFamily;
private Boolean uneventfulBirthAndInfancy;
private Boolean normalMoodsAndAttitudes;
private Boolean normalInterestInFamilyAndFriends;
private Boolean normalInterestInWorkAndPlay;

@Column(columnDefinition = "TEXT")
private String socialOther;

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Boolean getEatsHealthyDiet() { return eatsHealthyDiet; }
    public void setEatsHealthyDiet(Boolean eatsHealthyDiet) { this.eatsHealthyDiet = eatsHealthyDiet; }

    public Boolean getAdequatePhysicalActivity() { return adequatePhysicalActivity; }
    public void setAdequatePhysicalActivity(Boolean adequatePhysicalActivity) { this.adequatePhysicalActivity = adequatePhysicalActivity; }

    public Boolean getSufficientRestSleep() { return sufficientRestSleep; }
    public void setSufficientRestSleep(Boolean sufficientRestSleep) { this.sufficientRestSleep = sufficientRestSleep; }

    public Boolean getNormalGrowthDevelopment() { return normalGrowthDevelopment; }
    public void setNormalGrowthDevelopment(Boolean normalGrowthDevelopment) { this.normalGrowthDevelopment = normalGrowthDevelopment; }

    public Boolean getMultiplePartners() { return multiplePartners; }
    public void setMultiplePartners(Boolean multiplePartners) { this.multiplePartners = multiplePartners; }

    public Boolean getSmokesTobacco() { return smokesTobacco; }
    public void setSmokesTobacco(Boolean smokesTobacco) { this.smokesTobacco = smokesTobacco; }

    public Integer getTobaccoPacksPerYear() { return tobaccoPacksPerYear; }
    public void setTobaccoPacksPerYear(Integer tobaccoPacksPerYear) { this.tobaccoPacksPerYear = tobaccoPacksPerYear; }

    public Boolean getDrinksAlcohol() { return drinksAlcohol; }
    public void setDrinksAlcohol(Boolean drinksAlcohol) { this.drinksAlcohol = drinksAlcohol; }

    public Integer getAlcoholBottlesPerYear() { return alcoholBottlesPerYear; }
    public void setAlcoholBottlesPerYear(Integer alcoholBottlesPerYear) { this.alcoholBottlesPerYear = alcoholBottlesPerYear; }

    public Boolean getTakesIllegalDrugs() { return takesIllegalDrugs; }
    public void setTakesIllegalDrugs(Boolean takesIllegalDrugs) { this.takesIllegalDrugs = takesIllegalDrugs; }

    public String getIllegalDrugsSpecify() { return illegalDrugsSpecify; }
    public void setIllegalDrugsSpecify(String illegalDrugsSpecify) { this.illegalDrugsSpecify = illegalDrugsSpecify; }

public Boolean getLivesWithImmediateFamily() { return livesWithImmediateFamily; }
public void setLivesWithImmediateFamily(Boolean livesWithImmediateFamily) { this.livesWithImmediateFamily = livesWithImmediateFamily; }

public Boolean getUneventfulBirthAndInfancy() { return uneventfulBirthAndInfancy; }
public void setUneventfulBirthAndInfancy(Boolean uneventfulBirthAndInfancy) { this.uneventfulBirthAndInfancy = uneventfulBirthAndInfancy; }

public Boolean getNormalMoodsAndAttitudes() { return normalMoodsAndAttitudes; }
public void setNormalMoodsAndAttitudes(Boolean normalMoodsAndAttitudes) { this.normalMoodsAndAttitudes = normalMoodsAndAttitudes; }

public Boolean getNormalInterestInFamilyAndFriends() { return normalInterestInFamilyAndFriends; }
public void setNormalInterestInFamilyAndFriends(Boolean normalInterestInFamilyAndFriends) { this.normalInterestInFamilyAndFriends = normalInterestInFamilyAndFriends; }

public Boolean getNormalInterestInWorkAndPlay() { return normalInterestInWorkAndPlay; }
public void setNormalInterestInWorkAndPlay(Boolean normalInterestInWorkAndPlay) { this.normalInterestInWorkAndPlay = normalInterestInWorkAndPlay; }

public String getSocialOther() { return socialOther; }
public void setSocialOther(String socialOther) { this.socialOther = socialOther; }

}
