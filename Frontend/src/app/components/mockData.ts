export type TriOption = "YES" | "NO" | "N/A";

export interface PersonalSocialHistory {
  eatsHealthyDiet: boolean;
  adequatePhysicalActivity: boolean;
  sufficientRestSleep: boolean;
  normalGrowthDevelopment: boolean;
  multiplePartners: boolean;
  smokesTobacco: boolean;
  tobaccoPacksPerYear: number;
  drinksAlcohol: boolean;
  alcoholBottlesPerYear: number;
  takesIllegalDrugs: boolean;
  illegalDrugsSpecify: string;
  livesWithImmediateFamily?: boolean;
uneventfulBirthAndInfancy?: boolean;
normalMoodsAndAttitudes?: boolean;
normalInterestInFamilyAndFriends?: boolean;
normalInterestInWorkAndPlay?: boolean;
socialOther?: string;
}

export interface PhysicalExamFindings {
  essentiallyNormal: boolean;
  findings: string[];
  othersSpecify: string;
}

export interface PhysicalExam {
  sheent: PhysicalExamFindings;
  chestBreastLungs: PhysicalExamFindings;
  heart: PhysicalExamFindings;
  abdomen: PhysicalExamFindings;
  genitourinary: PhysicalExamFindings;
  extremities: PhysicalExamFindings;
  neurological: PhysicalExamFindings;
}

export interface MaternalRecord {
  gravida?: number;
  para?: number;

  fullTerm: number;
  preterm: number;
  abortion: number;
  living: number;

  menarcheAge: number;
  menstrualCycle: "Regular" | "Irregular";
  menstrualFlowDays: number;
  coitarcheAge: number;
  currentFpMethod: string;

  papSmear: boolean;
  papSmearDate: string;
  papSmearResult: string;

  via: boolean;
  viaDate: string;
  viaResult: string;

  historyOfSti: boolean;
  stiDate: string;
  stiResult: string;

  riskCode: string;
  motherBabyBook: boolean;

  lmp: string;
  edd: string;
  planToDeliverAt: string;
  ageOfGestation: string;
  accompanyingPerson: string;

  seenByDentist: boolean;
  dentistDate: string;
  dentistVisit1?: number;
  dentistVisit2?: number;
  dentistVisit3?: number;

  seenByPhysician: boolean;
  physicianDate: string;
  physicianVisit1?: number;
  physicianVisit2?: number;
  physicianVisit3?: number;

  tt1: string;
  tt2: string;
  tt3: string;
  tt4: string;
  tt5: string;

  iodizedSalt: boolean;
  ironSupplement: boolean;

  bloodType?: string;
  bloodTypeDate?: string;
  fbsRbsHba1c?: string;
  fbsRbsHba1cDate?: string;
  hbsag?: string;
  hbsagDate?: string;
  hemoglobinPrenatal?: string;
  hemoglobinPrenatalDate?: string;
  hiv?: string;
  hivDate?: string;
  syphilis?: string;
  syphilisDate?: string;
  tuberculosis?: string;
  tuberculosisDate?: string;
  urinalysisPrenatal?: string;
  urinalysisPrenatalDate?: string;
  otherTestsPrenatal?: string;
  otherTestsPrenatalDate?: string;

  dateOfDelivery?: string;
  postnatalPlaceOfDelivery?: string;
  typeOfDelivery?: string;
  outcomeOfPregnancy?: string;
  attendedBy?: string;
  complications?: string;
  sexOfNewborn?: string;
  birthweight?: string;

  hemoglobinDone?: boolean;
  hemoglobinPostnatal?: string;
  hemoglobinPostnatalDate?: string;

  breastfeeding?: boolean;
  breastfeedingDateInitiated?: string;

  vitaminA?: boolean;
  vitaminADate?: string;

  counseling?: boolean;
  counselingDate?: string;

  dentistPostnatalYes?: boolean;
  dentistPostnatalVisits1?: number;
  dentistPostnatalVisits2?: number;
  dentistPostnatalVisits3?: number;

