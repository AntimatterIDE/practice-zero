import { defaultDocuments, emptyVitals, withChart } from "@/lib/rcm/chart";
import type { Appointment, ChartDocument, Claim, Coverage, Patient, PatientInput, RcmState } from "@/lib/rcm/types";

export const STORAGE_KEY = "practice-zero-demo";

const SAMPLE_PATIENT_ID = "pt-hale";

function swapSampleName(value: string) {
  return value
    .replaceAll("Jordan Hale", "Paul Wallace")
    .replaceAll("jordan.hale@example.com", "paul.wallace@example.com")
    .replaceAll("Good morning, Jordan", "Good morning, Paul");
}

/** Browsers that saved the demo before the rename still have Jordan Hale on the sample chart. */
export function refreshSamplePatientName(state: RcmState): RcmState {
  const patient = state.patients.find((item) => item.id === SAMPLE_PATIENT_ID);
  if (!patient) return state;
  const stale =
    patient.firstName === "Jordan" ||
    patient.lastName === "Hale" ||
    patient.preferredName === "Jordan" ||
    patient.email.toLowerCase().includes("jordan.hale") ||
    state.packets.some((packet) => packet.patientId === SAMPLE_PATIENT_ID && /jordan hale/i.test(packet.patientName)) ||
    state.visitNotes.some((note) => note.patientId === SAMPLE_PATIENT_ID && note.transcript.includes("Jordan"));
  if (!stale) return state;

  return {
    ...state,
    patients: state.patients.map((item) => {
      if (item.id !== SAMPLE_PATIENT_ID) return item;
      return {
        ...item,
        firstName: "Paul",
        lastName: "Wallace",
        preferredName: item.preferredName === "Jordan" || item.preferredName === "" ? "Paul" : item.preferredName,
        email: item.email.toLowerCase().includes("jordan") ? "paul.wallace@example.com" : item.email,
        coverages: item.coverages.map((coverage) => ({
          ...coverage,
          subscriberName: swapSampleName(coverage.subscriberName),
        })),
      };
    }),
    packets: state.packets.map((packet) => {
      if (packet.patientId !== SAMPLE_PATIENT_ID) return packet;
      return {
        ...packet,
        patientName: swapSampleName(packet.patientName),
        email: packet.email.toLowerCase().includes("jordan") ? "paul.wallace@example.com" : packet.email,
        signerName: swapSampleName(packet.signerName),
      };
    }),
    visitNotes: state.visitNotes.map((note) =>
      note.patientId === SAMPLE_PATIENT_ID
        ? { ...note, transcript: swapSampleName(note.transcript), note: swapSampleName(note.note) }
        : note,
    ),
    tasks: state.tasks.map((task) =>
      task.patientId === SAMPLE_PATIENT_ID
        ? { ...task, title: swapSampleName(task.title), detail: swapSampleName(task.detail) }
        : task,
    ),
    outbox: state.outbox.map((item) => ({
      ...item,
      to: item.to.toLowerCase().includes("jordan.hale") ? "paul.wallace@example.com" : item.to,
      body: swapSampleName(item.body),
    })),
    agentRuns: state.agentRuns.map((run) => ({
      ...run,
      title: swapSampleName(run.title),
      detail: swapSampleName(run.detail),
    })),
  };
}

/** Saved demos still name the sample hospital Northline or Northside. */
export function refreshSamplePracticeName(state: RcmState): RcmState {
  const raw = JSON.stringify(state);
  if (!/Northline|Northside/i.test(raw)) return state;
  return JSON.parse(
    raw
      .replaceAll("Northline Family Medicine", "Southeast Medical")
      .replaceAll("Northside Medical", "Southeast Medical")
      .replaceAll("Northline Medical", "Southeast Medical")
      .replaceAll("northline.example", "southeast.example")
      .replaceAll("northside.example", "southeast.example"),
  ) as RcmState;
}

