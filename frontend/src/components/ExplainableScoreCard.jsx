function ExplainableScoreCard({ similarity }) {
  if (!similarity) {
    return null;
  }

  return (
    <section className="score-card explainable-score-card">
      <div className="score-summary">
        <p className="eyebrow">EXPLAINABLE SIMILARITY</p>
        <h2>Confidence assessment</h2>
        <p>
          The score is calculated from weighted evidence components. It is an
          investigative lead, not a definitive identity claim.
        </p>

        <div className="score-display">
          <span>{similarity.final_confidence_score}</span>
          <small>/ 100</small>
          <strong>{similarity.risk_level} Risk</strong>
        </div>
      </div>

      <div className="score-breakdown">
        {similarity.explanations.map((item) => (
          <div className="score-factor" key={item.factor}>
            <div className="score-factor-heading">
              <span>{item.factor}</span>
              <strong>{item.raw_score}%</strong>
            </div>

            <div className="score-bar">
              <span
                style={{
                  width: `${item.raw_score}%`,
                }}
              ></span>
            </div>

            <div className="score-factor-meta">
              <span>Weight: {item.weight * 100}%</span>
              <span>Contribution: {item.contribution}</span>
            </div>

            <p>{item.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExplainableScoreCard;