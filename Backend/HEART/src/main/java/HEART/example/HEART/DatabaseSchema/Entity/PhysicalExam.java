package HEART.example.HEART.DatabaseSchema.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "physical_exam")
public class PhysicalExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // One physical exam per patient
    @OneToOne
    @JoinColumn(name = "patient_id", unique = true)
    @JsonIgnore
    private Patient patient;

    @Column(name = "exam_date")
    private LocalDate examDate;

    // ─────────────────────────────────────────────
    // Flat DB columns (stored as comma-separated text)
    // ─────────────────────────────────────────────
    @Column(name = "sheent_normal")
    private Boolean sheentNormal;

    @Column(name = "sheent_findings", columnDefinition = "text")
    private String sheentFindings;

    @Column(name = "sheent_others", columnDefinition = "text")
    private String sheentOthers;

    @Column(name = "chest_breast_lungs_normal")
    private Boolean chestBreastLungsNormal;

    @Column(name = "chest_breast_lungs_findings", columnDefinition = "text")
    private String chestBreastLungsFindings;

    @Column(name = "chest_breast_lungs_others", columnDefinition = "text")
    private String chestBreastLungsOthers;

    @Column(name = "heart_normal")
    private Boolean heartNormal;

    @Column(name = "heart_findings", columnDefinition = "text")
    private String heartFindings;

    @Column(name = "heart_others", columnDefinition = "text")
    private String heartOthers;

    @Column(name = "abdomen_normal")
    private Boolean abdomenNormal;

    @Column(name = "abdomen_findings", columnDefinition = "text")
    private String abdomenFindings;

    @Column(name = "abdomen_others", columnDefinition = "text")
    private String abdomenOthers;

    @Column(name = "genitourinary_normal")
    private Boolean genitourinaryNormal;

    @Column(name = "genitourinary_findings", columnDefinition = "text")
    private String genitourinaryFindings;

    @Column(name = "genitourinary_others", columnDefinition = "text")
    private String genitourinaryOthers;

    @Column(name = "extremities_normal")
    private Boolean extremitiesNormal;

    @Column(name = "extremities_findings", columnDefinition = "text")
    private String extremitiesFindings;

    @Column(name = "extremities_others", columnDefinition = "text")
    private String extremitiesOthers;

    @Column(name = "neurological_normal")
    private Boolean neurologicalNormal;

    @Column(name = "neurological_findings", columnDefinition = "text")
    private String neurologicalFindings;

    @Column(name = "neurological_others", columnDefinition = "text")
    private String neurologicalOthers;

    // ─────────────────────────────────────────────
    // Payload used for POST/PUT (nested frontend shape)
    // ─────────────────────────────────────────────
    public static class ExamSectionPayload {
        public Boolean essentiallyNormal;
        public List<String> findings;
        public String othersSpecify;
    }

    // ─────────────────────────────────────────────
    // POST/PUT setters: frontend nested → DB flat
    // ─────────────────────────────────────────────
    @JsonProperty("sheent")
    public void setSheentSection(ExamSectionPayload s) {
        if (s == null) return;
        this.sheentNormal = s.essentiallyNormal;
        this.sheentFindings = (s.findings == null) ? null : String.join(", ", s.findings);
        this.sheentOthers = s.othersSpecify;
    }

    @JsonProperty("chestBreastLungs")
    public void setChestBreastLungsSection(ExamSectionPayload s) {
        if (s == null) return;
        this.chestBreastLungsNormal = s.essentiallyNormal;
        this.chestBreastLungsFindings = (s.findings == null) ? null : String.join(", ", s.findings);
        this.chestBreastLungsOthers = s.othersSpecify;
    }

    @JsonProperty("heart")
    public void setHeartSection(ExamSectionPayload s) {
        if (s == null) return;
        this.heartNormal = s.essentiallyNormal;
        this.heartFindings = (s.findings == null) ? null : String.join(", ", s.findings);
        this.heartOthers = s.othersSpecify;
    }

    @JsonProperty("abdomen")
    public void setAbdomenSection(ExamSectionPayload s) {
        if (s == null) return;
        this.abdomenNormal = s.essentiallyNormal;
        this.abdomenFindings = (s.findings == null) ? null : String.join(", ", s.findings);
        this.abdomenOthers = s.othersSpecify;
    }

    @JsonProperty("genitourinary")
    public void setGenitourinarySection(ExamSectionPayload s) {
        if (s == null) return;
        this.genitourinaryNormal = s.essentiallyNormal;
        this.genitourinaryFindings = (s.findings == null) ? null : String.join(", ", s.findings);
        this.genitourinaryOthers = s.othersSpecify;
    }

    @JsonProperty("extremities")
    public void setExtremitiesSection(ExamSectionPayload s) {
        if (s == null) return;
        this.extremitiesNormal = s.essentiallyNormal;
        this.extremitiesFindings = (s.findings == null) ? null : String.join(", ", s.findings);
        this.extremitiesOthers = s.othersSpecify;
    }

    @JsonProperty("neurological")
    public void setNeurologicalSection(ExamSectionPayload s) {
        if (s == null) return;
        this.neurologicalNormal = s.essentiallyNormal;
        this.neurologicalFindings = (s.findings == null) ? null : String.join(", ", s.findings);
        this.neurologicalOthers = s.othersSpecify;
    }

    // ─────────────────────────────────────────────
    // GET response: DB flat → frontend nested
    // ─────────────────────────────────────────────
    private List<String> splitFindings(String s) {
        if (s == null || s.trim().isEmpty()) return List.of();
        return Arrays.stream(s.split(","))
                .map(String::trim)
                .filter(x -> !x.isEmpty())
                .collect(Collectors.toList());
    }

    public static class ExamSectionResponse {
        public Boolean essentiallyNormal;
        public List<String> findings;
        public String othersSpecify;

        public ExamSectionResponse(Boolean n, List<String> f, String o) {
            this.essentiallyNormal = n;
            this.findings = (f == null) ? List.of() : f;
            this.othersSpecify = (o == null) ? "" : o;
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private ExamSectionResponse buildSection(Boolean normal, String findings, String others) {
        // If the DB row is old and everything is null/empty, return null
        // so the frontend can show "No data" instead of blank.
        if (normal == null && isBlank(findings) && isBlank(others)) return null;

        return new ExamSectionResponse(
                Boolean.TRUE.equals(normal),
                splitFindings(findings),
                others
        );
    }

    @JsonProperty("sheent")
    public ExamSectionResponse getSheentSection() {
        return buildSection(this.sheentNormal, this.sheentFindings, this.sheentOthers);
    }

    @JsonProperty("chestBreastLungs")
    public ExamSectionResponse getChestBreastLungsSection() {
        return buildSection(this.chestBreastLungsNormal, this.chestBreastLungsFindings, this.chestBreastLungsOthers);
    }

    @JsonProperty("heart")
    public ExamSectionResponse getHeartSection() {
        return buildSection(this.heartNormal, this.heartFindings, this.heartOthers);
    }

    @JsonProperty("abdomen")
    public ExamSectionResponse getAbdomenSection() {
        return buildSection(this.abdomenNormal, this.abdomenFindings, this.abdomenOthers);
    }

    @JsonProperty("genitourinary")
    public ExamSectionResponse getGenitourinarySection() {
        return buildSection(this.genitourinaryNormal, this.genitourinaryFindings, this.genitourinaryOthers);
    }

    @JsonProperty("extremities")
    public ExamSectionResponse getExtremitiesSection() {
        return buildSection(this.extremitiesNormal, this.extremitiesFindings, this.extremitiesOthers);
    }

    @JsonProperty("neurological")
    public ExamSectionResponse getNeurologicalSection() {
        return buildSection(this.neurologicalNormal, this.neurologicalFindings, this.neurologicalOthers);
    }

    // ─────────────────────────────────────────────
    // Hide flat fields from JSON (so frontend only sees nested sections)
    // ─────────────────────────────────────────────
    @JsonIgnore public Boolean getSheentNormal() { return sheentNormal; }
    @JsonIgnore public String  getSheentFindings() { return sheentFindings; }
    @JsonIgnore public String  getSheentOthers() { return sheentOthers; }

    @JsonIgnore public Boolean getChestBreastLungsNormal() { return chestBreastLungsNormal; }
    @JsonIgnore public String  getChestBreastLungsFindings() { return chestBreastLungsFindings; }
    @JsonIgnore public String  getChestBreastLungsOthers() { return chestBreastLungsOthers; }

    @JsonIgnore public Boolean getHeartNormal() { return heartNormal; }
    @JsonIgnore public String  getHeartFindings() { return heartFindings; }
    @JsonIgnore public String  getHeartOthers() { return heartOthers; }

    @JsonIgnore public Boolean getAbdomenNormal() { return abdomenNormal; }
    @JsonIgnore public String  getAbdomenFindings() { return abdomenFindings; }
    @JsonIgnore public String  getAbdomenOthers() { return abdomenOthers; }

    @JsonIgnore public Boolean getGenitourinaryNormal() { return genitourinaryNormal; }
    @JsonIgnore public String  getGenitourinaryFindings() { return genitourinaryFindings; }
    @JsonIgnore public String  getGenitourinaryOthers() { return genitourinaryOthers; }

    @JsonIgnore public Boolean getExtremitiesNormal() { return extremitiesNormal; }
    @JsonIgnore public String  getExtremitiesFindings() { return extremitiesFindings; }
    @JsonIgnore public String  getExtremitiesOthers() { return extremitiesOthers; }

    @JsonIgnore public Boolean getNeurologicalNormal() { return neurologicalNormal; }
    @JsonIgnore public String  getNeurologicalFindings() { return neurologicalFindings; }
    @JsonIgnore public String  getNeurologicalOthers() { return neurologicalOthers; }

    // ─────────────────────────────────────────────
    // Basic entity getters/setters
    // ─────────────────────────────────────────────
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public LocalDate getExamDate() { return examDate; }
    public void setExamDate(LocalDate examDate) { this.examDate = examDate; }
}