export const samplePractice = {
  legalName: "Southeast Medical",
  physicianName: "Elvis Francois, MD",
  npi: "1999999984",
  taxId: "39-1842201",
  taxonomy: "207R00000X",
  phone: "401-555-0198",
  address: "410 Market Street, Suite 200, Providence, RI 02903",
  email: "office@southeast.example",
  posCode: "11",
} as const;

export const sampleStaff = [
  { id: "staff-shah", name: "Elvis Francois, MD", role: "Physician" },
  { id: "staff-pell", name: "Noah Pell", role: "Front desk" },
] as const;

const consentBody = `Southeast Medical

Consent to evaluate and treat

I agree that Southeast Medical may examine me and provide office care. That includes a history, a physical examination, and the tests and treatments the physician discusses with me. I can ask questions, and I can refuse a test or a treatment.

This consent covers office evaluation and care. It is not a consent for a procedure. If a procedure is recommended, the practice will discuss it separately.

I understand that no result is guaranteed.`;

const recordsBody = `Southeast Medical

Permission to obtain records

I allow Southeast Medical to request my records from other physicians and hospitals so the practice can treat me. I allow those offices to send that information to Southeast Medical.`;

function documents(signedConsent: boolean): ChartDocument[] {
  const slots = defaultDocuments().map((item) => {
    if (item.id === "photo-id" || item.id === "insurance-card" || item.id === "new-patient-intake") {
      return { ...item, status: "received" as const };
    }
    return item;
  });
  slots.push({
    id: "consent",
    name: "Consent to evaluate and treat",
    status: signedConsent ? "signed" : "missing",
    note: signedConsent ? "Signed before the visit." : "",
  });
  return slots;
}

function coverage(input: Pick<PatientInput, "firstName" | "lastName" | "payerName" | "memberId">, extra: Partial<Coverage> = {}): Coverage {
  return {
    id: "primary",
    rank: "primary",
    payerName: input.payerName,
    planName: "Choice",
    memberId: input.memberId,
    groupNumber: "NL-100",
    subscriberName: `${input.firstName} ${input.lastName}`,
    relationship: "self",
    effectiveDate: "2026-01-01",
    copay: 25,
    ...extra,
  };
}

function patient(input: PatientInput & { id: string; mrn: string }, extra: Partial<Patient> = {}): Patient {
  const chart = withChart(input, {
    id: input.id,
    mrn: input.mrn,
    createdAt: "2026-09-02T15:00:00",
    allergiesReviewed: true,
    portalStatus: "active",
    documents: documents(extra.documents?.some((item) => item.id === "consent" && item.status === "signed") ?? false),
    ...extra,
  });
  return {
    ...chart,
    coverages: extra.coverages ?? [coverage(input)],
  };
}

function visit(
  input: Pick<Appointment, "id" | "patientId" | "providerName" | "start" | "durationMinutes" | "reason" | "status"> & Partial<Appointment>,
): Appointment {
  return {
    notes: "",
    visitType: "follow_up",
    room: "Room 1",
    confirmation: "confirmed",
    assessment: "",
    plan: "",
    vitals: emptyVitals(),
    copayCollected: null,
    scheduledProcedures: [],
    opNoteStatus: "not_required",
    unableToCode: false,
    codingFlag: "",
    ...input,
    chiefComplaint: input.chiefComplaint || input.reason,
  };
}

function line(id: string, cpt: string, description: string, charge: number, icd: string): Claim["lines"][number] {
  return {
    id,
    cpt,
    description,
    modifier: "",
    modifiers: [],
    units: 1,
    charge,
    icd,
    diagnoses: [icd],
    includeOnBill: true,
    physician: samplePractice.physicianName,
  };
}