  physicianPostnatalYes?: boolean;
  physicianPostnatalVisits1?: number;
  physicianPostnatalVisits2?: number;
  physicianPostnatalVisits3?: number;

  bloodTypePostnatal?: string;
  bloodTypePostnatalDate?: string;
  fbsRbsHba1cPostnatal?: string;
  fbsRbsHba1cPostnatalDate?: string;
  hbsagPostnatal?: string;
  hbsagPostnatalDate?: string;
  hemoglobinLabPostnatal?: string;
  hemoglobinLabPostnatalDate?: string;
  hivPostnatal?: string;
  hivPostnatalDate?: string;
  syphilisPostnatal?: string;
  syphilisPostnatalDate?: string;
  tuberculosisPostnatal?: string;
  tuberculosisPostnatalDate?: string;
  urinalysisPostnatal?: string;
  urinalysisPostnatalDate?: string;
  otherTestsPostnatal?: string;
  otherTestsPostnatalDate?: string;
}

export interface Patient {
  id: number;
  lastName: string;
  firstName: string;
  middleInitial: string;
  age: number;
  ageMonths: number;
  sex: "Male" | "Female";
  birthday: string;
  religion: string;
  address: string;
  barangay: string;
  city: string;
  civilStatus: string;
  contactNumber: string;
  educationalAttainment: string;
  occupation: string;
  spouseName?: string;
  spouseOccupation?: string;
  spouseContact?: string;
  purok: string;
  program: string;
  familyPlanning: boolean;
  vitamins: boolean;
  children: number;
  coMorbidities: string;
  cancer?: string;
  allergies: string;
  maintenanceMedication: string;
  previousIllnesses: string;
  lastVisit: string;
  bloodPressure: string;
  weight: string;
  height: string;
  bcgVaccine: TriOption;
  hepBVaccine: TriOption;
  vitaminK: TriOption;
  familyHistoryConditions: string[];
  familyHistoryOther: string;
  familyHistoryMother: TriOption;
  personalSocialHistory?: PersonalSocialHistory;
  physicalExam?: PhysicalExam;
  maternalRecord?: MaternalRecord;
  typeOfDelivery?: string;
birthWeight?: string;
birthHeight?: string;
bcgDate?: string;
hepBDate?: string;
vitaminKDate?: string;
motherTetanusShots?: string;
newbornScreening?: boolean;
screeningDate?: string;
screeningResults?: string;
initiatedBreastfeeding?: boolean;
breastfeedingDate?: string;
placeOfDelivery?: string;
immunizationStatus?: PatientImmunizationStatus;
programsInformation?: ProgramInformation[];
}

export interface ImmCell {
  done: boolean;
  date: string;
}

export interface PatientImmunizationStatus {
  adultImmunization?: Record<string, {
    dose1: ImmCell;
    dose2: ImmCell;
    dose3b1: ImmCell;
    dose4b2: ImmCell;
  }>;
  childImmunization?: Record<string, {
    atBirth: ImmCell;
    w6: ImmCell;
    w10: ImmCell;
    w14: ImmCell;
    m9: ImmCell;
    m12: ImmCell;
    remarks: string;
  }>;
  childNutrition?: Record<string, {
    m6: ImmCell;
    m12: ImmCell;
    m18: ImmCell;
    m24: ImmCell;
    m30: ImmCell;
    m36: ImmCell;
    m42: ImmCell;
    m48: ImmCell;
    m54: ImmCell;
    m60: ImmCell;
  }>;
}

