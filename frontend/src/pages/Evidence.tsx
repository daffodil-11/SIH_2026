import { useEffect, useState } from "react";

type EvidenceItem = {
  id: string;
  case_id: string;
  alias_id: number;
  alias_name: string;
  type: "post" | "message" | "file" | string;
  title: string;
  content: string;
  source: string;
  timestamp: string;
  risk_indicator: string;
};

const BASE_URL = "http://127.0.0.1:8000";

export default function EvidencePage() {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvidence() {
      try {
        const res = await fetch(`${BASE_URL}/evidence/evidence?case_id=CASE-001`);
        if (!res.ok) {
          throw new Error(`Failed to load evidence: ${res.status}`);
        }
        const data = await res.json();
        setEvidence(data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadEvidence();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Evidence</h2>
        <p>Loading evidence...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Evidence</h2>
        <p style={{ color: "red" }}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Evidence</h2>
      {evidence.length === 0 ? (
        <p>No evidence found for this case.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {evidence.map((ev) => (
            <div
              key={ev.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 16,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: 8 }}>
                {ev.title}
              </div>
              <div style={{ fontSize: 13, color: "#555", marginBottom: 8 }}>
                <div>Alias: {ev.alias_name}</div>
                <div>Type: {ev.type}</div>
                <div>Source: {ev.source}</div>
                <div>Time: {new Date(ev.timestamp).toLocaleString()}</div>
                <div>Risk: {ev.risk_indicator}</div>
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#333",
                  background: "#f9f9f9",
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                {ev.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}