const hale = patient(
  {
    id: "pt-hale",
    mrn: "100481",
    firstName: "Paul",
    lastName: "Wallace",
    dateOfBirth: "1988-03-14",
    sex: "male",
    memberId: "PT-44021",
    payerName: "Pinetree Health",
    phone: "401-555-0144",
    email: "paul.wallace@example.com",
    address: "18 Hope Street",
    city: "Providence",
    state: "RI",
    postalCode: "02906",
  },
  {
    preferredName: "Paul",
    preferredContact: "text",
    medicalHistory: "Blood pressure has been high at the pharmacy.",
    medications: [{ id: "med-hale", name: "Lisinopril", dose: "10 mg", frequency: "daily", status: "active" }],
    allergies: [{ id: "alg-hale", substance: "Penicillin", reaction: "Rash", severity: "moderate" }],
    problems: [{ id: "pr-hale", name: "Essential hypertension", icd: "I10", status: "active", onset: "2026-09-01" }],
    intakeAnswers: [
      { label: "Reason for the visit", value: "Checkup. Blood pressure has been high at the pharmacy." },
      { label: "Pharmacy", value: "Hope Street Pharmacy" },
      { label: "Medications", value: "Lisinopril 10 mg daily" },
      { label: "Allergies", value: "Penicillin, rash" },
    ],
    documents: documents(true),
    coverages: [coverage({ firstName: "Paul", lastName: "Wallace", payerName: "Pinetree Health", memberId: "PT-44021" }, { planName: "Choice PPO", copay: 25 })],
  },
);

const voss = patient(
  {
    id: "pt-voss",
    mrn: "100228",
    firstName: "Anas",
    lastName: "Khan",
    dateOfBirth: "1976-11-02",
    sex: "male",
    memberId: "PT-22810",
    payerName: "Pinetree Health",
    phone: "401-555-0174",
    email: "anas.khan@example.com",
    address: "90 Wickenden Street",
    city: "Providence",
    state: "RI",
    postalCode: "02903",
  },
  {
    preferredName: "Anas",
    preferredContact: "phone",
    problems: [{ id: "pr-voss", name: "Type 2 diabetes mellitus", icd: "E11.9", status: "active", onset: "2024-04-01" }],
    documents: documents(true),
    accountNotes: [
      {
        id: "note-voss",
        body: "June visit was paid. August visit was denied. A balance text is waiting in the outbox.",
        audience: "billing",
        createdAt: "2026-10-14T08:50:00",
        resolved: false,
      },
    ],
  },
);

const adelman = patient(
  {
    id: "pt-adelman",
    mrn: "100502",
    firstName: "Garrett",
    lastName: "Holliday",
    dateOfBirth: "1994-07-19",
    sex: "male",
    memberId: "PT-50277",
    payerName: "Pinetree Health",
    phone: "401-555-0160",
    email: "garrett.holliday@example.com",
    address: "4 Transit Street",
    city: "Providence",
    state: "RI",
    postalCode: "02906",
  },
  {
    preferredName: "Garrett",
    preferredContact: "email",
    documents: documents(false).map((item) => (item.id === "consent" ? { ...item, name: "Permission to obtain records", status: "missing" as const } : item)),
  },
);

const gulri = patient(
  {
    id: "pt-gulri",
    mrn: "100611",
    firstName: "Robby",
    lastName: "Gulri",
    dateOfBirth: "1989-05-22",
    sex: "male",
    memberId: "PT-61104",
    payerName: "Pinetree Health",
    phone: "401-555-0188",
    email: "robby.gulri@example.com",
    address: "220 Benefit Street",
    city: "Providence",
    state: "RI",
    postalCode: "02903",
  },
  {
    preferredName: "Robby",
    preferredContact: "text",
    problems: [{ id: "pr-gulri", name: "Knee pain", icd: "M25.561", status: "active", onset: "2026-09-15" }],
    documents: documents(true),
  },
);

const charania = patient(
  {
    id: "pt-charania",
    mrn: "100720",
    firstName: "Dannie",
    lastName: "Charania",
    dateOfBirth: "1991-12-08",
    sex: "male",
    memberId: "PT-72019",
    payerName: "Pinetree Health",
    phone: "401-555-0155",
    email: "dannie.charania@example.com",
    address: "77 Angell Street",
    city: "Providence",
    state: "RI",
    postalCode: "02906",
  },
  {
    preferredName: "Dannie",
    preferredContact: "email",
    problems: [{ id: "pr-charania", name: "Seasonal allergic rhinitis", icd: "J30.2", status: "active", onset: "2025-03-01" }],
    documents: documents(true),
  },
);

