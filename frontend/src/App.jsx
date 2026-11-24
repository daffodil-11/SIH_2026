import { useEffect, useState } from "react";
import "./App.css";

import TransactionFlow from "./components/TransactionFlow";
import ExplainableScoreCard from "./components/ExplainableScoreCard";
import InteractiveEvidenceGraph from "./components/InteractiveEvidenceGraph";
import NetworkGraph from "./components/NetworkGraph";

const API_BASE_URL = "https://sih-2026-backend-hfq7.onrender.com";

const modules = [
  "Overview",
  "Identity Linkage",
  "Evidence",
  "Phone Tracking",
  "Investigation Timeline",
  "Priority Indicator",
  "Lead Report",
  "Dual Graph",
  "Multilingual Analysis",
  "Wallets",
  "Transactions",
  "NLP Analysis",
  "Reports",
];

function CyberCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function moveCursor(event) {
      setPosition({ x: event.clientX, y: event.clientY });
    }

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <>
      <div
        className="cyber-cursor-dot"
        style={{ left: position.x, top: position.y }}
      />
      <div
        className="cyber-cursor-ring"
        style={{ left: position.x, top: position.y }}
      />
    </>
  );
}

function App() {
  const [activeModule, setActiveModule] = useState("Overview");

  const [aliases, setAliases] = useState([]);
  const [aliasA, setAliasA] = useState("");
  const [aliasB, setAliasB] = useState("");
  const [aliasesLoading, setAliasesLoading] = useState(true);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [wallets, setWallets] = useState([]);
  const [walletsLoading, setWalletsLoading] = useState(false);

  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);

  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const selectedAliasA = aliases.find(
    (alias) => String(alias.id) === String(aliasA)
  );
  const selectedAliasB = aliases.find(
    (alias) => String(alias.id) === String(aliasB)
  );

  useEffect(() => {
    function handlePointerMove(event) {
      document.documentElement.style.setProperty("--mouse-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${event.clientY}px`);
    }
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useEffect(() => {
    async function loadAliases() {
      try {
        const response = await fetch(`${API_BASE_URL}/aliases/`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.detail || "Could not load aliases.");
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

  useEffect(() => {
    async function loadGraphData() {
      try {
        const [walletResponse, transactionResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/wallets/`),
          fetch(`${API_BASE_URL}/transactions/`),
        ]);

        if (walletResponse.ok) setWallets(await walletResponse.json());
        if (transactionResponse.ok) setTransactions(await transactionResponse.json());
      } catch {
        // Ignore graph preload errors.
      }
    }
    loadGraphData();
  }, []);

  async function loadWallets() {
    setWalletsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/wallets/`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not load wallets.");
      setWallets(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setWalletsLoading(false);
    }
  }

  async function loadTransactions() {
    setTransactionsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/transactions/`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not load transactions.");
      setTransactions(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setTransactionsLoading(false);
    }
  }

  async function loadReports() {
    setReportsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/analysis/reports`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not load reports.");
      setReports(data);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setReportsLoading(false);
    }
  }

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
      if (!response.ok) throw new Error(data.detail || "Analysis failed.");
      setResult(data);
      setActiveModule("Identity Linkage");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveReport() {
    if (!aliasA || !aliasB) {
      setMessage("Please select two aliases before saving.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/analysis/identity-link/save/${aliasA}/${aliasB}`,
        { method: "POST" }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Could not save report.");
      setMessage(`Report saved successfully with ID ${data.id}.`);
      setActiveModule("Reports");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>


      <div className="app-shell">
      <CyberCursor />
        <header className="topbar">
          <div>
            <h1 className="glitch-title" data-text="CYBER INTELLIGENCE PLATFORM"> CYBER INTELLIGENCE PLATFORM
</h1>
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
                    activeModule === module ? "module-button active" : "module-button"
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
                selectedAliasA={selectedAliasA}
                selectedAliasB={selectedAliasB}
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

            {activeModule === "Evidence" && <EvidencePanel result={result} />}
            {activeModule === "Phone Tracking" && <PhoneTrackingPanel />}
            {activeModule === "Investigation Timeline" && <TimelinePanel />}
            {activeModule === "Priority Indicator" && <PriorityPanel />}
            {activeModule === "Lead Report" && <LeadReportPanel />}
            {activeModule === "Dual Graph" && <DualGraphPanel />}
            {activeModule === "Multilingual Analysis" && <MultilingualPanel />}

            {activeModule === "Wallets" && (
              <WalletPanel
                result={result}
                wallets={wallets}
                walletsLoading={walletsLoading}
                onLoadWallets={loadWallets}
              />
            )}

            {activeModule === "Transactions" && (
              <TransactionsPanel
                transactions={transactions}
                transactionsLoading={transactionsLoading}
                onLoadTransactions={loadTransactions}
              />
            )}

            {activeModule === "NLP Analysis" && (
              <NlpPanel
                result={result}
                aliases={aliases}
                wallets={wallets}
                transactions={transactions}
              />
            )}

            {activeModule === "Reports" && (
              <ReportsPanel
                message={message}
                result={result}
                reports={reports}
                reportsLoading={reportsLoading}
                onLoadReports={loadReports}
              />
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
            Link aliases across writing style, behaviour, wallets, transactions,
            and language evidence.
          </p>
        </div>

        <div className="scan-symbol" aria-hidden="true">
          <span></span>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard title="Tracked Aliases" value={aliases.length} suffix="" />
        <MetricCard title="Evidence Records" value="--" suffix="" />
        <MetricCard title="Wallet Links" value="--" suffix="" />
        <MetricCard title="Active Result" value={result ? "1" : "0"} suffix="" />
      </section>

      <section className="selection-card">
        <p className="eyebrow">CASE WORKSPACE</p>
        <h2>Begin identity investigation</h2>
        <p>Select two aliases to compare their available simulated evidence.</p>

        <button className="primary-button" onClick={onStart}>
          Open Identity Linkage
        </button>
      </section>

      <InteractiveEvidenceGraph result={result} />
    </>
  );
}

function IdentityLinkagePanel({
  aliases,
  aliasA,
  aliasB,
  selectedAliasA,
  selectedAliasB,
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
            Compare two aliases using writing style, wallet evidence, activity
            behaviour, and transaction relationships.
          </p>
        </div>

        <div className="scan-symbol" aria-hidden="true">
          <span></span>
        </div>
      </section>

      <section className="profile-comparison-grid">
        <ProfileCard profile={selectedAliasA} label="ALIAS A" />
        <div className="profile-versus">VS</div>
        <ProfileCard profile={selectedAliasB} label="ALIAS B" />
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
                  {alias.alias_name} - {alias.platform}
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
                  {alias.alias_name} - {alias.platform}
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

function ProfileCard({ profile, label }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isPhotoActive, setIsPhotoActive] = useState(false);

  function handlePhotoMove(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    setTilt({
      x: (y / bounds.height - 0.5) * -16,
      y: (x / bounds.width - 0.5) * 16,
    });
  }

  function resetPhotoTilt() {
    setTilt({ x: 0, y: 0 });
  }

  if (!profile) {
    return (
      <article className="profile-card profile-card-empty">
        <p className="eyebrow">{label}</p>
        <div className="profile-photo-placeholder">PROFILE NOT SELECTED</div>
        <p>Select an alias to view profile details.</p>
      </article>
    );
  }

  return (
    <article className="profile-card">
      <p className="eyebrow">{label}</p>

      <div
        className="profile-photo-stage"
        onMouseMove={handlePhotoMove}
        onMouseLeave={resetPhotoTilt}
      >
        <button
          type="button"
          className={
            isPhotoActive ? "profile-photo-frame active" : "profile-photo-frame"
          }
          onClick={() => setIsPhotoActive((current) => !current)}
          style={{
            transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) ${
              isPhotoActive ? "translateY(-10px) scale(1.04)" : ""
            }`,
          }}
        >
          {profile.photo_url ? (
            <img
              src={profile.photo_url}
              alt={`${profile.alias_name} profile`}
              className="profile-photo"
            />
          ) : (
            <CyberPortrait seed={profile.alias_name} />
          )}

          <div className="profile-scan-line"></div>
        </button>
      </div>

      <div className="profile-details">
        <h3>{profile.alias_name}</h3>
        <p className="profile-platform">{profile.platform}</p>

        <div className="profile-meta">
          <span><strong>Profile ID:</strong> {profile.profile_id || "Not Collected"}</span>
          <span><strong>Language:</strong> {profile.language || "Not Collected"}</span>
          <span><strong>First seen:</strong> {profile.first_seen || "Not Collected"}</span>
          <span><strong>Last active:</strong> {profile.last_active || "Not Collected"}</span>
          <span><strong>Activity:</strong> {profile.activity_status || "Not Collected"}</span>
          <span><strong>Evidence:</strong> {profile.evidence_status || "Not Collected"}</span>
        </div>
      </div>
    </article>
  );
}

function CyberPortrait({ seed = "Alias" }) {
  const initials =
    String(seed)
      .split(/\s|_|-/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || "ID";

  return (
    <div className="cyber-portrait" aria-label={`${seed} generated portrait`}>
      <div className="portrait-halo"></div>
      <div className="portrait-head"></div>
      <div className="portrait-shoulders"></div>
      <div className="portrait-grid"></div>
      <strong>{initials}</strong>
    </div>
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
          <span>
            {result.final_confidence_score ??
              result.similarity?.final_confidence_score ??
              "--"}
          </span>
          <small>/ 100</small>
          <strong>
            {result.risk_level ?? result.similarity?.risk_level ?? "Unknown"} Risk
          </strong>
        </div>
      </section>

      <section className="metric-grid">
        <MetricCard
          title="Writing Style"
          value={result.writing_style_score ?? result.nlp?.writing_style_score ?? "--"}
          suffix="%"
        />
        <MetricCard
          title="Wallet Evidence"
          value={result.wallet_score ?? result.scores?.wallet ?? "--"}
          suffix="%"
        />
        <MetricCard
          title="Behaviour Match"
          value={result.behavior_score ?? result.scores?.behaviour ?? "--"}
          suffix="%"
        />
        <MetricCard
          title="Common Words"
          value={
            result.common_word_count ??
            result.common_words?.length ??
            result.nlp?.common_words?.length ??
            0
          }
          suffix=""
        />
      </section>

      {result.similarity && <ExplainableScoreCard similarity={result.similarity} />}

      <section className="evidence-grid">
        <div className="evidence-card">
          <p className="eyebrow">LINGUISTIC EVIDENCE</p>
          <h3>Common words</h3>

          <div className="tag-list">
            {result.common_words?.length > 0 ? (
              result.common_words.map((word) => (
                <span className="tag" key={word}>{word}</span>
              ))
            ) : result.nlp?.common_words?.length > 0 ? (
              result.nlp.common_words.map((word) => (
                <span className="tag" key={word}>{word}</span>
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

function EvidencePanel() {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [minimumPlatforms, setMinimumPlatforms] = useState(0);

  useEffect(() => {
    async function loadEvidence() {
      try {
        const response = await fetch(
          `${API_BASE_URL}/evidence/evidence?case_id=CASE-001`
        );

        if (!response.ok) {
          throw new Error(`Failed to load evidence: ${response.status}`);
        }

        setEvidence(await response.json());
      } catch (loadError) {
        setError(loadError.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadEvidence();
  }, []);

  const evidenceByAlias = evidence.reduce((groups, item) => {
    const aliasName = item.alias_name || "Unknown Alias";

    if (!groups[aliasName]) {
      groups[aliasName] = [];
    }

    groups[aliasName].push(item);
    return groups;
  }, {});

  const filteredAliases = Object.entries(evidenceByAlias).filter(
    ([aliasName, aliasEvidence]) => {
      const platforms = [
        ...new Set(aliasEvidence.map((item) => item.source || "Unknown")),
      ];

      return (
        aliasName.toLowerCase().includes(search.toLowerCase()) &&
        platforms.length >= minimumPlatforms
      );
    }
  );

  function exportEvidenceCSV() {
    const rows = [
      ["Alias", "Title", "Content", "Source", "Timestamp", "Risk"],
    ];

    Object.entries(evidenceByAlias).forEach(([aliasName, aliasEvidence]) => {
      aliasEvidence.forEach((item) => {
        rows.push([
          aliasName,
          item.title,
          item.content,
          item.source,
          item.timestamp,
          item.risk_indicator,
        ]);
      });
    });

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "evidence.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CROSS-PLATFORM EVIDENCE PROFILING</p>
            <h2>Source-tracked evidence</h2>
          </div>

          <span className="case-label">Loading...</span>
        </div>

        <p>Loading evidence records...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CROSS-PLATFORM EVIDENCE PROFILING</p>
            <h2>Source-tracked evidence</h2>
          </div>

          <span className="case-label">Error</span>
        </div>

        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CROSS-PLATFORM EVIDENCE PROFILING</p>
          <h2>Alias activity across platforms</h2>
        </div>

        <span className="case-label">
          {Object.keys(evidenceByAlias).length} Aliases
        </span>
      </div>

      <p>
        View all evidence linked to each alias across different forums, accounts,
        and sources in one place.
      </p>

      <div className="evidence-controls">
        <input
          className="evidence-search"
          placeholder="Search alias..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="evidence-filter"
          value={minimumPlatforms}
          onChange={(event) => setMinimumPlatforms(Number(event.target.value))}
        >
          <option value={0}>All aliases</option>
          <option value={2}>2+ platforms</option>
          <option value={3}>3+ platforms</option>
        </select>

        <button className="secondary-button" onClick={exportEvidenceCSV}>
          Export CSV
        </button>
      </div>

      {evidence.length === 0 ? (
        <div className="evidence-card">
          <h3>No evidence records</h3>
          <p>No evidence found for this case.</p>
        </div>
      ) : (
        <div className="cross-platform-list">
          {filteredAliases.map(([aliasName, aliasEvidence]) => {
            const platforms = [
              ...new Set(
                aliasEvidence.map((item) => item.source || "Unknown")
              ),
            ];

            return (
              <article className="cross-platform-card" key={aliasName}>
                <div className="cross-platform-header">
                  <div>
                    <span className="evidence-id">ALIAS PROFILE</span>
                    <h3>{aliasName}</h3>
                  </div>

                  <span className="platform-count">
                    {platforms.length} Platform
                    {platforms.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="platform-tags">
                  {platforms.map((platform) => (
                    <span className="tag" key={platform}>
                      {platform}
                    </span>
                  ))}
                </div>

                <div className="evidence-list">
                  {aliasEvidence.map((item) => (
                    <div className="evidence-record" key={item.id}>
                      <div className="evidence-record-header">
                        <div>
                          <span className="evidence-id">{item.id}</span>
                          <h4>{item.title}</h4>
                        </div>

                        <span
                          className={`evidence-status ${getStatusClass(item.type)}`}
                        >
                          {item.type}
                        </span>
                      </div>

                      <p>{item.content}</p>

                      <div className="evidence-record-meta">
                        <span>
                          <strong>Source:</strong> {item.source}
                        </span>
                        <span>
                          <strong>Time:</strong>{" "}
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                        <span>
                          <strong>Risk:</strong> {item.risk_indicator}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
function PhoneTrackingPanel() {

  const [phoneData, setPhoneData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
const [onlyPossibleLinks, setOnlyPossibleLinks] = useState(false);
  

  useEffect(() => {
    async function loadPhoneRecords() {
      try {
        const response = await fetch(`${API_BASE_URL}/phone-tracking/`);

        if (!response.ok) {
          throw new Error(`Failed to load phone records: ${response.status}`);
        }

        setPhoneData(await response.json());
      } catch (loadError) {
        setError(loadError.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadPhoneRecords();
  }, []);
  const filteredPhones = (phoneData?.phone_records || []).filter((phone) => {
  const matchesSearch = phone.phone_number
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesFilter = onlyPossibleLinks ? phone.possible_link : true;

  return matchesSearch && matchesFilter;
});

function exportPhoneCSV() {
  const rows = [
    ["Phone Number", "Aliases", "Alias Count", "Possible Link", "Location", "Time"],
  ];

  (phoneData?.phone_records || []).forEach((phone) => {
    phone.records.forEach((record) => {
      rows.push([
        phone.phone_number,
        phone.aliases.join(", "),
        phone.alias_count,
        phone.possible_link ? "Yes" : "No",
        record.location,
        record.recorded_at,
      ]);
    });
  });

  const csv = rows
    .map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "phone_tracking.csv";
  link.click();
  URL.revokeObjectURL(url);
}

  if (loading) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SIMULATED PHONE TRACKING</p>
            <h2>Phone verification workspace</h2>
          </div>

          <span className="case-label">Loading...</span>
        </div>

        <p>Loading simulated phone and location records...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">SIMULATED PHONE TRACKING</p>
            <h2>Phone verification workspace</h2>
          </div>

          <span className="case-label">Error</span>
        </div>

        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">SIMULATED PHONE TRACKING</p>
          <h2>Phone verification workspace</h2>
        </div>

        <span className="case-label">
          {phoneData.total_phone_numbers} Phone Numbers
        </span>
      </div>

      <p>
        Check whether the same simulated phone number has been used by multiple
        aliases. Shared numbers may indicate a possible identity connection.
      </p>
          <div className="evidence-controls">
      <input
        className="evidence-search"
        placeholder="Search phone number..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <label className="phone-filter">
        <input
          type="checkbox"
          checked={onlyPossibleLinks}
          onChange={(event) => setOnlyPossibleLinks(event.target.checked)}
        />
        Show only possible links
      </label>

      <button className="secondary-button" onClick={exportPhoneCSV}>
        Export CSV
      </button>
    </div>

      <div className="metric-grid">
        <MetricCard
          title="Phone Numbers"
          value={phoneData.total_phone_numbers}
          suffix=""
        />
        <MetricCard
          title="Possible Links"
          value={phoneData.possible_links}
          suffix=""
        />
      </div>

      <div className="phone-tracking-list">
        {filteredPhones.map((phone) => (
          <article
            className={
              phone.possible_link
                ? "phone-tracking-card possible-link"
                : "phone-tracking-card"
            }
            key={phone.phone_number}
          >
            <div className="phone-tracking-header">
              <div>
                <span className="evidence-id">PHONE NUMBER</span>
                <h3>{phone.phone_number}</h3>
              </div>

              <span
                className={
                  phone.possible_link
                    ? "phone-status warning"
                    : "phone-status safe"
                }
              >
                {phone.possible_link
                  ? "Possible Link"
                  : "No Shared Use"}
              </span>
            </div>

            <div className="phone-alias-list">
              {phone.aliases.map((alias) => (
                <span className="tag" key={alias}>
                  {alias}
                </span>
              ))}
            </div>

            {phone.possible_link && (
              <div className="phone-link-message">
                Same phone number is used by {phone.alias_count} aliases.
                This may indicate a possible identity connection.
              </div>
            )}

            <div className="phone-record-list">
              {phone.records.map((record) => (
                <div className="phone-record" key={record.id}>
                  <div className="phone-record-main">
                    <strong>{record.alias_name}</strong>
                    <span>{record.platform}</span>
                  </div>

                  <div className="phone-record-meta">
                    <span>
                      <strong>Location:</strong> {record.location}
                    </span>
                    <span>
                      <strong>Time:</strong>{" "}
                      {new Date(record.recorded_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TimelinePanel() {
  const [timelineData, setTimelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("All");

  useEffect(() => {
    async function loadTimeline() {
      try {
        const response = await fetch(`${API_BASE_URL}/timeline/`);

        if (!response.ok) {
          throw new Error(`Failed to load timeline: ${response.status}`);
        }

        setTimelineData(await response.json());
      } catch (loadError) {
        setError(loadError.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadTimeline();
  }, []);

  const filteredEvents = (timelineData?.events || []).filter((event) => {
    const matchesSearch =
      event.alias_name.toLowerCase().includes(search.toLowerCase()) ||
      event.title.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      eventType === "All" ? true : event.event_type === eventType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVESTIGATION TIMELINE</p>
            <h2>Case activity timeline</h2>
          </div>
          <span className="case-label">Loading...</span>
        </div>
        <p>Loading investigation timeline...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVESTIGATION TIMELINE</p>
            <h2>Case activity timeline</h2>
          </div>
          <span className="case-label">Error</span>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">INVESTIGATION TIMELINE</p>
          <h2>Case activity timeline</h2>
        </div>
        <span className="case-label">
          {timelineData.total_events} Events
        </span>
      </div>

      <p>
        View all investigation events in time order to understand what happened
        first and what happened next.
      </p>

      <div className="evidence-controls">
        <input
          className="evidence-search"
          placeholder="Search alias or event..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="evidence-filter"
          value={eventType}
          onChange={(event) => setEventType(event.target.value)}
        >
          <option value="All">All events</option>
          <option value="Post">Posts</option>
          <option value="Wallet Activity">Wallet Activity</option>
          <option value="Transaction">Transactions</option>
          <option value="Phone Record">Phone Records</option>
        </select>
      </div>

      <div className="timeline-list">
        {filteredEvents.map((event) => (
          <article className="timeline-card" key={event.id}>
            <div className="timeline-marker">
              <span></span>
            </div>

            <div className="timeline-content">
              <div className="timeline-header">
                <div>
                  <span className="evidence-id">{event.event_type}</span>
                  <h3>{event.title}</h3>
                </div>

                <span className="timeline-time">
                  {new Date(event.timestamp).toLocaleString()}
                </span>
              </div>

              <p>{event.description}</p>

              <div className="timeline-meta">
                <span>
                  <strong>Alias:</strong> {event.alias_name}
                </span>
                <span>
                  <strong>Source:</strong> {event.source}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PriorityPanel() {
  const [priorityData, setPriorityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [priorityLevel, setPriorityLevel] = useState("All");

  useEffect(() => {
    async function loadPriority() {
      try {
        const response = await fetch(`${API_BASE_URL}/priority/`);

        if (!response.ok) {
          throw new Error(`Failed to load priority data: ${response.status}`);
        }

        setPriorityData(await response.json());
      } catch (loadError) {
        setError(loadError.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadPriority();
  }, []);

  const filteredPriorities = (priorityData?.priorities || []).filter((item) => {
    const matchesSearch = item.alias_name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesLevel =
      priorityLevel === "All"
        ? true
        : item.priority_level === priorityLevel;

    return matchesSearch && matchesLevel;
  });

  if (loading) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVESTIGATION PRIORITY</p>
            <h2>Case priority workspace</h2>
          </div>
          <span className="case-label">Loading...</span>
        </div>
        <p>Loading investigation priority data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVESTIGATION PRIORITY</p>
            <h2>Case priority workspace</h2>
          </div>
          <span className="case-label">Error</span>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">INVESTIGATION PRIORITY</p>
          <h2>Case priority workspace</h2>
        </div>
        <span className="case-label">
          {priorityData.total_aliases} Aliases
        </span>
      </div>

      <p>
        This page shows which aliases may need investigator attention first
        based on available evidence. It is investigation support, not a final
        decision.
      </p>

      <div className="evidence-controls">
        <input
          className="evidence-search"
          placeholder="Search alias..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="evidence-filter"
          value={priorityLevel}
          onChange={(event) => setPriorityLevel(event.target.value)}
        >
          <option value="All">All priority levels</option>
          <option value="High">High priority</option>
          <option value="Medium">Medium priority</option>
          <option value="Low">Low priority</option>
        </select>
      </div>

      <div className="priority-list">
        {filteredPriorities.map((item) => (
          <article
            className={`priority-card priority-${item.priority_level.toLowerCase()}`}
            key={item.alias_id}
          >
            <div className="priority-header">
              <div>
                <span className="evidence-id">ALIAS PROFILE</span>
                <h3>{item.alias_name}</h3>
              </div>

              <span className="priority-level">
                {item.priority_level} Priority
              </span>
            </div>

            <div className="priority-score">
              <span>Priority Score</span>
              <strong>{item.priority_score}</strong>
            </div>

            <div className="priority-details">
              <span><strong>Posts:</strong> {item.post_count}</span>
              <span><strong>Wallets:</strong> {item.wallet_count}</span>
              <span><strong>Phone Records:</strong> {item.phone_count}</span>
              <span><strong>Possible Phone Links:</strong> {item.possible_phone_links}</span>
              <span><strong>Transactions:</strong> {item.transaction_count}</span>
            </div>

            <div className="priority-bar">
              <div
                className="priority-bar-fill"
                style={{
                  width: `${Math.min(item.priority_score, 100)}%`,
                }}
              ></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LeadReportPanel() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlias, setSelectedAlias] = useState("");

  useEffect(() => {
    async function loadReports() {
      try {
        const response = await fetch(`${API_BASE_URL}/lead-report/`);

        if (!response.ok) {
          throw new Error(`Failed to load lead reports: ${response.status}`);
        }

        setReportData(await response.json());
      } catch (loadError) {
        setError(loadError.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadReports();
  }, []);

  const selectedReport = (reportData?.reports || []).find(
    (report) => String(report.alias_id) === String(selectedAlias)
  );

  function exportLeadCSV() {
    if (!selectedReport) return;

    const rows = [
      ["Investigation Lead Report"],
      ["Alias Name", selectedReport.alias_name],
      ["Priority Level", selectedReport.priority_level],
      ["Priority Score", selectedReport.priority_score],
      [],
      ["Evidence Summary"],
      ["Posts", selectedReport.post_count],
      ["Wallets", selectedReport.wallet_count],
      ["Phone Records", selectedReport.phone_count],
      ["Possible Phone Links", selectedReport.possible_phone_links],
      ["Transactions", selectedReport.transaction_count],
      [],
      ["Restricted / Not Collected"],
      ...selectedReport.restricted_fields.map((field) => [field]),
      [],
      ["Investigator Recommendations"],
      ...selectedReport.recommendations.map((rec) => [rec]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `lead_report_${selectedReport.alias_name}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVESTIGATION LEAD REPORT</p>
            <h2>Case lead report workspace</h2>
          </div>
          <span className="case-label">Loading...</span>
        </div>
        <p>Loading investigation lead reports...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">INVESTIGATION LEAD REPORT</p>
            <h2>Case lead report workspace</h2>
          </div>
          <span className="case-label">Error</span>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">INVESTIGATION LEAD REPORT</p>
          <h2>Case lead report workspace</h2>
        </div>
        <span className="case-label">
          {reportData.total_reports} Reports
        </span>
      </div>

      <p>
        Select an alias to generate an investigation lead report with evidence
        summary, restricted data status, and investigator recommendations.
      </p>

      <div className="evidence-controls">
        <select
          className="evidence-filter"
          value={selectedAlias}
          onChange={(event) => setSelectedAlias(event.target.value)}
        >
          <option value="">Select Alias</option>
          {(reportData?.reports || []).map((report) => (
            <option key={report.alias_id} value={report.alias_id}>
              {report.alias_name}
            </option>
          ))}
        </select>

        <button
          className="secondary-button"
          onClick={exportLeadCSV}
          disabled={!selectedReport}
        >
          Export Lead Report (CSV)
        </button>
      </div>

      {selectedReport && (
        <div className="lead-report-card">
          <div className="lead-report-header">
            <div>
              <span className="evidence-id">INVESTIGATION LEAD REPORT</span>
              <h3>{selectedReport.alias_name}</h3>
            </div>

            <span className="priority-level">
              {selectedReport.priority_level} Priority
            </span>
          </div>

          <div className="lead-report-section">
            <h4>Evidence Summary</h4>
            <div className="lead-report-details">
              <span><strong>Posts:</strong> {selectedReport.post_count}</span>
              <span><strong>Wallets:</strong> {selectedReport.wallet_count}</span>
              <span><strong>Phone Records:</strong> {selectedReport.phone_count}</span>
              <span><strong>Possible Phone Links:</strong> {selectedReport.possible_phone_links}</span>
              <span><strong>Transactions:</strong> {selectedReport.transaction_count}</span>
              <span><strong>Priority Score:</strong> {selectedReport.priority_score}</span>
            </div>
          </div>

          <div className="lead-report-section">
            <h4>Restricted / Not Collected</h4>
            {selectedReport.restricted_fields.length > 0 ? (
              selectedReport.restricted_fields.map((field) => (
                <p key={field} className="restricted-field">{field}</p>
              ))
            ) : (
              <p>No restricted fields. All major evidence types are available.</p>
            )}
          </div>

          <div className="lead-report-section">
            <h4>Investigator Recommendations</h4>
            {selectedReport.recommendations.map((rec) => (
              <p key={rec}>• {rec}</p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function DualGraphPanel() {
  const [graphData, setGraphData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [graphType, setGraphType] = useState("connected");

  useEffect(() => {
    async function loadGraph() {
      try {
        const response = await fetch(`${API_BASE_URL}/dual-graph/`);

        if (!response.ok) {
          throw new Error(`Failed to load dual graph: ${response.status}`);
        }

        setGraphData(await response.json());
      } catch (loadError) {
        setError(loadError.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadGraph();
  }, []);

  if (loading) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DUAL GRAPH EVIDENCE PREDICTION</p>
            <h2>Connected and potential links</h2>
          </div>
          <span className="case-label">Loading...</span>
        </div>
        <p>Loading dual graph data...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">DUAL GRAPH EVIDENCE PREDICTION</p>
            <h2>Connected and potential links</h2>
          </div>
          <span className="case-label">Error</span>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  const links =
    graphType === "connected"
      ? graphData.connected_links
      : graphData.potential_links;

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">DUAL GRAPH EVIDENCE PREDICTION</p>
          <h2>Connected and potential links</h2>
        </div>
        <span className="case-label">
          {graphData.nodes.length} Aliases
        </span>
      </div>

      <p>
        View direct evidence links and potential indirect links between aliases.
        This supports investigation but does not declare anyone guilty.
      </p>

      <div className="evidence-controls">
        <button
          className={
            graphType === "connected"
              ? "primary-button"
              : "secondary-button"
          }
          onClick={() => setGraphType("connected")}
        >
          Connected Graph
        </button>

        <button
          className={
            graphType === "potential"
              ? "primary-button"
              : "secondary-button"
          }
          onClick={() => setGraphType("potential")}
        >
          Potential Graph
        </button>
      </div>

      <div className="dual-graph-card">
        <svg viewBox="0 0 600 400" className="dual-graph-svg">
          {graphData.nodes.map((node, index) => {
            const angle = (index / graphData.nodes.length) * 2 * Math.PI;
            const x = 300 + 180 * Math.cos(angle);
            const y = 200 + 140 * Math.sin(angle);

            return (
              <g key={node.id}>
                <circle cx={x} cy={y} r={22} className="dual-graph-node" />
                <text
                  x={x}
                  y={y + 4}
                  textAnchor="middle"
                  className="dual-graph-label"
                >
                  {node.alias_name}
                </text>
              </g>
            );
          })}

          {links.map((link, index) => {
            const sourceIndex = graphData.nodes.findIndex(
              (node) => node.alias_name === link.source
            );
            const targetIndex = graphData.nodes.findIndex(
              (node) => node.alias_name === link.target
            );

            if (sourceIndex === -1 || targetIndex === -1) return null;

            const sourceAngle =
              (sourceIndex / graphData.nodes.length) * 2 * Math.PI;
            const targetAngle =
              (targetIndex / graphData.nodes.length) * 2 * Math.PI;

            const x1 = 300 + 180 * Math.cos(sourceAngle);
            const y1 = 200 + 140 * Math.sin(sourceAngle);
            const x2 = 300 + 180 * Math.cos(targetAngle);
            const y2 = 200 + 140 * Math.sin(targetAngle);

            return (
              <line
                key={index}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={
                  graphType === "connected"
                    ? "dual-graph-line connected"
                    : "dual-graph-line potential"
                }
              />
            );
          })}
        </svg>

        <div className="dual-graph-legend">
          <span className="legend-item connected">Direct evidence link</span>
          <span className="legend-item potential">Potential indirect link</span>
        </div>

        <div className="dual-graph-links">
          {links.length === 0 ? (
            <p>No {graphType} links found.</p>
          ) : (
            links.map((link, index) => (
              <div className="dual-graph-link" key={index}>
                <strong>{link.source}</strong>
                <span> → </span>
                <strong>{link.target}</strong>
                <p>{link.reason}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function MultilingualPanel() {
  const [singleTranslations, setSingleTranslations] = useState({});
  const [multiData, setMultiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [targetLanguage, setTargetLanguage] = useState("en");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadMultilingual() {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/multilingual/?target_language=${targetLanguage}`
        );

        if (!response.ok) {
          throw new Error(`Failed to load multilingual data: ${response.status}`);
        }

        setMultiData(await response.json());
      } catch (loadError) {
        setError(loadError.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    loadMultilingual();
  }, [targetLanguage]);

  const filteredPosts = (multiData?.posts || []).filter((post) => {
    return (
      post.alias_name.toLowerCase().includes(search.toLowerCase()) ||
      post.original_text.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (loading) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MULTILINGUAL TEXT ANALYSIS</p>
            <h2>Language detection and translation</h2>
          </div>
          <span className="case-label">Loading...</span>
        </div>
        <p>Loading multilingual analysis...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="selection-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">MULTILINGUAL TEXT ANALYSIS</p>
            <h2>Language detection and translation</h2>
          </div>
          <span className="case-label">Error</span>
        </div>
        <p style={{ color: "red" }}>Error: {error}</p>
      </section>
    );
  }

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">MULTILINGUAL TEXT ANALYSIS</p>
          <h2>Language detection and translation</h2>
        </div>
        <span className="case-label">
          {multiData.total_posts} Posts
        </span>
      </div>

      <p>
        Detect the language of each post and translate it into your preferred
        language while keeping the original text.
      </p>

      <div className="evidence-controls">
        <input
          className="evidence-search"
          placeholder="Search alias or post text..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          className="evidence-filter"
          value={targetLanguage}
          onChange={(event) => setTargetLanguage(event.target.value)}
        >
          <option value="en">Translate to English</option>
          <option value="hi">Translate to Hindi</option>
          <option value="ta">Translate to Tamil</option>
          <option value="zh-CN">Translate to Chinese</option>
          <option value="ja">Translate to Japanese</option>
          <option value="ko">Translate to Korean</option>
          <option value="ml">Translate to Malayalam</option>
        </select>
      </div>

      <div className="multilingual-list">
        {filteredPosts.map((post) => (
          <article className="multilingual-card" key={post.post_id}>
            <div className="multilingual-header">
              <div>
                <span className="evidence-id">{post.alias_name}</span>
                <h3>Post #{post.post_id}</h3>
              </div>

              <span className="language-tag">
                {post.detected_language.toUpperCase()}
              </span>
            </div>

            <div className="multilingual-text">
              <h4>Original Text</h4>
              <p>{post.original_text}</p>
            </div>

           <div className="multilingual-text translated">
  <h4>Translated Text ({targetLanguage.toUpperCase()})</h4>

  <button
    className="secondary-button"
    onClick={async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/multilingual/translate-single?post_id=${post.post_id}&target_language=${targetLanguage}`
        );
        const data = await response.json();
        setSingleTranslations((prev) => ({
          ...prev,
          [post.post_id]: data,
        }));
      } catch (err) {
        console.error(err);
      }
    }}
  >
    Translate this post
  </button>

  {singleTranslations[post.post_id] && (
    <>
      <p>{singleTranslations[post.post_id].translated_text}</p>
      <span className="translation-status">
        {singleTranslations[post.post_id].status}
        {singleTranslations[post.post_id].error && (
          <span style={{ color: "red", display: "block", marginTop: 4 }}>
            Error: {singleTranslations[post.post_id].error}
          </span>
        )}
      </span>
    </>
  )}
</div>
            <div className="multilingual-meta">
              <span>
                <strong>Posted:</strong>{" "}
                {new Date(post.posted_at).toLocaleString()}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function getStatusClass(status) {
  return String(status)
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("/", "-");
}

function WalletPanel({ result, wallets, walletsLoading, onLoadWallets }) {
  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WALLET INTELLIGENCE</p>
          <h2>Wallet relationship workspace</h2>
        </div>

        <span className="case-label">{wallets.length} Wallets</span>
      </div>

      <p>Review wallet addresses, networks, activity counts, and evidence status.</p>

      <button
        className="primary-button"
        onClick={onLoadWallets}
        disabled={walletsLoading}
      >
        {walletsLoading ? "Loading wallets..." : "Load Wallet Evidence"}
      </button>

      {!walletsLoading && wallets.length === 0 && (
        <div className="evidence-card">
          <h3>No wallet records loaded</h3>
          <p>Click the button above to load simulated wallet evidence.</p>
        </div>
      )}

      {wallets.length > 0 && (
        <div className="wallet-record-list">
          {wallets.map((wallet) => (
            <article className="wallet-record" key={wallet.id}>
              <div className="wallet-record-heading">
                <div>
                  <span className="evidence-id">{wallet.network}</span>
                  <h3>{wallet.address}</h3>
                </div>

                <span className={`evidence-status ${getStatusClass(wallet.status)}`}>
                  {wallet.status}
                </span>
              </div>

              <div className="wallet-details">
                <span><strong>Alias:</strong> {wallet.alias_name}</span>
                <span><strong>Transactions:</strong> {wallet.transaction_count}</span>
                <span><strong>First seen:</strong> {wallet.first_seen}</span>
                <span><strong>Last seen:</strong> {wallet.last_seen}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {result && (
        <div className="evidence-card">
          <h3>Current identity-link wallet score</h3>
          <p>{result.wallet_score ?? result.scores?.wallet ?? "--"}%</p>
        </div>
      )}
    </section>
  );
}

function TransactionsPanel({
  transactions = [],
  transactionsLoading = false,
  onLoadTransactions = () => {},
}) {
  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">TRANSACTION INTELLIGENCE</p>
          <h2>Blockchain transaction workspace</h2>
        </div>

        <span className="case-label">{transactions.length} Transactions</span>
      </div>

      <p>
        Review sender, receiver, amount, timestamp, and transaction relationship
        evidence.
      </p>

      <button
        className="primary-button"
        onClick={onLoadTransactions}
        disabled={transactionsLoading}
      >
        {transactionsLoading
          ? "Loading transactions..."
          : "Load Transaction Evidence"}
      </button>

      <TransactionFlow transactions={transactions} />

      {!transactionsLoading && transactions.length === 0 && (
        <div className="evidence-card">
          <h3>No transaction records loaded</h3>
          <p>Click the button above to load simulated blockchain evidence.</p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <article
              className="transaction-record"
              key={transaction.id || transaction.transaction_hash}
            >
              <div className="transaction-header">
                <div>
                  <span className="evidence-id">{transaction.network}</span>
                  <h3>{transaction.transaction_hash}</h3>
                </div>

                <span
                  className={`evidence-status ${getStatusClass(transaction.status)}`}
                >
                  {transaction.status}
                </span>
              </div>

              <div className="transaction-flow">
                <div>
                  <small>Sender</small>
                  <code>{transaction.sender}</code>
                </div>

                <span className="transaction-arrow">→</span>

                <div>
                  <small>Receiver</small>
                  <code>{transaction.receiver}</code>
                </div>
              </div>

              <div className="transaction-details">
                <span><strong>Amount:</strong> {transaction.amount}</span>
                <span><strong>Time:</strong> {transaction.timestamp}</span>
                <span><strong>Relationship:</strong> {transaction.relationship}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function NlpPanel({ result, aliases = [], wallets = [], transactions = [] }) {
  const nlpData = result?.nlp
    ? result.nlp
    : result
      ? {
          language_a: { language: "English", confidence: 100 },
          language_b: { language: "English", confidence: 100 },
          writing_style_score: result.writing_style_score,
          common_words: result.common_words || [],
          features_a: {},
          features_b: {},
        }
      : null;

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PYTHON NLP ANALYSIS</p>
          <h2>Language and stylometry workspace</h2>
        </div>

        <span className="case-label">
          {nlpData ? "Analysis Ready" : "Awaiting Analysis"}
        </span>
      </div>

      <p>
        Review language detection, translation status, writing-style features,
        and behavioural text patterns.
      </p>

      <NetworkGraph
        aliases={aliases}
        wallets={wallets}
        transactions={transactions}
      />

      {!nlpData ? (
        <div className="evidence-card">
          <h3>No NLP result available</h3>
          <p>
            Run an identity-link analysis first. NLP results will appear here
            after the analysis response is received.
          </p>
        </div>
      ) : (
        <>
          <div className="metric-grid">
            <MetricCard
              title="Writing Style"
              value={nlpData.writing_style_score ?? "--"}
              suffix="%"
            />
            <MetricCard
              title="Language A"
              value={nlpData.language_a?.language ?? "--"}
              suffix=""
            />
            <MetricCard
              title="Language B"
              value={nlpData.language_b?.language ?? "--"}
              suffix=""
            />
            <MetricCard
              title="Common Words"
              value={nlpData.common_words?.length ?? 0}
              suffix=""
            />
          </div>

          <div className="nlp-grid">
            <article className="evidence-card">
              <p className="eyebrow">LANGUAGE DETECTION</p>
              <h3>{nlpData.language_a?.language ?? "Unknown"}</h3>

              <p>
                Alias A confidence: {nlpData.language_a?.confidence ?? "--"}%
              </p>
              <p>
                Alias B confidence: {nlpData.language_b?.confidence ?? "--"}%
              </p>

              <span className="tag">Detected</span>
            </article>

            <article className="evidence-card">
              <p className="eyebrow">TRANSLATION STATUS</p>
              <h3>{nlpData.translation_status || "Not Required"}</h3>

              <p>Translation status returned by the Python NLP service.</p>

              <span className="tag">NLP Service</span>
            </article>

            <article className="evidence-card">
              <p className="eyebrow">COMMON WORDS</p>

              <div className="tag-list">
                {nlpData.common_words?.length > 0 ? (
                  nlpData.common_words.map((word) => (
                    <span className="tag" key={word}>{word}</span>
                  ))
                ) : (
                  <span className="tag">None detected</span>
                )}
              </div>
            </article>

            <article className="evidence-card">
              <p className="eyebrow">SOURCE STATUS</p>
              <h3>Requires human review</h3>

              <p>
                Stylometry and language similarity indicate investigative leads
                rather than definitive attribution.
              </p>

              <span className="tag">Explainable</span>
            </article>
          </div>
        </>
      )}
    </section>
  );
}

function ReportsPanel({
  message,
  result,
  reports,
  reportsLoading,
  onLoadReports,
}) {
  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">INVESTIGATION REPORTS</p>
          <h2>Saved investigation reports</h2>
        </div>

        <span className="case-label">{reports.length} Reports</span>
      </div>

      {message && <div className="message-box">{message}</div>}

      <button
        className="primary-button"
        onClick={onLoadReports}
        disabled={reportsLoading}
      >
        {reportsLoading ? "Loading reports..." : "Load Saved Reports"}
      </button>

      {result && (
        <div className="evidence-card latest-report">
          <p className="eyebrow">CURRENT ANALYSIS</p>
          <h3>Latest investigation result</h3>

          <p>
            Confidence:{" "}
            {result.final_confidence_score ??
              result.similarity?.final_confidence_score ??
              "--"}
            %
          </p>

          <p>
            Risk level:{" "}
            {result.risk_level ?? result.similarity?.risk_level ?? "Unknown"}
          </p>

          <p>This result is an investigation lead and requires human review.</p>
        </div>
      )}

      {!reportsLoading && reports.length === 0 && (
        <div className="evidence-card">
          <h3>No saved reports available</h3>
          <p>Click the button above to load saved investigation reports.</p>
        </div>
      )}

      {reports.length > 0 && (
        <div className="report-list">
          {reports.map((report) => (
            <article className="report-record" key={report.id}>
              <div className="report-record-header">
                <div>
                  <span className="evidence-id">{report.id}</span>
                  <h3>{report.case_id}</h3>
                </div>

                <span className="evidence-status inferred">{report.status}</span>
              </div>

              <div className="report-details">
                <span><strong>Alias A:</strong> {report.alias_a}</span>
                <span><strong>Alias B:</strong> {report.alias_b}</span>
                <span><strong>Confidence:</strong> {report.confidence_score}%</span>
                <span><strong>Risk:</strong> {report.risk_level}</span>
                <span><strong>Evidence:</strong> {report.evidence_count}</span>
                <span><strong>Created:</strong> {report.created_at}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function MetricCard({ title, value, suffix }) {
  return (
    <div className="metric-card">
      <p>{title}</p>
      <strong>{value}{suffix}</strong>
    </div>
  );
}

export default App;