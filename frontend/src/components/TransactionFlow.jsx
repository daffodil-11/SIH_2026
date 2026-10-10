function TransactionFlow({ transactions = [] }) {
  return (
    <section className="transaction-visual-card">
      <div className="section-heading">
        <div>
          <p className="eyebrow">BLOCKCHAIN FLOW</p>
          <h2>Transaction movement</h2>
        </div>

        <span className="case-label">{transactions.length} Transfers</span>
      </div>

      {transactions.length === 0 ? (
        <div className="blockchain-empty">
          <span className="coin-icon" aria-hidden="true">B</span>
          <p>No transaction relationships available.</p>
        </div>
      ) : (
        <div className="transaction-flow-visual">
          {transactions.map((transaction) => (
            <article
              className="transaction-flow-item"
              key={transaction.id || transaction.hash || transaction.transaction_hash}
            >
              <div className="flow-wallet">
                <span className="coin-icon" aria-hidden="true">B</span>
                <small>Sender</small>
                <strong>{transaction.sender}</strong>
              </div>

              <div className="flow-arrow">
                <span>{transaction.amount}</span>
                <i>-&gt;</i>
                <small>{transaction.relationship}</small>
              </div>

              <div className="flow-wallet">
                <span className="coin-icon receiver" aria-hidden="true">B</span>
                <small>Receiver</small>
                <strong>{transaction.receiver}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default TransactionFlow;
