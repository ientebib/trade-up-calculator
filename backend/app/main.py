from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import select
import pandas as pd
from .database import init_db, get_session
from .models import Run, Client, Vehicle, Offer
from .optimizer import build_offers
from .dummy_data import generate_clients, generate_vehicles, CLIENT_FIELDS, VEHICLE_FIELDS
from typing import List, Optional
from starlette.responses import JSONResponse

app = FastAPI(title="TradeUp Batch")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()


@app.post("/upload")
def upload(clients: Optional[UploadFile] = File(None), vehicles: Optional[UploadFile] = File(None), generate: bool = Query(False)):
    if generate or (clients is None and vehicles is None):
        clients_path = generate_clients()
        vehicles_path = generate_vehicles()
        df_clients = pd.read_csv(clients_path)
        df_vehicles = pd.read_csv(vehicles_path)
    else:
        if clients is None or vehicles is None:
            raise HTTPException(status_code=400, detail="Both files required")
        df_clients = pd.read_csv(clients.file)
        df_vehicles = pd.read_csv(vehicles.file)
    with get_session() as session:
        run = Run()
        session.add(run)
        session.commit()
        session.refresh(run)
        for _, row in df_clients.iterrows():
            client = Client(run_id=run.id, **{field: row.get(field) for field in CLIENT_FIELDS})
            session.add(client)
        for _, row in df_vehicles.iterrows():
            vehicle = Vehicle(run_id=run.id, **{field: row.get(field) for field in VEHICLE_FIELDS})
            session.add(vehicle)
        session.commit()
        # build offers
        clients_db = session.exec(select(Client).where(Client.run_id == run.id)).all()
        vehicles_db = session.exec(select(Vehicle).where(Vehicle.run_id == run.id)).all()
        for client in clients_db:
            offers = build_offers(client, vehicles_db)
            for offer in offers:
                offer.run_id = run.id
                session.add(offer)
        session.commit()
        run_id = run.id
    return {"run_id": run_id, "clients": len(df_clients), "vehicles": len(df_vehicles)}


@app.get("/runs")
def get_runs():
    with get_session() as session:
        runs = session.exec(select(Run)).all()
        result = []
        for r in runs:
            count = len(session.exec(select(Offer).where(Offer.run_id == r.id)).all())
            result.append({"id": r.id, "created_at": r.created_at.isoformat(), "offers": count})
        return result


@app.get("/runs/{run_id}/clients")
def run_clients(run_id: int):
    with get_session() as session:
        clients = session.exec(select(Client).where(Client.run_id == run_id)).all()
        return clients


@app.get("/runs/{run_id}/offers")
def run_offers(run_id: int, client_id: Optional[str] = None):
    with get_session() as session:
        stmt = select(Offer).where(Offer.run_id == run_id)
        if client_id:
            stmt = stmt.where(Offer.client_id == client_id)
        offers = session.exec(stmt).all()
        return offers
