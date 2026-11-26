import asyncio
import json
import os
import random
import secrets
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(
    title="SCMS Enterprise API",
    description="Smart Campus Monitoring System — Edge AI & Federated Learning Telemetry API",
    version="2.4.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ADMIN_EMAIL = os.getenv("SCMS_ADMIN_EMAIL", "enterprise@scms.ai")
ADMIN_PASSWORD = os.getenv("SCMS_ADMIN_PASSWORD", "12345678")
ADMIN_TOKENS: set[str] = set()
DATA_FILE = Path(__file__).parent / "data.json"


class BookingRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    organization: str = Field(..., min_length=2, max_length=160)
    email: EmailStr
    cameras: str
    preferred_datetime: str
    deployment_type: str = "Live Pilot Deployment"
    modules: List[str] = Field(default_factory=list)
    notes: Optional[str] = ""


class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    organization: Optional[str] = ""
    subject: str = Field(..., min_length=3, max_length=160)
    message: str = Field(..., min_length=10, max_length=3000)


class AdminLoginRequest(BaseModel):
    email: str
    password: str


class BookingStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(Pending|Confirmed|Completed|Cancelled)$")


def load_data() -> tuple[list[dict], list[dict]]:
    if DATA_FILE.exists():
        try:
            raw = json.loads(DATA_FILE.read_text(encoding="utf-8"))
            return raw.get("bookings", []), raw.get("contacts", [])
        except Exception:
            pass
    return [], []


def save_data() -> None:
    try:
        DATA_FILE.write_text(
            json.dumps({"bookings": BOOKINGS_DB, "contacts": CONTACTS_DB}, indent=2),
            encoding="utf-8",
        )
    except Exception:
        pass


BOOKINGS_DB, CONTACTS_DB = load_data()

DETECTION_EVENTS = [
    {"module": "Fall Detection", "zone": "Engineering Wing - Lab B2", "severity": "critical", "confidence": 0.96},
    {"module": "Smoking & Vaping", "zone": "North Dormitory Stairwell 3", "severity": "warning", "confidence": 0.91},
    {"module": "Violence & Fight", "zone": "Central Quad - West Gate", "severity": "critical", "confidence": 0.94},
]


def verify_admin(authorization: Optional[str] = Header(default=None)) -> str:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    token = authorization.removeprefix("Bearer ").strip()
    if token not in ADMIN_TOKENS:
        raise HTTPException(status_code=401, detail="Invalid or expired admin session")
    return token


@app.get("/api/health")
async def health_check():
    return {
        "status": "operational",
        "service": "SCMS Control Plane",
        "privacy_mode": "100% On-Premises Raw Video",
        "federated_round": 418,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@app.get("/api/metrics")
async def get_metrics():
    return {
        "fps": round(random.uniform(24.2, 29.8), 1),
        "latency_ms": random.randint(185, 340),
        "active_nodes": 48,
        "raw_video_uploaded_bytes": 0,
        "fedavg_round": 418,
        "global_map50": 0.947,
    }


@app.post("/api/bookings")
async def create_booking(payload: BookingRequest):
    ref_id = f"SCMS-{uuid.uuid4().hex[:8].upper()}"
    record = {
        "reference_id": ref_id,
        "status": "Pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        **payload.model_dump(),
    }
    BOOKINGS_DB.insert(0, record)
    save_data()
    return {
        "status": "confirmed",
        "reference_id": ref_id,
        "message": "Consultation scheduled. An edge-AI solutions architect will reach out within 4 business hours.",
        "booking": record,
    }


@app.post("/api/contact")
async def create_contact(payload: ContactRequest):
    ticket_id = f"INQ-{uuid.uuid4().hex[:6].upper()}"
    record = {
        "ticket_id": ticket_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        **payload.model_dump(),
    }
    CONTACTS_DB.insert(0, record)
    save_data()
    return {
        "status": "received",
        "ticket_id": ticket_id,
        "message": "Enterprise inquiry logged. Our security engineering team has received your message.",
    }


@app.post("/api/admin/login")
async def admin_login(payload: AdminLoginRequest):
    if payload.email.strip().lower() != ADMIN_EMAIL.lower() or payload.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = secrets.token_urlsafe(32)
    ADMIN_TOKENS.add(token)
    return {"token": token, "email": ADMIN_EMAIL}


@app.get("/api/admin/data")
async def get_admin_data(_: str = Depends(verify_admin)):
    return {"bookings": BOOKINGS_DB, "contacts": CONTACTS_DB}


@app.patch("/api/admin/bookings/{reference_id}")
async def update_booking_status(
    reference_id: str,
    payload: BookingStatusUpdate,
    _: str = Depends(verify_admin),
):
    for booking in BOOKINGS_DB:
        if booking["reference_id"] == reference_id:
            booking["status"] = payload.status
            save_data()
            return {"status": "updated", "booking": booking}
    raise HTTPException(status_code=404, detail="Appointment not found")


@app.delete("/api/admin/bookings/{reference_id}")
async def delete_booking(reference_id: str, _: str = Depends(verify_admin)):
    for idx, booking in enumerate(BOOKINGS_DB):
        if booking["reference_id"] == reference_id:
            BOOKINGS_DB.pop(idx)
            save_data()
            return {"status": "deleted"}
    raise HTTPException(status_code=404, detail="Appointment not found")


@app.websocket("/ws/telemetry")
async def websocket_telemetry(websocket: WebSocket):
    await websocket.accept()
    fed_round = 418
    try:
        while True:
            event = random.choice(DETECTION_EVENTS)
            if random.random() > 0.72:
                fed_round += 1
            payload = {
                "timestamp": datetime.now(timezone.utc).strftime("%H:%M:%S"),
                "fps": round(random.uniform(23.5, 29.9), 1),
                "latency_ms": random.randint(175, 360),
                "active_cameras": 128,
                "edge_nodes_online": 16,
                "fedavg_round": fed_round,
                "raw_video_egress": "0.00 MB/s",
                "encrypted_weights_kb": round(random.uniform(412.0, 680.0), 1),
                "event": {
                    "id": uuid.uuid4().hex[:6].upper(),
                    "module": event["module"],
                    "zone": event["zone"],
                    "severity": event["severity"],
                    "confidence": round(min(0.99, event["confidence"] + random.uniform(-0.02, 0.03)), 2),
                },
            }
            await websocket.send_json(payload)
            await asyncio.sleep(2.4)
    except WebSocketDisconnect:
        pass
