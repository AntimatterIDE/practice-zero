import { describe, expect, it } from "vitest";
import { createSeedState, refreshSamplePatientName } from "@/lib/rcm/seed";

describe("sample portal chart", () => {
  it("opens Paul Wallace without a password", () => {
    const hale = createSeedState().patients.find((patient) => patient.id === "pt-hale");
    expect(hale?.firstName).toBe("Paul");
    expect(hale?.payerName).toBe("Pinetree Health");
    expect(hale?.intakeAnswers?.length).toBeGreaterThan(0);
    expect(hale?.documents.some((document) => document.status === "signed")).toBe(true);
  });

  it("renames a saved Jordan Hale chart to Paul Wallace", () => {
    const state = createSeedState();
    const saved = {
      ...state,
      patients: state.patients.map((patient) =>
        patient.id === "pt-hale"
          ? { ...patient, firstName: "Jordan", lastName: "Hale", preferredName: "Jordan", email: "jordan.hale@example.com" }
          : patient,
      ),
      packets: state.packets.map((packet) =>
        packet.patientId === "pt-hale"
          ? { ...packet, patientName: "Jordan Hale", signerName: "Jordan Hale", email: "jordan.hale@example.com" }
          : packet,
      ),
      visitNotes: state.visitNotes.map((note) =>
        note.patientId === "pt-hale"
          ? { ...note, transcript: "Dr. Shah: Good morning, Jordan.\nJordan Hale: A checkup." }
          : note,
      ),
    };

    const next = refreshSamplePatientName(saved);
    expect(next.patients.find((patient) => patient.id === "pt-hale")).toMatchObject({
      firstName: "Paul",
      lastName: "Wallace",
      preferredName: "Paul",
      email: "paul.wallace@example.com",
    });
    expect(next.packets.find((packet) => packet.patientId === "pt-hale")).toMatchObject({
      patientName: "Paul Wallace",
      signerName: "Paul Wallace",
      email: "paul.wallace@example.com",
    });
    expect(next.visitNotes.find((note) => note.patientId === "pt-hale")?.transcript).toBe(
      "Dr. Shah: Good morning, Paul.\nPaul Wallace: A checkup.",
    );
    expect(refreshSamplePatientName(next)).toBe(next);
  });
});
