from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routes.aliases import router as alias_router
from app.routes.posts import router as post_router
from app.routes.analysis import router as analysis_router
from app.routes.wallets import router as wallet_router
from app.routes.transactions import router as transaction_router
from app.routes.evidence import router as evidence_router
from app.neo4j_client import get_graph_data


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="Dark Web API",
    description="AI-Powered Identity Linkage and Cyber Intelligence System",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(alias_router)
app.include_router(post_router)
app.include_router(analysis_router, prefix="/analysis")
app.include_router(evidence_router, prefix="/evidence")
app.include_router(wallet_router)
app.include_router(transaction_router)


@app.get("/")
def root():
    return {
        "project": "Dark Web",
        "team": "Innovation Ninjas",
        "message": "Backend is running successfully",
        "status": "success",
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Dark Web backend",
        "team": "Innovation Ninjas",
    }


@app.get("/debug/routes")
def debug_routes():
    return [
        {
            "path": route.path,
            "methods": list(route.methods or []),
        }
        for route in app.routes
    ]


@app.get("/graph/network")
def graph_network():
    try:
        return get_graph_data()
    except Exception as error:
        return {
            "error": str(error),
            "nodes": [],
            "edges": [],
        }