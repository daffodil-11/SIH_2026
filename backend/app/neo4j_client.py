import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


load_dotenv()


NEO4J_URI = os.getenv(
    "NEO4J_URI",
    "neo4j://127.0.0.1:7687",
)

NEO4J_USERNAME = os.getenv(
    "NEO4J_USERNAME",
    "neo4j",
)

NEO4J_PASSWORD = os.getenv(
    "NEO4J_PASSWORD",
    "",
)

NEO4J_DATABASE = os.getenv(
    "NEO4J_DATABASE",
    "neo4j",
)


driver = GraphDatabase.driver(
    NEO4J_URI,
    auth=(
        NEO4J_USERNAME,
        NEO4J_PASSWORD,
    ),
)


def verify_neo4j_connection():
    driver.verify_connectivity()
    return True


def get_graph_data():
    query = """
    MATCH (source)-[relationship]->(target)
    RETURN
        elementId(source) AS source_id,
        labels(source) AS source_labels,
        properties(source) AS source_properties,
        type(relationship) AS relationship_type,
        elementId(target) AS target_id,
        labels(target) AS target_labels,
        properties(target) AS target_properties
    LIMIT 250
    """

    with driver.session(database=NEO4J_DATABASE) as session:
        records = session.run(query)

        nodes = {}
        edges = []

        for record in records:
            source_id = record["source_id"]
            target_id = record["target_id"]

            if source_id not in nodes:
                nodes[source_id] = {
                    "id": source_id,
                    "labels": record["source_labels"],
                    "properties": record["source_properties"],
                }

            if target_id not in nodes:
                nodes[target_id] = {
                    "id": target_id,
                    "labels": record["target_labels"],
                    "properties": record["target_properties"],
                }

            edges.append(
                {
                    "id": (
                        f"{source_id}-"
                        f"{record['relationship_type']}-"
                        f"{target_id}"
                    ),
                    "source": source_id,
                    "target": target_id,
                    "type": record["relationship_type"],
                }
            )

        return {
            "nodes": list(nodes.values()),
            "edges": edges,
        }