import os
from typing import Any

from dotenv import load_dotenv
from neo4j import GraphDatabase

load_dotenv()

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USERNAME = os.getenv("NEO4J_USERNAME", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")

driver = GraphDatabase.driver(
    NEO4J_URI,
    auth=(NEO4J_USERNAME, NEO4J_PASSWORD),
)


def verify_connection() -> None:
    driver.verify_connectivity()


def close_connection() -> None:
    driver.close()


def get_alias_graph(alias_a_id: int, alias_b_id: int) -> dict[str, list[dict[str, Any]]]:
    query = """
    MATCH (start)
    WHERE
        (
            start:Alias
            AND toInteger(start.id) IN [$alias_a_id, $alias_b_id]
        )
    MATCH path = (start)-[*0..3]-(connected)
    WITH collect(path) AS paths
    UNWIND paths AS path
    UNWIND nodes(path) AS node
    WITH collect(DISTINCT node) AS graph_nodes, paths
    UNWIND paths AS path
    UNWIND relationships(path) AS relationship
    RETURN
        graph_nodes,
        collect(DISTINCT relationship) AS graph_relationships
    """

    with driver.session(database=NEO4J_DATABASE) as session:
        record = session.run(
            query,
            alias_a_id=alias_a_id,
            alias_b_id=alias_b_id,
        ).single()

    if not record:
        return {"nodes": [], "edges": []}

    nodes = []

    for node in record["graph_nodes"]:
        nodes.append(
            {
                "id": str(node.element_id),
                "labels": list(node.labels),
                "properties": dict(node),
            }
        )

    edges = []

    for relationship in record["graph_relationships"]:
        edges.append(
            {
                "id": str(relationship.element_id),
                "source": str(relationship.start_node.element_id),
                "target": str(relationship.end_node.element_id),
                "type": relationship.type,
                "properties": dict(relationship),
            }
        )

    return {
        "nodes": nodes,
        "edges": edges,
    }