const spinelli = patient(
  {
    id: "pt-spinelli",
    mrn: "100831",
    firstName: "Christina",
    lastName: "Spinelli",
    dateOfBirth: "1985-09-03",
    sex: "female",
    memberId: "PT-83122",
    payerName: "Pinetree Health",
    phone: "401-555-0133",
    email: "christina.spinelli@example.com",
    address: "15 Meeting Street",
    city: "Providence",
    state: "RI",
    postalCode: "02903",
  },
  {
    preferredName: "Christina",
    preferredContact: "text",
    problems: [{ id: "pr-spinelli", name: "Migraine", icd: "G43.909", status: "active", onset: "2023-06-01" }],
    documents: documents(true),
  },
);

const dawn = patient(
  {
    id: "pt-dawn",
    mrn: "100842",
    firstName: "Dawn",
    lastName: "Wallace",
    dateOfBirth: "1972-02-18",
    sex: "female",
    memberId: "PT-84208",
    payerName: "Pinetree Health",
    phone: "401-555-0121",
    email: "dawn.wallace@example.com",
    address: "18 Hope Street",
    city: "Providence",
    state: "RI",
    postalCode: "02906",
  },
  {
    preferredName: "Dawn",
    preferredContact: "phone",
    problems: [{ id: "pr-dawn", name: "Hypothyroidism", icd: "E03.9", status: "active", onset: "2019-01-10" }],
    documents: documents(true),
  },
);

const brand = patient(
  {
    id: "pt-brand",
    mrn: "100853",
    firstName: "Alex",
    lastName: "Brand",
    dateOfBirth: "1996-08-27",
    sex: "other",
    memberId: "PT-85341",
    payerName: "Pinetree Health",
    phone: "401-555-0199",
    email: "alex.brand@example.com",
    address: "310 Thayer Street",
    city: "Providence",
    state: "RI",
    postalCode: "02906",
  },
  {
    preferredName: "Alex",
    preferredContact: "email",
    problems: [{ id: "pr-brand", name: "Anxiety disorder", icd: "F41.9", status: "active", onset: "2024-11-01" }],
    documents: documents(true),
  },
);

