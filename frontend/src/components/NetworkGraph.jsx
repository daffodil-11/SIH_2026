import { useMemo, useState } from "react";

function shortLabel(value, fallback) {
  const text = String(value || fallback || "node");
  return text.length > 14 ? `${text.slice(0, 6)}...${text.slice(-4)}` : text;
}

export default function NetworkGraph({ aliases = [], wallets = [], transactions = [] }) {
  const [selectedNode, setSelectedNode] = useState(null);

  const graph = useMemo(() => {
    const safeAliases = Array.isArray(aliases) ? aliases : [];
    const safeWallets = Array.isArray(wallets) ? wallets : [];
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const nodes = [];
    const edges = [];
    const centerX = 480;
    const centerY = 250;

    safeAliases.slice(0, 6).forEach((alias, index) => {
      const angle = -140 + index * 56;
      nodes.push({
        id: `alias-${alias.id}`,
        label: alias.alias_name,
        detail: alias.platform || "Alias",
        type: "alias",
        x: centerX + Math.cos((angle * Math.PI) / 180) * 300,
        y: centerY + Math.sin((angle * Math.PI) / 180) * 155,
      });
    });

    safeWallets.slice(0, 8).forEach((wallet, index) => {
      const angle = 35 + index * 42;
      nodes.push({
        id: `wallet-${wallet.id}`,
        label: shortLabel(wallet.address, wallet.network),
        detail: wallet.network || "Wallet",
        type: "wallet",
        x: centerX + Math.cos((angle * Math.PI) / 180) * 245,
        y: centerY + Math.sin((angle * Math.PI) / 180) * 150,
      });

      const alias = safeAliases.find((item) => item.alias_name === wallet.alias_name);
      if (alias) {
        edges.push({ from: `alias-${alias.id}`, to: `wallet-${wallet.id}`, label: "owns" });
      }
    });

    safeTransactions.slice(0, 6).forEach((transaction, index) => {
      const id = transaction.id ?? transaction.transaction_hash ?? index;
      nodes.push({
        id: `tx-${id}`,
        label: shortLabel(transaction.transaction_hash, `TX-${index + 1}`),
        detail: transaction.relationship || "Transfer",
        type: "tx",
        x: centerX - 190 + index * 76,
        y: 450,
      });

      const wallet = safeWallets[index % Math.max(safeWallets.length, 1)];
      if (wallet) {
        edges.push({ from: `wallet-${wallet.id}`, to: `tx-${id}`, label: "funds" });
      }
    });

    nodes.push({
      id: "core",
      label: "Case Core",
      detail: "Relationship hub",
      type: "core",
      x: centerX,
      y: centerY,
    });

    nodes
      .filter((node) => node.id !== "core")
      .slice(0, 10)
      .forEach((node) => edges.push({ from: "core", to: node.id, label: "links" }));

    return { nodes, edges };
  }, [aliases, wallets, transactions]);

  if (graph.nodes.length <= 1) {
    return (
      <div className="network-empty">
        No graph data yet. Load wallets and transactions, then run an identity analysis.
      </div>
    );
  }

  return (
    <section className="network-graph-wrap">
      <div className="network-graph-header">
        <div>
          <p className="eyebrow">NODE RELATIONSHIP MAP</p>
          <h3>Evidence connection topology</h3>
        </div>
        <span className="case-label">{graph.nodes.length} Nodes</span>
      </div>

      <div className="network-map">
        <svg viewBox="0 0 960 560" role="img" aria-label="Evidence relationship graph">
          <defs>
            <linearGradient id="edgeGradient" x1="0" x2="1">
              <stop offset="0%" stopColor="#4da3ff" />
              <stop offset="100%" stopColor="#8ee8ff" />
            </linearGradient>
          </defs>

          {graph.edges.map((edge, index) => {
            const from = graph.nodes.find((node) => node.id === edge.from);
            const to = graph.nodes.find((node) => node.id === edge.to);
            if (!from || !to) return null;
            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <line className="network-edge" x1={from.x} y1={from.y} x2={to.x} y2={to.y} />
                <circle className="network-pulse" r="3">
                  <animateMotion dur={`${4 + (index % 3)}s`} repeatCount="indefinite" path={`M${from.x},${from.y} L${to.x},${to.y}`} />
                </circle>
              </g>
            );
          })}

          {graph.nodes.map((node) => (
            <g
              className={`network-node network-node-${node.type}`}
              key={node.id}
              onClick={() => setSelectedNode(node)}
              tabIndex="0"
            >
              <circle cx={node.x} cy={node.y} r={node.type === "core" ? 34 : 24} />
              <text x={node.x} y={node.y + 46} textAnchor="middle">{node.label}</text>
            </g>
          ))}
        </svg>

        {selectedNode && (
          <div className="network-inspector">
            <span className="eyebrow">SELECTED NODE</span>
            <strong>{selectedNode.label}</strong>
            <span>{selectedNode.detail}</span>
            <button type="button" onClick={() => setSelectedNode(null)}>Close</button>
          </div>
        )}
      </div>
    </section>
  );
}
