package HEART.example.HEART.DatabaseSchema.Entity;

import jakarta.persistence.*;

import java.util.Map;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "patient_immunization_status")
public class PatientImmunizationStatus {

    @Id
    private Long patientId;

    @JsonIgnore
    @OneToOne
    @MapsId
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> adultImmunization;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> childImmunization;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, Object> childNutrition;

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Map<String, Object> getAdultImmunization() { return adultImmunization; }
    public void setAdultImmunization(Map<String, Object> adultImmunization) { this.adultImmunization = adultImmunization; }

    public Map<String, Object> getChildImmunization() { return childImmunization; }
    public void setChildImmunization(Map<String, Object> childImmunization) { this.childImmunization = childImmunization; }

    public Map<String, Object> getChildNutrition() { return childNutrition; }
    public void setChildNutrition(Map<String, Object> childNutrition) { this.childNutrition = childNutrition; }
    
}
