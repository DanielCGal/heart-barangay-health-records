package HEART.example.HEART.Controllers;

import java.util.HashMap;
import java.util.Map;



public class ProgramInformationDTO {
    private String programName;
    private Map<String, Object> details = new HashMap<>();

    public String getProgramName() { return programName; }
    public void setProgramName(String programName) { this.programName = programName; }

    public Map<String, Object> getDetails() { return details; }
    public void setDetails(Map<String, Object> details) { this.details = details; }
}