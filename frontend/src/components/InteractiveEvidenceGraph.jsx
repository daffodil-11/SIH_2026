import { useState } from "react";

const graphNodes = [
  {
    id: "alias-a",
    label: "Alias A",
    type: "alias",
    x: 18,
    y: 50,
  },
  {
    id: "post-a",
    label: "Post A",
    type: "post",
    x: 38,
    y: 25,
  },
  {
    id: "wallet-a",
    label: "Wallet A",
    type: "wallet",
    x: 39,
    y: 75,
  },
  {
    id: "transaction",
    label: "TX-1048",
    type: "transaction",
    x: 62,
    y: 50,
  },
  {
    id: "wallet-b",
    label: "Wallet B",
    type: "wallet",
    x: 80,
    y: 27,
  },
  {
    id: "alias-b",
    label: "Alias B",
    type: "alias",
    x: 82,
    y: 75,
  },
];

const graphLinks = [
  ["alias-a", "post-a"],
  ["alias-a", "wallet-a"],
  ["wallet-a", "transaction"],
  ["transaction", "wallet-b"],
  ["wallet-b", "alias-b"],
];

function InteractiveEvidenceGraph({ result }) {
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <section className="graph-panel">
      <div className="graph-heading">
        <div>
          <p className="eyebrow">RELATIONSHIP GRAPH</p>
          <h2>Evidence linkage network</h2>
          <p>
            Explore aliases, posts, wallets, and transaction relationships.
          </p>
        </div>

        <span className="case-label">
          {result ? "Analysis Linked" : "Simulated Graph"}
        </span>
      </div>

      <div className="graph-canvas">
        <svg
          className="graph-lines"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {graphLinks.map(([fromId, toId]) => {
            const from = graphNodes.find((node) => node.id === fromId);
            const to = graphNodes.find((node) => node.id === toId);

            return (
              <line
                key={`${fromId}-${toId}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className="graph-link"
              />
            );
          })}
        </svg>

        {graphNodes.map((node) => (
          <button
            key={node.id}
            className={`graph-node graph-node-${node.type}`}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
            }}
            onClick={() => setSelectedNode(node)}
          >
            <span className="graph-node-core"></span>
            <span className="graph-node-label">{node.label}</span>
          </button>
        ))}

        <div className="graph-legend">
          <span>
            <i className="legend-alias"></i>
            Alias
          </span>

          <span>
            <i className="legend-post"></i>
            Post
          </span>

          <span>
            <i className="legend-wallet"></i>
            Wallet
          </span>

          <span>
            <i className="legend-transaction"></i>
            Transaction
          </span>
        </div>
      </div>

      {selectedNode && (
        <div className="graph-inspector">
          <span className="eyebrow">SELECTED NODE</span>
          <strong>{selectedNode.label}</strong>
          <span>Type: {selectedNode.type}</span>

          <button
            className="graph-close-button"
            onClick={() => setSelectedNode(null)}
          >
            Close
          </button>
        </div>
      )}
    </section>
  );
}

export default InteractiveEvidenceGraph;