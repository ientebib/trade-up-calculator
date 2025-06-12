from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel, Field


class Run(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Client(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    run_id: int = Field(foreign_key="run.id")
    client_id: str
    orig_loan_amount: float
    orig_term_months: int
    months_left: int
    current_interest_rate_pct: float
    current_total_payment_gross: float
    current_vehicle_value: float
    equity: Optional[float]
    current_risk_tier: str
    new_risk_tier: str
    insurance_flag: bool = True
    insurance_cost: float


class Vehicle(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    run_id: int = Field(foreign_key="run.id")
    vehicle_id: str
    brand: str
    model: str
    year: int
    km: int
    sale_price: float
    base_rate: float
    available_terms: str


class Offer(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    run_id: int = Field(foreign_key="run.id")
    client_id: str
    vehicle_id: str
    term: int
    down_payment: float
    new_payment_gross: float
    npv: float
    price_delta: float
    payment_delta: float
    archetype: str
    score: float
