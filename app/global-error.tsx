"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f3f7fb", color: "#0b1f33", fontFamily: "Georgia, serif" }}>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "6rem 1.5rem" }}>
          <p style={{ letterSpacing: "0.14em", textTransform: "uppercase", fontSize: 12, fontWeight: 650 }}>Practice Zero</p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 650, marginTop: "1rem" }}>Something went wrong.</h1>
          <button
            type="button"
            onClick={reset}
            style={{ marginTop: "1.5rem", background: "#0e8f84", color: "#f3f7fb", border: 0, borderRadius: 999, padding: "0.8rem 1.1rem", fontWeight: 650 }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
