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

  async function loadWallets() {
    setWalletsLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/wallets/`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Could not load wallets.");
      }

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

      if (!response.ok) {
        throw new Error(data.detail || "Could not load transactions.");
      }

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

      if (!response.ok) {
        throw new Error(data.detail || "Could not load reports.");
      }

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

            {activeModule === "Evidence" && (
              <EvidencePanel result={result} />
            )}

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
              <NlpPanel result={result} />
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
            Compare two aliases using writing style, wallet evidence,
            activity behaviour, and transaction relationships.
          </p>
        </div>

        <div className="scan-symbol">⌁</div>
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

function ProfileCard({ profile, label }) {
  if (!profile) {
    return (
      <article className="profile-card profile-card-empty">
        <p className="eyebrow">{label}</p>

        <div className="profile-photo-placeholder">
          PROFILE NOT SELECTED
        </div>

        <p>Select an alias to view profile details.</p>
      </article>
    );
  }

  return (
    <article className="profile-card">
      <p className="eyebrow">{label}</p>

      <div className="profile-photo-frame">
        {profile.photo_url ? (
          <img
            src={profile.photo_url}
            alt={`${profile.alias_name} profile`}
            className="profile-photo"
          />
        ) : (
          <div className="profile-photo-placeholder">
            PHOTO NOT AVAILABLE
          </div>
        )}
      </div>

      <div className="profile-details">
        <h3>{profile.alias_name}</h3>

        <p className="profile-platform">{profile.platform}</p>

        <div className="profile-meta">
          <span>
            <strong>Profile ID:</strong>{" "}
            {profile.profile_id || "Not Collected"}
          </span>

          <span>
            <strong>Language:</strong>{" "}
            {profile.language || "Not Collected"}
          </span>

          <span>
            <strong>First seen:</strong>{" "}
            {profile.first_seen || "Not Collected"}
          </span>

          <span>
            <strong>Last active:</strong>{" "}
            {profile.last_active || "Not Collected"}
          </span>

          <span>
            <strong>Activity:</strong>{" "}
            {profile.activity_status || "Not Collected"}
          </span>

          <span>
            <strong>Evidence:</strong>{" "}
            {profile.evidence_status || "Not Collected"}
          </span>
        </div>
      </div>
    </article>
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
  const evidenceItems = result
    ? [
        {
          id: "EVD-001",
          category: "Writing Style",
          description:
            "Similar sentence structure, punctuation habits, and repeated phrase patterns.",
          source: "SIM-FORUM-POST-001",
          status: "Inferred",
          score: result.writing_style_score,
        },
        {
          id: "EVD-002",
          category: "Behaviour",
          description:
            "Similar activity timing and posting behaviour were observed.",
          source: "SIM-ACTIVITY-004",
          status: "Inferred",
          score: result.behavior_score,
        },
        {
          id: "EVD-003",
          category: "Wallet",
          description:
            "Wallet relationship evidence was checked for the selected aliases.",
          source: "SIM-WALLET-009",
          status:
            result.wallet_score > 0 ? "Observed" : "Not Collected",
          score: result.wallet_score,
        },
        {
          id: "EVD-004",
          category: "Language",
          description:
            "Language and common-word patterns were compared between the aliases.",
          source: "SIM-NLP-002",
          status: "Observed",
          score: result.common_word_count,
        },
        {
          id: "EVD-005",
          category: "Transactions",
          description:
            "Transaction relationship evidence is reserved for the blockchain analysis module.",
          source: "SIM-TX-013",
          status: "Restricted",
          score: "—",
        },
      ]
    : [];

  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">EVIDENCE EXPLORER</p>
          <h2>Source-tracked evidence</h2>
        </div>

        <span className="case-label">{evidenceItems.length} Records</span>
      </div>

      {!result ? (
        <div className="evidence-card">
          <h3>No analysis available</h3>
          <p>
            Run an identity-link analysis first. Evidence records will appear
            here after the analysis response is received.
          </p>
        </div>
      ) : (
        <>
          <div className="metric-grid">
            <MetricCard
              title="Evidence Count"
              value={evidenceItems.length}
              suffix=""
            />

            <MetricCard
              title="Confidence"
              value={result.final_confidence_score}
              suffix="%"
            />

            <MetricCard
              title="Writing Style"
              value={result.writing_style_score}
              suffix="%"
            />

            <MetricCard
              title="Wallet Score"
              value={result.wallet_score}
              suffix="%"
            />
          </div>

          <div className="evidence-list">
            {evidenceItems.map((item) => (
              <article className="evidence-record" key={item.id}>
                <div className="evidence-record-header">
                  <div>
                    <span className="evidence-id">{item.id}</span>
                    <h3>{item.category}</h3>
                  </div>

                  <span
                    className={`evidence-status ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p>{item.description}</p>

                <div className="evidence-record-meta">
                  <span>
                    <strong>Source:</strong> {item.source}
                  </span>

                  <span>
                    <strong>Score:</strong> {item.score}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function getStatusClass(status) {
  return status
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll("/", "-");
}

function WalletPanel({
  result,
  wallets,
  walletsLoading,
  onLoadWallets,
}) {
  return (
    <section className="selection-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">WALLET INTELLIGENCE</p>
          <h2>Wallet relationship workspace</h2>
        </div>

        <span className="case-label">{wallets.length} Wallets</span>
      </div>

      <p>
        Review wallet addresses, networks, activity counts, and evidence
        status.
      </p>

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

                <span
                  className={`evidence-status ${getStatusClass(
                    wallet.status
                  )}`}
                >
                  {wallet.status}
                </span>
              </div>

              <div className="wallet-details">
                <span>
                  <strong>Alias:</strong> {wallet.alias_name}
                </span>

                <span>
                  <strong>Transactions:</strong>{" "}
                  {wallet.transaction_count}
                </span>

                <span>
                  <strong>First seen:</strong> {wallet.first_seen}
                </span>

                <span>
                  <strong>Last seen:</strong> {wallet.last_seen}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {result && (
        <div className="evidence-card">
          <h3>Current identity-link wallet score</h3>
          <p>{result.wallet_score}%</p>
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

        <span className="case-label">
          {transactions.length} Transactions
        </span>
      </div>

      <p>
        Review sender, receiver, amount, timestamp, and transaction
        relationship evidence.
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

      {!transactionsLoading && transactions.length === 0 && (
        <div className="evidence-card">
          <h3>No transaction records loaded</h3>
          <p>
            Click the button above to load simulated blockchain evidence.
          </p>
        </div>
      )}

      {transactions.length > 0 && (
        <div className="transaction-list">
          {transactions.map((transaction) => (
            <article
              className="transaction-record"
              key={transaction.id}
            >
              <div className="transaction-header">
                <div>
                  <span className="evidence-id">
                    {transaction.network}
                  </span>

                  <h3>{transaction.transaction_hash}</h3>
                </div>

                <span
                  className={`evidence-status ${getStatusClass(
                    transaction.status
                  )}`}
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
                <span>
                  <strong>Amount:</strong> {transaction.amount}
                </span>

                <span>
                  <strong>Time:</strong> {transaction.timestamp}
                </span>

                <span>
                  <strong>Relationship:</strong>{" "}
                  {transaction.relationship}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function NlpPanel({ result }) {
  const nlpData = result
    ? {
        detectedLanguage: "English",
        translationStatus: "Not Required",
        writingStyleScore: result.writing_style_score,
        behaviourScore: result.behavior_score,
        commonWordCount: result.common_word_count,
        sentencePattern: "Similar",
        punctuationPattern: "Potentially Similar",
        sourceStatus: "Inferred from simulated posts",
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
              value={nlpData.writingStyleScore}
              suffix="%"
            />

            <MetricCard
              title="Behaviour"
              value={nlpData.behaviourScore}
              suffix="%"
            />

            <MetricCard
              title="Common Words"
              value={nlpData.commonWordCount}
              suffix=""
            />

            <MetricCard
              title="Language"
              value={nlpData.detectedLanguage}
              suffix=""
            />
          </div>

          <div className="nlp-grid">
            <article className="evidence-card">
              <p className="eyebrow">LANGUAGE DETECTION</p>
              <h3>{nlpData.detectedLanguage}</h3>
              <p>
                Both selected profiles currently contain simulated English
                text.
              </p>
              <span className="tag">Observed</span>
            </article>

            <article className="evidence-card">
              <p className="eyebrow">TRANSLATION STATUS</p>
              <h3>{nlpData.translationStatus}</h3>
              <p>
                Translation is not required for the current simulated sample.
              </p>
              <span className="tag">Not Required</span>
            </article>

            <article className="evidence-card">
              <p className="eyebrow">WRITING PATTERNS</p>
              <h3>{nlpData.sentencePattern}</h3>
              <p>
                Sentence construction and punctuation patterns show potential
                similarity.
              </p>
              <span className="tag">Inferred</span>
            </article>

            <article className="evidence-card">
              <p className="eyebrow">SOURCE STATUS</p>
              <h3>{nlpData.sourceStatus}</h3>
              <p>
                This result is an investigation lead and requires human review.
              </p>
              <span className="tag">Simulated Data</span>
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

        <span className="case-label">
          {reports.length} Reports
        </span>
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
            Confidence: {result.final_confidence_score}%
          </p>
          <p>
            Risk level: {result.risk_level}
          </p>
          <p>
            This result is an investigation lead and requires human review.
          </p>
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

                <span className="evidence-status inferred">
                  {report.status}
                </span>
              </div>

              <div className="report-details">
                <span>
                  <strong>Alias A:</strong> {report.alias_a}
                </span>

                <span>
                  <strong>Alias B:</strong> {report.alias_b}
                </span>

                <span>
                  <strong>Confidence:</strong>{" "}
                  {report.confidence_score}%
                </span>

                <span>
                  <strong>Risk:</strong> {report.risk_level}
                </span>

                <span>
                  <strong>Evidence:</strong>{" "}
                  {report.evidence_count}
                </span>

                <span>
                  <strong>Created:</strong> {report.created_at}
                </span>
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

      <strong>
        {value}
        {suffix}
      </strong>
    </div>
  );
}

export default App;