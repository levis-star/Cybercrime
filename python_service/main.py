"""
CyberSafe TZ — Python intelligence microservice.
Runs on port 8000. Called by the Node.js backend for:
  POST /chatbot  — NLP-powered guidance (TF-IDF cosine similarity)
  POST /analyze  — Smarter severity scoring with feature extraction
  GET  /health   — Liveness probe
"""

import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import chatbot
import analyzer

load_dotenv()

app = FastAPI(title="CyberSafe TZ Intelligence Service", version="1.0.0")

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:4000,http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=2, max_length=1000)
    language: str = Field(default="en", pattern="^(en|sw)$")


class AnalyzeRequest(BaseModel):
    category: str
    description: str = Field(..., min_length=5)
    hasEvidence: bool = False
    anonymityStatus: str = Field(default="anonymous", pattern="^(anonymous|verified)$")


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.get("/health")
def health():
    return {"status": "ok", "service": "cybercrime-python-intelligence"}


@app.post("/chatbot")
def chatbot_endpoint(req: ChatRequest):
    return chatbot.answer(req.message, req.language)


@app.post("/analyze")
def analyze_endpoint(req: AnalyzeRequest):
    return analyzer.score(req.category, req.description, req.hasEvidence, req.anonymityStatus)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