export function createSeedState(): RcmState {
  return {
    practice: { ...samplePractice },
    patients: [hale, voss, adelman, gulri, charania, spinelli, dawn, brand],
    appointments: [
      visit({
        id: "appt-voss",
        patientId: "pt-voss",
        providerName: samplePractice.physicianName,
        start: "2026-10-14T08:40:00",
        durationMinutes: 20,
        reason: "Diabetes follow-up",
        status: "completed",
        visitType: "follow_up",
        room: "Room 1",
        confirmation: "confirmed",
        chiefComplaint: "Diabetes follow-up",
        assessment: "Type 2 diabetes, stable on the current plan.",
        plan: "Continue metformin. Recheck A1c in three months.",
      }),
      visit({
        id: "appt-hale",
        patientId: "pt-hale",
        providerName: samplePractice.physicianName,
        start: "2026-10-14T09:00:00",
        durationMinutes: 40,
        reason: "New patient checkup",
        status: "in_progress",
        visitType: "new",
        room: "Room 2",
        confirmation: "confirmed",
        chiefComplaint: "Checkup. Home and pharmacy blood pressures have been high.",
        vitals: { bloodPressure: "148/92", heartRate: "78", weightLb: "182", painScore: "0" },
      }),
      visit({
        id: "appt-adelman",
        patientId: "pt-adelman",
        providerName: samplePractice.physicianName,
        start: "2026-10-14T10:30:00",
        durationMinutes: 20,
        reason: "Follow-up",
        status: "scheduled",
        visitType: "follow_up",
        room: "Room 1",
        confirmation: "unconfirmed",
        chiefComplaint: "Follow-up",
      }),
      visit({
        id: "appt-gulri",
        patientId: "pt-gulri",
        providerName: samplePractice.physicianName,
        start: "2026-10-14T11:00:00",
        durationMinutes: 20,
        reason: "Knee pain",
        status: "scheduled",
        visitType: "follow_up",
        room: "Room 2",
        confirmation: "confirmed",
        chiefComplaint: "Right knee pain after running",
      }),
      visit({
        id: "appt-charania",
        patientId: "pt-charania",
        providerName: samplePractice.physicianName,
        start: "2026-10-14T13:30:00",
        durationMinutes: 20,
        reason: "Allergy follow-up",
        status: "scheduled",
        visitType: "follow_up",
        room: "Room 1",
        confirmation: "confirmed",
        chiefComplaint: "Seasonal allergies",
      }),
      visit({
        id: "appt-spinelli",
        patientId: "pt-spinelli",
        providerName: samplePractice.physicianName,
        start: "2026-10-14T14:00:00",
        durationMinutes: 20,
        reason: "Migraine follow-up",
        status: "scheduled",
        visitType: "follow_up",
        room: "Room 2",
        confirmation: "confirmed",
        chiefComplaint: "Migraine check-in",
      }),
      visit({
        id: "appt-dawn",
        patientId: "pt-dawn",
        providerName: samplePractice.physicianName,
        start: "2026-10-14T14:30:00",
        durationMinutes: 20,
        reason: "Thyroid follow-up",
        status: "scheduled",
        visitType: "follow_up",
        room: "Room 1",
        confirmation: "confirmed",
        chiefComplaint: "Hypothyroid medication review",
      }),
      visit({
        id: "appt-brand",
        patientId: "pt-brand",
        providerName: samplePractice.physicianName,
        start: "2026-10-14T15:00:00",
        durationMinutes: 30,
        reason: "New patient visit",
        status: "scheduled",
        visitType: "new",
        room: "Room 2",
        confirmation: "unconfirmed",
        chiefComplaint: "Anxiety — new patient",
      }),
    ],
    tasks: [
      {
        id: "task-adelman",
        patientId: "pt-adelman",
        title: "Records release is unsigned",
        detail: "Garrett Holliday still needs to sign the records release before 10:30.",
        due: "2026-10-14",
        status: "open",
      },
      {
        id: "task-voss",
        patientId: "pt-voss",
        title: "Denial follow-up",
        detail: "Anas Khan has an August claim denied for medical necessity.",
        due: "2026-10-14",
        status: "open",
      },
    ],
    claims: [
      {
        id: "clm-hale",
        patientId: "pt-hale",
        payerName: "Pinetree Health",
        dateOfService: "2026-10-14",
        status: "draft",
        controlNumber: "NL100481",
        placeOfService: "11",
        lines: [line("ln-hale", "99203", "New patient office visit", 185, "I10")],
        source: "agent",
        agentNote: "Queued from this morning's note. Still a draft.",
        appointmentId: "appt-hale",
        createdAt: "2026-10-14T09:28:00",
        updatedAt: "2026-10-14T09:28:00",
        events: [{ id: "ev-hale", at: "2026-10-14T09:28:00", kind: "submit", summary: "Queued as a draft from the visit note." }],
      },
      {
        id: "clm-voss-denial",
        patientId: "pt-voss",
        payerName: "Pinetree Health",
        dateOfService: "2026-08-12",
        status: "denied",
        controlNumber: "NL100228",
        placeOfService: "11",
        lines: [line("ln-voss-denial", "99214", "Office visit, established", 210, "E11.9")],
        denialReason: "Medical necessity was not established for this visit.",
        carc: "50",
        rarc: "N115",
        source: "manual",
        createdAt: "2026-08-12T18:00:00",
        updatedAt: "2026-09-02T14:00:00",
        events: [{ id: "ev-voss-denial", at: "2026-09-02T14:00:00", kind: "835", summary: "Denied. CARC 50." }],
        remitOutcome: "denied",
        paymentAmount: 0,
      },
      {
        id: "clm-voss-paid",
        patientId: "pt-voss",
        payerName: "Pinetree Health",
        dateOfService: "2026-06-03",
        status: "paid",
        controlNumber: "NL100196",
        placeOfService: "11",
        lines: [line("ln-voss-paid", "99213", "Office visit, established", 180, "I10")],
        source: "manual",
        createdAt: "2026-06-03T18:00:00",
        updatedAt: "2026-06-20T12:00:00",
        events: [{ id: "ev-voss-paid", at: "2026-06-20T12:00:00", kind: "835", summary: "Paid $140." }],
        paymentAmount: 140,
        adjustmentAmount: 40,
        patientResponsibility: 25,
        remitOutcome: "paid",
      },
    ],
    eligibility: [
      {
        id: "elig-hale",
        patientId: "pt-hale",
        payerName: "Pinetree Health",
        createdAt: "2026-10-14T08:10:00",
        active: true,
        copay: 25,
        coinsurance: null,
        deductibleRemaining: 650,
        priorAuthRequired: false,
        summary: "Active coverage on file. Office copay $25. Deductible remaining $650.",
      },
    ],
    outbox: [
      {
        id: "out-email",
        kind: "email",
        to: "paul.wallace@example.com",
        body: "Your intake is on file for the 9:00 visit with Dr. Francois.",
        createdAt: "2026-10-13T21:00:00",
      },
      {
        id: "out-text",
        kind: "text",
        to: "401-555-0174",
        body: "Anas, a balance from the June visit is waiting. Reply if you want a statement.",
        createdAt: "2026-10-14T08:55:00",
      },
    ],
    agentRuns: [
      {
        id: "run-eligibility",
        title: "Eligibility checked",
        detail: "Paul Wallace is active with Pinetree Health.",
        href: "/try/eligibility",
        at: "2026-10-14T08:10:00",
      },
      {
        id: "run-note",
        title: "Note drafted",
        detail: "The 9:00 visit has a transcript, a note, and codes.",
        href: "/try/visits",
        at: "2026-10-14T09:20:00",
      },
      {
        id: "run-claim",
        title: "Claim queued",
        detail: "Paul Wallace's visit is a draft claim.",
        href: "/try/claims/clm-hale",
        at: "2026-10-14T09:28:00",
      },
      {
        id: "run-text",
        title: "Balance text waiting",
        detail: "A text to Anas Khan is in the outbox.",
        href: "/try/patients/pt-voss",
        at: "2026-10-14T08:55:00",
      },
    ],
    visitNotes: [
      {
        id: "vis-hale",
        patientId: "pt-hale",
        appointmentId: "appt-hale",
        revealed: false,
        transcript: [
          "Dr. Francois: Good morning, Paul. What brought you in?",
          "Paul Wallace: A checkup. The pharmacy machine has been reading my blood pressure high.",
          "Dr. Francois: Are you taking the lisinopril every day?",
          "Paul Wallace: Yes. I started it last month.",
          "Dr. Francois: Any chest pain, shortness of breath, or headache that is new?",
          "Paul Wallace: No. I feel fine otherwise.",
          "Dr. Francois: We will recheck the pressure here, keep the lisinopril, and look at the numbers again in a month.",
        ].join("\n"),
        note: [
          "Subjective: New patient checkup. Pharmacy blood pressures have been high. Takes lisinopril 10 mg daily. No chest pain, dyspnea, or new headache. Penicillin causes a rash.",
          "Objective: Blood pressure 148/92, heart rate 78, weight 182 lb. Lungs clear. Heart regular.",
          "Assessment: Essential hypertension, I10. Adult medical exam, Z00.00.",
          "Plan: Continue lisinopril 10 mg daily. Home readings for two weeks. Return in one month.",
        ].join("\n\n"),
        codes: [
          { system: "ICD-10", code: "I10", description: "Essential hypertension" },
          { system: "ICD-10", code: "Z00.00", description: "Encounter for general adult medical examination" },
          { system: "CPT", code: "99203", description: "New patient office visit" },
        ],
      },
    ],
    requests: [
      {
        id: "req-lee",
        name: "Morgan Lee",
        email: "morgan.lee@example.com",
        phone: "401-555-0190",
        kind: "consultation",
        status: "new",
        message: "I would like a new-patient visit for blood pressure. Mornings work best.",
        createdAt: "2026-10-14T07:40:00",
      },
    ],
    packets: [
      {
        id: "pkt-hale",
        token: "sign-hale",
        patientId: "pt-hale",
        patientName: "Paul Wallace",
        email: "paul.wallace@example.com",
        title: "Consent to evaluate and treat",
        body: consentBody,
        status: "signed",
        signerName: "Paul Wallace",
        signedAt: "2026-10-13T16:04:00",
      },
      {
        id: "pkt-hale-privacy",
        token: "sign-hale-privacy",
        patientId: "pt-hale",
        patientName: "Paul Wallace",
        email: "paul.wallace@example.com",
        title: "Privacy notice acknowledgment",
        body: `${consentBody.split("\n\n")[0]}\n\nPrivacy notice acknowledgment\n\nI was offered Southeast Medical’s notice of privacy practices. I can ask for a copy at the front desk.`,
        status: "signed",
        signerName: "Paul Wallace",
        signedAt: "2026-10-13T16:06:00",
      },
      {
        id: "pkt-hale-messages",
        token: "sign-hale-messages",
        patientId: "pt-hale",
        patientName: "Paul Wallace",
        email: "paul.wallace@example.com",
        title: "Permission to email and text",
        body: `Southeast Medical\n\nPermission to email and text\n\nI allow Southeast Medical to email and text me about appointments and paperwork at the contact details on my chart. This is not marketing permission.`,
        status: "signed",
        signerName: "Paul Wallace",
        signedAt: "2026-10-13T16:07:00",
      },
      {
        id: "pkt-hale-benefits",
        token: "sign-hale-benefits",
        patientId: "pt-hale",
        patientName: "Paul Wallace",
        email: "paul.wallace@example.com",
        title: "Assignment of benefits",
        body: `Southeast Medical\n\nAssignment of benefits and financial responsibility\n\nI assign benefits payable for my care to Southeast Medical and ask my plan to pay the practice directly. I am responsible for amounts my plan does not pay.`,
        status: "open",
        signerName: "",
        signedAt: "",
      },
      {
        id: "pkt-adelman",
        token: "sign-adelman",
        patientId: "pt-adelman",
        patientName: "Garrett Holliday",
        email: "garrett.holliday@example.com",
        title: "Permission to obtain records",
        body: recordsBody,
        status: "open",
        signerName: "",
        signedAt: "",
      },
      {
        id: "pkt-adelman-consent",
        token: "sign-adelman-consent",
        patientId: "pt-adelman",
        patientName: "Garrett Holliday",
        email: "garrett.holliday@example.com",
        title: "Consent to evaluate and treat",
        body: consentBody,
        status: "open",
        signerName: "",
        signedAt: "",
      },
      {
        id: "pkt-voss-benefits",
        token: "sign-voss-benefits",
        patientId: "pt-voss",
        patientName: "Anas Khan",
        email: "anas.khan@example.com",
        title: "Assignment of benefits",
        body: `Southeast Medical\n\nAssignment of benefits and financial responsibility\n\nI assign benefits payable for my care to Southeast Medical and ask my plan to pay the practice directly. I am responsible for amounts my plan does not pay.`,
        status: "open",
        signerName: "",
        signedAt: "",
      },
      {
        id: "pkt-voss-old",
        token: "sign-voss-old",
        patientId: "pt-voss",
        patientName: "Anas Khan",
        email: "anas.khan@example.com",
        title: "Prior consent (superseded)",
        body: consentBody,
        status: "void",
        signerName: "",
        signedAt: "",
      },
    ],
  };
}
