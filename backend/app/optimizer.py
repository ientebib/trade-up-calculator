from typing import List
from .models import Client, Vehicle, Offer
from .utils import calculate_monthly_payment, calculate_npv, GPS_MONTHLY

# simple interest grid
RATE_GRID = {
    'A': {12: 0.12, 24: 0.12, 36: 0.12, 48: 0.12, 60: 0.12, 72: 0.12},
    'B': {12: 0.13, 24: 0.13, 36: 0.13, 48: 0.13, 60: 0.13, 72: 0.13},
    'C': {12: 0.14, 24: 0.14, 36: 0.14, 48: 0.14, 60: 0.14, 72: 0.14},
}

TERMS = [12, 24, 36, 48, 60, 72]


class Rules:
    payment_delta_limit: float = 0.10
    price_window: float = 0.50
    weight_payment: float = 60.0
    weight_npv: float = 40.0


RULES = Rules()


def archetype(price_delta: float, payment_delta: float, down_payment: float, sale_price: float) -> str:
    if price_delta >= 0.15 and payment_delta > 0.05:
        return 'TU-1'
    if 0.05 <= price_delta < 0.15 and abs(payment_delta) <= 0.05 and down_payment == 0:
        return 'TU-2'
    if price_delta <= -0.05 and payment_delta <= -0.05:
        return 'TD-1'
    if payment_delta <= -0.15:
        return 'TD-2'
    return 'Not Eligible'


def build_offers(client: Client, vehicles: List[Vehicle]) -> List[Offer]:
    offers: List[Offer] = []
    current_balance = client.orig_loan_amount  # placeholder
    current_balance = client.orig_loan_amount  # we should compute using balance formula
    for vehicle in vehicles:
        price_delta = (vehicle.sale_price - client.current_vehicle_value) / client.current_vehicle_value
        if abs(price_delta) > RULES.price_window:
            continue
        for term in TERMS:
            if str(term) not in vehicle.available_terms.split(','):
                continue
            rate = RATE_GRID.get(client.new_risk_tier, RATE_GRID['C'])[term]
            principal = vehicle.sale_price - (client.equity or 0)
            payment = calculate_monthly_payment(principal, rate, term)
            new_payment_gross = payment + GPS_MONTHLY
            payment_delta = (new_payment_gross - client.current_total_payment_gross) / client.current_total_payment_gross
            if abs(payment_delta) > RULES.payment_delta_limit:
                continue
            npv = calculate_npv(principal, rate, term)
            score = RULES.weight_payment * abs(payment_delta) + RULES.weight_npv * (-npv)
            arch = archetype(price_delta, payment_delta, 0, vehicle.sale_price)
            offers.append(Offer(
                client_id=client.client_id,
                vehicle_id=vehicle.vehicle_id,
                term=term,
                down_payment=0,
                new_payment_gross=new_payment_gross,
                npv=npv,
                price_delta=price_delta,
                payment_delta=payment_delta,
                archetype=arch,
                score=score,
            ))
    return offers