export const mockPatients: Patient[] = [
  {
    id: 1,
    lastName: "del Rosario",
    firstName: "Juniel",
    middleInitial: "B",
    age: 32,
    ageMonths: 0,
    sex: "Female",
    birthday: "March 15, 1993",
    religion: "Roman Catholic",
    address: "Blk 5 Lot 3 Phase 1",
    barangay: "Gov. Paciano Bangoy",
    city: "Davao City",
    civilStatus: "Married",
    contactNumber: "0917-234-5678",
    educationalAttainment: "College Graduate",
    occupation: "Housewife",
    spouseName: "Juper del Rosario",
    spouseOccupation: "Driver",
    spouseContact: "0918-345-6789",
    purok: "Moordcano",
    program: "Prenatal Care",
    familyPlanning: true,
    vitamins: false,
    children: 3,
    coMorbidities: "None",
    allergies: "Penicillin",
    maintenanceMedication: "Folic Acid 5mg once daily",
    previousIllnesses: "Chickenpox (2005)",
    lastVisit: "February 14, 2026",
    bloodPressure: "110/70 mmHg",
    weight: "58 kg",
    height: "155 cm",
    bcgVaccine: "YES",
    hepBVaccine: "YES",
    vitaminK: "YES",
    familyHistoryConditions: ["Hypertension", "Diabetes"],
    familyHistoryOther: "",
    familyHistoryMother: "YES",
    personalSocialHistory: {
      eatsHealthyDiet: true,
      adequatePhysicalActivity: true,
      sufficientRestSleep: true,
      normalGrowthDevelopment: true,
      multiplePartners: false,
      smokesTobacco: false,
      tobaccoPacksPerYear: 0,
      drinksAlcohol: false,
      alcoholBottlesPerYear: 0,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
    },
    physicalExam: {
      sheent: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      chestBreastLungs: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      heart: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      abdomen: { essentiallyNormal: false, findings: ["Nausea"], othersSpecify: "" },
      genitourinary: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      extremities: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      neurological: { essentiallyNormal: true, findings: [], othersSpecify: "" },
    },
    maternalRecord: {
      gravida: 3,
  para: 3,
  fullTerm: 3,
  preterm: 0,
  abortion: 0,
  living: 3,
      menarcheAge: 13,
      menstrualCycle: "Regular",
      menstrualFlowDays: 5,
      coitarcheAge: 22,
      currentFpMethod: "Oral Contraceptive Pills",
      papSmear: true, papSmearDate: "January 10, 2025", papSmearResult: "Normal / Negative",
      via: true, viaDate: "January 10, 2025", viaResult: "Negative",
      historyOfSti: false, stiDate: "", stiResult: "",
      riskCode: "Low Risk",
      motherBabyBook: true,
      lmp: "November 20, 2025",
      edd: "August 27, 2026",
      planToDeliverAt: "Davao Medical Center",
      ageOfGestation: "12 weeks",
      accompanyingPerson: "Juper del Rosario",
      seenByDentist: true, dentistDate: "December 5, 2025",
      dentistVisit1: 1,
  dentistVisit2: 0,
  dentistVisit3: 0,
  physicianVisit1: 2,
  physicianVisit2: 0,
  physicianVisit3: 0,
      seenByPhysician: true, physicianDate: "February 14, 2026",
      tt1: "March 2021", tt2: "April 2021", tt3: "March 2022", tt4: "March 2023", tt5: "",
      iodizedSalt: true, ironSupplement: true,
    },
  },
  {
    id: 2,
    lastName: "Subin",
    firstName: "Mary Ann",
    middleInitial: "C",
    age: 27,
    ageMonths: 0,
    sex: "Female",
    birthday: "June 10, 1998",
    religion: "Roman Catholic",
    address: "Blk 2 Lot 8 Phase 2",
    barangay: "Gov. Paciano Bangoy",
    city: "Davao City",
    civilStatus: "Married",
    contactNumber: "0919-456-7890",
    educationalAttainment: "High School Graduate",
    occupation: "Housewife",
    spouseName: "John Subin",
    spouseOccupation: "Carpenter",
    spouseContact: "0920-567-8901",
    purok: "Karang",
    program: "Family Planning",
    familyPlanning: true,
    vitamins: false,
    children: 4,
    coMorbidities: "Hypertension",
    allergies: "None",
    maintenanceMedication: "Amlodipine 5mg once daily",
    previousIllnesses: "Dengue Fever (2019)",
    lastVisit: "February 20, 2026",
    bloodPressure: "130/85 mmHg",
    weight: "62 kg",
    height: "160 cm",
    bcgVaccine: "YES",
    hepBVaccine: "YES",
    vitaminK: "YES",
    familyHistoryConditions: ["Hypertension", "Cancer"],
    familyHistoryOther: "",
    familyHistoryMother: "YES",
    personalSocialHistory: {
      eatsHealthyDiet: true,
      adequatePhysicalActivity: false,
      sufficientRestSleep: true,
      normalGrowthDevelopment: true,
      multiplePartners: false,
      smokesTobacco: false,
      tobaccoPacksPerYear: 0,
      drinksAlcohol: false,
      alcoholBottlesPerYear: 0,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
    },
    physicalExam: {
      sheent: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      chestBreastLungs: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      heart: { essentiallyNormal: false, findings: ["Chest Pain"], othersSpecify: "" },
      abdomen: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      genitourinary: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      extremities: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      neurological: { essentiallyNormal: true, findings: [], othersSpecify: "" },
    },
  },
  {
    id: 3,
    lastName: "Ali",
    firstName: "Abdujideen",
    middleInitial: "M",
    age: 23,
    ageMonths: 0,
    sex: "Male",
    birthday: "September 5, 2002",
    religion: "Islam",
    address: "Sitio 3 Purok Nuts",
    barangay: "Gov. Paciano Bangoy",
    city: "Davao City",
    civilStatus: "Single",
    contactNumber: "0915-678-9012",
    educationalAttainment: "College Level",
    occupation: "Student",
    purok: "Bible Biopstam'i",
    program: "National Immunization",
    familyPlanning: false,
    vitamins: false,
    children: 0,
    coMorbidities: "Asthma",
    allergies: "Dust, Pollen",
    maintenanceMedication: "Salbutamol inhaler as needed",
    previousIllnesses: "Pneumonia (2021)",
    lastVisit: "January 28, 2026",
    bloodPressure: "120/80 mmHg",
    weight: "65 kg",
    height: "168 cm",
    bcgVaccine: "YES",
    hepBVaccine: "NO",
    vitaminK: "YES",
    familyHistoryConditions: ["Asthma/Allergies", "Lung Disease"],
    familyHistoryOther: "",
    familyHistoryMother: "N/A",
    personalSocialHistory: {
      eatsHealthyDiet: true,
      adequatePhysicalActivity: true,
      sufficientRestSleep: false,
      normalGrowthDevelopment: true,
      multiplePartners: false,
      smokesTobacco: true,
      tobaccoPacksPerYear: 1,
      drinksAlcohol: true,
      alcoholBottlesPerYear: 6,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
    },
    physicalExam: {
      sheent: { essentiallyNormal: false, findings: ["Nasal Congestion"], othersSpecify: "" },
      chestBreastLungs: { essentiallyNormal: false, findings: ["Crackles/Rales/Wheeze"], othersSpecify: "" },
      heart: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      abdomen: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      genitourinary: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      extremities: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      neurological: { essentiallyNormal: true, findings: [], othersSpecify: "" },
    },
  },
  {
    id: 4,
    lastName: "Andrada",
    firstName: "Cristopher",
    middleInitial: "L",
    age: 33,
    ageMonths: 0,
    sex: "Male",
    birthday: "April 22, 1992",
    religion: "Roman Catholic",
    address: "Purok Nuts Phase 3",
    barangay: "Gov. Paciano Bangoy",
    city: "Davao City",
    civilStatus: "Married",
    contactNumber: "0916-789-0123",
    educationalAttainment: "College Graduate",
    occupation: "Construction Worker",
    spouseName: "Ana Andrada",
    spouseOccupation: "Teacher",
    spouseContact: "0917-890-1234",
    purok: "Calcra'g",
    program: "National Tuberculosis",
    familyPlanning: false,
    vitamins: false,
    children: 3,
    coMorbidities: "Tuberculosis",
    allergies: "None",
    maintenanceMedication: "Rifampicin, Isoniazid, Pyrazinamide - daily",
    previousIllnesses: "Typhoid Fever (2018)",
    lastVisit: "February 25, 2026",
    bloodPressure: "118/76 mmHg",
    weight: "70 kg",
    height: "172 cm",
    bcgVaccine: "YES",
    hepBVaccine: "YES",
    vitaminK: "N/A",
    familyHistoryConditions: ["Lung Disease", "Hypertension"],
    familyHistoryOther: "Tuberculosis history",
    familyHistoryMother: "N/A",
    personalSocialHistory: {
      eatsHealthyDiet: false,
      adequatePhysicalActivity: true,
      sufficientRestSleep: false,
      normalGrowthDevelopment: true,
      multiplePartners: false,
      smokesTobacco: true,
      tobaccoPacksPerYear: 2,
      drinksAlcohol: true,
      alcoholBottlesPerYear: 12,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
    },
    physicalExam: {
      sheent: { essentiallyNormal: false, findings: ["Pallor/Cyanosis", "Lymphadenopathy"], othersSpecify: "" },
      chestBreastLungs: { essentiallyNormal: false, findings: ["Asymmetrical Expansion", "Chest Retraction", "Crackles/Rales/Wheeze"], othersSpecify: "" },
      heart: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      abdomen: { essentiallyNormal: false, findings: ["Anorexia"], othersSpecify: "" },
      genitourinary: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      extremities: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      neurological: { essentiallyNormal: true, findings: [], othersSpecify: "" },
    },
  },
  {
    id: 5,
    lastName: "Rojo",
    firstName: "Daisy Mae",
    middleInitial: "T",
    age: 27,
    ageMonths: 0,
    sex: "Female",
    birthday: "July 30, 1998",
    religion: "Roman Catholic",
    address: "Blk 7 Lot 12 Phase 1",
    barangay: "Gov. Paciano Bangoy",
    city: "Davao City",
    civilStatus: "Married",
    contactNumber: "0921-890-1234",
    educationalAttainment: "Vocational Graduate",
    occupation: "Dressmaker",
    spouseName: "Roberto Rojo",
    spouseOccupation: "Jeepney Driver",
    spouseContact: "0922-901-2345",
    purok: "Monahino/Karinw",
    program: "Prenatal Care",
    familyPlanning: true,
    vitamins: false,
    children: 3,
    coMorbidities: "Gestational Diabetes",
    allergies: "None",
    maintenanceMedication: "Metformin 500mg twice daily",
    previousIllnesses: "UTI (2022)",
    lastVisit: "February 18, 2026",
    bloodPressure: "115/75 mmHg",
    weight: "68 kg",
    height: "158 cm",
    bcgVaccine: "YES",
    hepBVaccine: "YES",
    vitaminK: "YES",
    familyHistoryConditions: ["Diabetes"],
    familyHistoryOther: "",
    familyHistoryMother: "YES",
    personalSocialHistory: {
      eatsHealthyDiet: true,
      adequatePhysicalActivity: true,
      sufficientRestSleep: true,
      normalGrowthDevelopment: true,
      multiplePartners: false,
      smokesTobacco: false,
      tobaccoPacksPerYear: 0,
      drinksAlcohol: false,
      alcoholBottlesPerYear: 0,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
    },
    physicalExam: {
      sheent: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      chestBreastLungs: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      heart: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      abdomen: { essentiallyNormal: false, findings: ["Nausea", "Constipation"], othersSpecify: "" },
      genitourinary: { essentiallyNormal: false, findings: ["Frequency/Urgency"], othersSpecify: "" },
      extremities: { essentiallyNormal: false, findings: ["Lymphedema"], othersSpecify: "Mild ankle edema" },
      neurological: { essentiallyNormal: true, findings: [], othersSpecify: "" },
    },
    maternalRecord: {
      gravida: 3,
  para: 3,
  fullTerm: 3,
  preterm: 0,
  abortion: 0,
  living: 3,
      menarcheAge: 12,
      menstrualCycle: "Regular",
      menstrualFlowDays: 6,
      coitarcheAge: 20,
      currentFpMethod: "Injectable Contraceptive",
      papSmear: true, papSmearDate: "March 15, 2024", papSmearResult: "Normal / Negative",
      via: false, viaDate: "", viaResult: "",
      historyOfSti: false, stiDate: "", stiResult: "",
      riskCode: "Moderate Risk (Gestational DM)",
      motherBabyBook: true,
      lmp: "October 10, 2025",
      edd: "July 17, 2026",
      planToDeliverAt: "Southern Philippines Medical Center",
      ageOfGestation: "19 weeks",
      accompanyingPerson: "Roberto Rojo",
      seenByDentist: true, dentistDate: "November 20, 2025",
      dentistVisit1: 1,
  dentistVisit2: 0,
  dentistVisit3: 0,
  physicianVisit1: 2,
  physicianVisit2: 0,
  physicianVisit3: 0,
      seenByPhysician: true, physicianDate: "February 18, 2026",
      tt1: "June 2019", tt2: "July 2019", tt3: "June 2020", tt4: "", tt5: "",
      iodizedSalt: true, ironSupplement: true,
    },
  },
  {
    id: 6,
    lastName: "Roads",
    firstName: "Miguel Maacon",
    middleInitial: "A",
    age: 27,
    ageMonths: 0,
    sex: "Male",
    birthday: "December 3, 1998",
    religion: "Protestant",
    address: "Purok Dale1 Phase 4",
    barangay: "Gov. Paciano Bangoy",
    city: "Davao City",
    civilStatus: "Single",
    contactNumber: "0923-012-3456",
    educationalAttainment: "High School Graduate",
    occupation: "Tricycle Driver",
    purok: "Dale1",
    program: "Cardiovascular Disease",
    familyPlanning: false,
    vitamins: false,
    children: 2,
    coMorbidities: "Hypertension, High Cholesterol",
    allergies: "Aspirin",
    maintenanceMedication: "Losartan 50mg once daily, Atorvastatin 20mg at bedtime",
    previousIllnesses: "Appendectomy (2020)",
    lastVisit: "February 10, 2026",
    bloodPressure: "145/92 mmHg",
    weight: "78 kg",
    height: "170 cm",
    bcgVaccine: "YES",
    hepBVaccine: "NO",
    vitaminK: "YES",
    familyHistoryConditions: ["Hypertension", "Cancer"],
    familyHistoryOther: "",
    familyHistoryMother: "N/A",
    personalSocialHistory: {
      eatsHealthyDiet: false,
      adequatePhysicalActivity: false,
      sufficientRestSleep: false,
      normalGrowthDevelopment: true,
      multiplePartners: false,
      smokesTobacco: true,
      tobaccoPacksPerYear: 3,
      drinksAlcohol: true,
      alcoholBottlesPerYear: 24,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
    },
    physicalExam: {
      sheent: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      chestBreastLungs: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      heart: { essentiallyNormal: false, findings: ["Chest Pain", "Orthopnea"], othersSpecify: "" },
      abdomen: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      genitourinary: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      extremities: { essentiallyNormal: false, findings: ["Back/Joint Pain"], othersSpecify: "" },
      neurological: { essentiallyNormal: false, findings: ["Numbness/Weakness"], othersSpecify: "" },
    },
  },
  {
    id: 7,
    lastName: "Santos",
    firstName: "Elena",
    middleInitial: "R",
    age: 45,
    ageMonths: 0,
    sex: "Female",
    birthday: "August 14, 1980",
    religion: "Roman Catholic",
    address: "Blk 1 Lot 5 Phase 2",
    barangay: "Gov. Paciano Bangoy",
    city: "Davao City",
    civilStatus: "Married",
    contactNumber: "0924-123-4567",
    educationalAttainment: "College Graduate",
    occupation: "Vendor",
    spouseName: "Pedro Santos",
    spouseOccupation: "Fisherman",
    spouseContact: "0925-234-5678",
    purok: "Moordcano",
    program: "Cardiovascular Disease",
    familyPlanning: false,
    vitamins: true,
    children: 5,
    coMorbidities: "Diabetes Mellitus Type 2, Hypertension",
    allergies: "Sulfa drugs",
    maintenanceMedication: "Metformin 1000mg twice daily, Enalapril 10mg once daily",
    previousIllnesses: "Gallbladder removal (2015), Dengue (2017)",
    lastVisit: "February 22, 2026",
    bloodPressure: "140/90 mmHg",
    weight: "72 kg",
    height: "152 cm",
    bcgVaccine: "YES",
    hepBVaccine: "YES",
    vitaminK: "YES",
    familyHistoryConditions: ["Diabetes", "Hypertension", "Dementia"],
    familyHistoryOther: "",
    familyHistoryMother: "YES",
    personalSocialHistory: {
      eatsHealthyDiet: false,
      adequatePhysicalActivity: false,
      sufficientRestSleep: true,
      normalGrowthDevelopment: true,
      multiplePartners: false,
      smokesTobacco: false,
      tobaccoPacksPerYear: 0,
      drinksAlcohol: false,
      alcoholBottlesPerYear: 0,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
    },
    physicalExam: {
      sheent: { essentiallyNormal: false, findings: ["Pallor/Cyanosis", "Poor Vision"], othersSpecify: "" },
      chestBreastLungs: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      heart: { essentiallyNormal: false, findings: ["Chest Pain"], othersSpecify: "" },
      abdomen: { essentiallyNormal: false, findings: ["Anorexia", "Nausea"], othersSpecify: "" },
      genitourinary: { essentiallyNormal: false, findings: ["Frequency/Urgency", "Dysuria/Polyuria"], othersSpecify: "" },
      extremities: { essentiallyNormal: false, findings: ["Joint Swelling", "Lymphedema"], othersSpecify: "" },
      neurological: { essentiallyNormal: false, findings: ["Numbness/Weakness", "Anxiety/Depression"], othersSpecify: "" },
    },
  },
  {
    id: 8,
    lastName: "Flores",
    firstName: "Ramon",
    middleInitial: "D",
    age: 38,
    ageMonths: 0,
    sex: "Male",
    birthday: "February 28, 1987",
    religion: "Roman Catholic",
    address: "Sitio 5 Karang",
    barangay: "Gov. Paciano Bangoy",
    city: "Davao City",
    civilStatus: "Married",
    contactNumber: "0926-345-6789",
    educationalAttainment: "College Graduate",
    occupation: "Security Guard",
    spouseName: "Liza Flores",
    spouseOccupation: "Cashier",
    spouseContact: "0927-456-7890",
    purok: "Karang",
    program: "National Tuberculosis",
    familyPlanning: false,
    vitamins: true,
    children: 2,
    coMorbidities: "Tuberculosis",
    allergies: "None",
    maintenanceMedication: "DOTS Regimen - daily",
    previousIllnesses: "Hepatitis B (2018)",
    lastVisit: "February 26, 2026",
    bloodPressure: "122/80 mmHg",
    weight: "74 kg",
    height: "175 cm",
    bcgVaccine: "YES",
    hepBVaccine: "YES",
    vitaminK: "NO",
    familyHistoryConditions: ["Lung Disease", "Mental Illness"],
    familyHistoryOther: "Heart disease",
    familyHistoryMother: "N/A",
    personalSocialHistory: {
      eatsHealthyDiet: false,
      adequatePhysicalActivity: true,
      sufficientRestSleep: false,
      normalGrowthDevelopment: true,
      multiplePartners: false,
      smokesTobacco: true,
      tobaccoPacksPerYear: 4,
      drinksAlcohol: true,
      alcoholBottlesPerYear: 18,
      takesIllegalDrugs: false,
      illegalDrugsSpecify: "",
    },
    physicalExam: {
      sheent: { essentiallyNormal: false, findings: ["Pallor/Cyanosis", "Lymphadenopathy"], othersSpecify: "" },
      chestBreastLungs: { essentiallyNormal: false, findings: ["Chest Retraction", "Crackles/Rales/Wheeze"], othersSpecify: "" },
      heart: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      abdomen: { essentiallyNormal: false, findings: ["Anorexia"], othersSpecify: "" },
      genitourinary: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      extremities: { essentiallyNormal: true, findings: [], othersSpecify: "" },
      neurological: { essentiallyNormal: false, findings: ["Anxiety/Depression"], othersSpecify: "" },
    },
  },
];

