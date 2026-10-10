import { useEffect, useState } from "react";
import "./App.css";

import CyberBackground from "./components/CyberBackground";
import CustomCursor from "./components/CustomCursor";

const API_BASE_URL = "http://127.0.0.1:8000";

const modules = [
  "Overview",
  "Identity Linkage",
  "Evidence",
  "Wallets",
  "Transactions",
  "NLP Analysis",
  "Reports",
];

function App() {
  const [activeModule, setActiveModule] = useState("Overview");
  const [aliases, setAliases] = useState([]);
  const [aliasA, setAliasA] = useState("");
  const [aliasB, setAliasB] = useState("");
  const [aliasesLoading, setAliasesLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function handlePointerMove(event) {
      document.documentElement.style.setProperty(
        "--mouse-x",
        `${event.clientX}px`
      );

      document.documentElement.style.setProperty(
        "--mouse-y",
        `${event.clientY}px`
      );
    }

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  useEffect(() => {
    async function loadAliases() {
      try {
        const response = await fetch(`${API_BASE_URL}/aliases/`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || "Could not load aliases.");
        }

        setAliases(data);

        if (data.length >= 2) {
          setAliasA(String(data[0].id));
          setAliasB(String(data[1].id));
        }
      } catch (error) {
        setMessage(error.message);
      } finally {
        setAliasesLoading(false);
      }
    }

    loadAliases();
  }, []);

  async function analyzeIdentityLink() {
    if (!aliasA || !aliasB) {
      setMessage("Please select both aliases.");
      return;
    }

    if (aliasA === aliasB) {
      setMessage("Please select two different aliases.");
      return;
    }

    setLoading(true);
    setMessage("");
    setResult(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/analysis/identity-link/${aliasA}/${aliasB}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Analysis failed.");
      }

      setResult(data);
      setActiveModule("Identity Linkage");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveReport() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analysis/identity-link/save/${aliasA}/${aliasB}`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not save report.");
      }

      setMessage(`Report saved successfully with ID ${data.id}.`);
      setActiveModule("Reports");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      <CyberBackground />
      <CustomCursor />

      <div className="app-shell">
        <header className="topbar">
          <div>
            <p className="eyebrow">CYBER INTELLIGENCE PLATFORM</p>
            <h1>Dark Web Identity Linkage</h1>
          </div>

          <div className="system-status">
            <span className="status-dot"></span>
            Backend Online
          </div>
        </header>

        <div className="workspace">
          <aside className="sidebar">
            <p className="sidebar-title">INVESTIGATION MODULES</p>

            <nav>
              {modules.map((module) => (
                <button
                  key={module}
                  className={
                    activeModule === module
                      ? "module-button active"
                      : "module-button"
                  }
                  onClick={() => setActiveModule(module)}
                >
                  <span className="module-indicator"></span>
                  {module}
                </button>
              ))}
            </nav>

            <div className="case-panel">
              <span className="eyebrow">ACTIVE CASE</span>
              <strong>CASE-001</strong>
              <small>Simulated investigation dataset</small>
            </div>
          </aside>

          <main className="dashboard">
            {activeModule === "Overview" && (
              <OverviewPanel
                aliases={aliases}
                result={result}
                onStart={() => setActiveModule("Identity Linkage")}
              />
            )}

            {activeModule === "Identity Linkage" && (
              <IdentityLinkagePanel
                aliases={aliases}
                aliasA={aliasA}
                aliasB={aliasB}
                setAliasA={setAliasA}
                setAliasB={setAliasB}
                aliasesLoading={aliasesLoading}
                loading={loading}
                message={message}
                result={result}
                onAnalyze={analyzeIdentityLink}
                onSave={saveReport}
              />
            )}

            {activeModule === "Evidence" && (
              <EvidencePanel result={result} />
            )}

            {activeModule === "Wallets" && (
              <WalletPanel result={result} />
            )}

            {activeModule === "Transactions" && (
              <TransactionsPanel />
            )}

            {activeModule === "NLP Analysis" && (
              <NlpPanel result={result} />
            )}

            {activeModule === "Reports" && (
              <ReportsPanel message={message} result={result} />
            )}
          </main>
        </div>
      </div>
    </>
  );
}

function OverviewPanel({ aliases, result, onStart }) {
  return (
    <>
      <section className="hero-card">
        <div>
          <p className="eyebrow">INVESTIGATION OVERVIEW</p>
          <h2>Dark-Web Intelligence Workspace</h2>
          <p>
            Link aliases across writing style, behaviour, wallets,
            transactions, and language evidence.
          </p>
        </div>

        <div className="scan-symbol">⌁</div>
      </section>

      <section className="metric-grid">
        <MetricCard title="Tracked Aliases" value={aliases.length} suffix="" />
        <MetricCard title="Evidence Records" value="—" suffix="" />
        <MetricCard title="Wallet Links" value="—" suffix="" />
        <MetricCard title="Active Result" value={result ? "1" : "0"} suffix="" />
      </section>

      <section className="selection-card">
        <p className="eyebrow">CASE WORKSPACE</p>
        <h2>Begin identity investigation</h2>
        <p>
          Select two aliases to compare their available simulated evidence.
        </p>

        <button className="primary-button" onClick={onStart}>
          Open Identity Linkage
        </button>
      </section>
    </>
  );
}

function IdentityLinkagePanel({
  aliases,
  aliasA,
  aliasB,
  setAliasA,
  setAliasB,
  aliasesLoading,
  loading,
  message,
  result,
  onAnalyze,
  onSave,
}) {
  return (
    <>
      <section className="hero-card">
        <div>
          <p className="eyebrow">IDENTITY LINKAGE</p>
          <h2>Cross-Platform Identity Analysis</h2>
          <p>
            Compare two aliases using writing style, wallet evidence,
            activity behaviour, and transaction relationships.
          </p>
        </div>

        <div className="scan-symbol">⌁</div>
      </section>

      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CASE ANALYSIS</p>
            <h2>Select aliases to investigate</h2>
          </div>

          <span className="case-label">CASE-001</span>
        </div>

        <div className="alias-grid">
          <label>
            Alias A

            <select
              value={aliasA}
              onChange={(event) => setAliasA(event.target.value)}
              disabled={aliasesLoading}
            >
              <option value="">
                {aliasesLoading ? "Loading aliases..." : "Select Alias A"}
              </option>

              {aliases.map((alias) => (
                <option key={alias.id} value={alias.id}>
                  {alias.alias_name} — {alias.platform}
                </option>
              ))}
            </select>
          </label>

          <div className="versus">VS</div>

          <label>
            Alias B

            <select
              value={aliasB}
              onChange={(event) => setAliasB(event.target.value)}
              disabled={aliasesLoading}
            >
              <option value="">
                {aliasesLoading ? "Loading aliases..." : "Select Alias B"}
              </option>

              {aliases.map((alias) => (
                <option key={alias.id} value={alias.id}>
                  {alias.alias_name} — {alias.platform}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          className="primary-button"
          onClick={onAnalyze}
          disabled={loading || aliasesLoading || !aliasA || !aliasB}
        >
          {loading ? "Analyzing..." : "Analyze Identity Link"}
        </button>
      </section>

      {message && <div className="message-box">{message}</div>}

      {result && <ResultPanel result={result} onSave={onSave} />}
    </>
  );
}

function ResultPanel({ result, onSave }) {
  return (
    <>
      <section className="score-card">
        <div>
          <p className="eyebrow">FINAL ASSESSMENT</p>
          <h2>Identity Link Result</h2>
          <p>{result.message}</p>
        </div>

        <div className="score-display">
          <span>{result.final_confidence_score}</span>
          <small>/ 100</small>
          <strong>{result.risk_level} Risk</strong>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard
          title="Writing Style"
          value={result.writing_style_score}
          suffix="%"
        />

        <MetricCard
          title="Wallet Evidence"
          value={result.wallet_score}
          suffix="%"
        />

        <MetricCard
          title="Behaviour Match"
          value={result.behavior_score}
          suffix="%"
        />

        <MetricCard
          title="Common Words"
          value={result.common_word_count}
          suffix=""
        />
      </section>

      <section className="evidence-grid">
        <div className="evidence-card">
          <p className="eyebrow">LINGUISTIC EVIDENCE</p>
          <h3>Common words</h3>

          <div className="tag-list">
            {result.common_words?.length > 0 ? (
              result.common_words.map((word) => (
                <span className="tag" key={word}>
                  {word}
                </span>
              ))
            ) : (
              <p>No common words detected.</p>
            )}
          </div>
        </div>

        <div className="evidence-card">
          <p className="eyebrow">FINANCIAL EVIDENCE</p>
          <h3>Common wallet addresses</h3>

          <div className="wallet-list">
            {result.common_wallet_addresses?.length > 0 ? (
              result.common_wallet_addresses.map((wallet) => (
                <code key={wallet}>{wallet}</code>
              ))
            ) : (
              <p>No common wallet addresses detected.</p>
            )}
          </div>
        </div>
      </section>

      <section className="action-row">
        <button className="secondary-button" onClick={onSave}>
          Save Investigation Report
        </button>
      </section>
    </>
  );
}

function EvidencePanel({ result }) {
  return (
    <section className="selection-card">
      <p className="eyebrow">EVIDENCE EXPLORER</p>
      <h2>Evidence records</h2>
      <p>
        Source-tracked evidence will appear here after an identity analysis.
      </p>

      {result ? (
        <div className="evidence-grid">
          <div className="evidence-card">
            <h3>Writing style</h3>
            <p>
              Similarity score: {result.writing_style_score}%
            </p>
            <span className="tag">Inferred</span>
          </div>

          <div className="evidence-card">
            <h3>Wallet evidence</h3>
            <p>Wallet score: {result.wallet_score}%</p>
            <span className="tag">Observed / Not Collected</span>
          </div>
        </div>
      ) : (
        <p>No analysis result available yet.</p>
      )}
    </section>
  );
}

function WalletPanel({ result }) {
  return (
    <section className="selection-card">
      <p className="eyebrow">WALLET INTELLIGENCE</p>
      <h2>Wallet relationship workspace</h2>
      <p>
        Wallet relationships and address-clustering evidence will be displayed
        here.
      </p>

      <div className="evidence-card">
        <h3>Shared wallet addresses</h3>
        <p>
          {result?.common_wallet_addresses?.length
            ? "Shared wallet evidence detected."
            : "No common wallet addresses detected."}
        </p>
      </div>
    </section>
  );
}

function TransactionsPanel() {
  return (
    <section className="selection-card">
      <p className="eyebrow">TRANSACTION INTELLIGENCE</p>
      <h2>Blockchain transaction workspace</h2>
      <p>
        Sender, receiver, amount, timestamp, and transaction relationships will
        be visualized here.
      </p>

      <div className="evidence-card">
        <h3>Transaction graph status</h3>
        <span className="tag">Pending transaction data</span>
      </div>
    </section>
  );
}

function NlpPanel({ result }) {
  return (
    <section className="selection-card">
      <p className="eyebrow">PYTHON NLP ANALYSIS</p>
      <h2>Language and stylometry</h2>
      <p>
        Language detection, translation metadata, writing-style features, and
        similarity results will appear here.
      </p>

      <div className="metric-grid">
        <MetricCard
          title="Writing Style"
          value={result?.writing_style_score ?? "—"}
          suffix={result ? "%" : ""}
        />

        <MetricCard title="Language" value="Pending" suffix="" />
        <MetricCard title="Stylometry" value="Pending" suffix="" />
        <MetricCard title="Translation" value="Pending" suffix="" />
      </div>
    </section>
  );
}

function ReportsPanel({ message, result }) {
  return (
    <section className="selection-card">
      <p className="eyebrow">INVESTIGATION REPORTS</p>
      <h2>Saved investigation reports</h2>

      {message && <div className="message-box">{message}</div>}

      {result ? (
        <div className="evidence-card">
          <h3>Latest analysis</h3>
          <p>Confidence: {result.final_confidence_score}%</p>
          <p>Risk level: {result.risk_level}</p>
        </div>
      ) : (
        <p>No saved report is currently selected.</p>
      )}
    </section>
  );
}

function MetricCard({ title, value, suffix }) {
  return (
    <div className="metric-card">
      <p>{title}</p>

      <strong>
        {value}
        {suffix}
      </strong>
    </div>
  );
}

export default App;