export interface LogbookEntry {
  id: number;
  username: string;
  action: string;
  patientName: string;
  timestamp: string;
}

export const mockLogbook: LogbookEntry[] = [
  { id: 1, username: "staff123", action: "Add Record", patientName: "Juniel del Rosario", timestamp: "June 19, 2022, 05:44 PM" },
  { id: 2, username: "staff123", action: "Edit Record", patientName: "Mary Ann Subin", timestamp: "June 19, 2023, 05:36 PM" },
  { id: 3, username: "staff123", action: "Edit Record", patientName: "Cristopher Andrada", timestamp: "June 19, 2022, 05:36 PM" },
  { id: 4, username: "staff123", action: "Add Record", patientName: "Juniel del Rosario", timestamp: "June 19, 2022, 05:44 PM" },
  { id: 5, username: "staff123", action: "Edit Record", patientName: "Mary Ann Subin", timestamp: "June 19, 2023, 05:36 PM" },
  { id: 6, username: "staff123", action: "Edit Record", patientName: "Cristopher Andrada", timestamp: "June 19, 2022, 05:36 PM" },
  { id: 7, username: "staff123", action: "Add Record", patientName: "Juniel del Rosario", timestamp: "June 19, 2022, 05:44 PM" },
  { id: 8, username: "staff123", action: "Edit Record", patientName: "Mary Ann Subin", timestamp: "June 19, 2023, 05:36 PM" },
  { id: 9, username: "staff123", action: "Edit Record", patientName: "Cristopher Andrada", timestamp: "June 19, 2022, 05:36 PM" },
  { id: 10, username: "admin01", action: "Add Record", patientName: "Elena Santos", timestamp: "February 22, 2026, 10:15 AM" },
  { id: 11, username: "admin01", action: "Edit Record", patientName: "Ramon Flores", timestamp: "February 26, 2026, 02:30 PM" },
  { id: 12, username: "staff456", action: "Add Record", patientName: "Daisy Mae Rojo", timestamp: "February 18, 2026, 09:00 AM" },
];

export const mockStaff: string[] = [
  "staff123",
  "staff456",
  "staff789",
  "admin01",
  "admin02",
  "nurse01",
  "nurse02",
  "midwife01",
];

export interface ArchiveEntry {
  id: number;
  patientId: number;
  lastName: string;
  firstName: string;
  middleInitial: string;
  startDatetime: string;
  endDatetime: string;
  changedBy?: string;
  changedAt?: string;
  snapshotJson?: string;
}

export interface ProgramInformation {
  id?: number;
  programName: string;
  details: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface FamilyPlanningProgramInfo {
  takeCocPills: boolean;
  cocPillsLastDateTaken: string;
  takePopPills: boolean;
  popPillsLastDateTaken: string;
  usedCondoms: boolean;
  injectables: boolean;
  iudPostpartum: boolean;
  iudInterval: boolean;
  haveImplant: boolean;
  btl: boolean;
  vasectomy: boolean;
  lam: boolean;
  knowCalendarMethod: boolean;
}

export interface CardiovascularDiseaseProgramInfo {
  takenLosartan50mg: boolean;
  losartan50mgLastDateTaken: string;
  takenLosartan100mg: boolean;
  losartan100mgLastDateTaken: string;
  takenAmlodipine10mg: boolean;
  amlodipine10mgLastDateTaken: string;
  takenAmlodipine5mg: boolean;
  amlodipine5mgLastDateTaken: string;
  takenMetformin500mg: boolean;
  metformin500mgLastDateTaken: string;
  takenAtorvastatin20mg: boolean;
  atorvastatin20mgLastDateTaken: string;
  takenAtorvastatin40mg: boolean;
  atorvastatin40mgLastDateTaken: string;
  takenMetoprolol50mg: boolean;
  metoprolol50mgLastDateTaken: string;
  takenGliclazide30mg: boolean;
  gliclazide30mgLastDateTaken: string;
}

export interface ProgramInformation {
  id?: number;
  programName: string;
  details: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}



