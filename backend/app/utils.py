import math

GPS_MONTHLY = 406  # MXN
COST_OF_FUNDS = 0.08


def calculate_monthly_payment(principal: float, annual_rate: float, months: int) -> float:
    r = annual_rate / 12.0
    if r == 0:
        return principal / months
    return principal * r * math.pow(1 + r, months) / (math.pow(1 + r, months) - 1)


def calculate_balance(original_principal: float, annual_rate: float, original_term: int, payments_made: int) -> float:
    r = annual_rate / 12.0
    payment = calculate_monthly_payment(original_principal, annual_rate, original_term)
    balance = original_principal
    for _ in range(payments_made):
        interest = balance * r
        principal = payment - interest
        balance -= principal
    return balance


def calculate_npv(principal: float, annual_rate: float, months: int, discount_rate: float = 0.10, cost_of_funds: float = COST_OF_FUNDS) -> float:
    payment = calculate_monthly_payment(principal, annual_rate, months)
    balance = principal
    gross_npv = 0.0
    cost_npv = 0.0
    if principal <= 0 or months <= 0:
        return 0.0
    for i in range(1, months + 1):
        disc = math.pow(1 + discount_rate / 12.0, i)
        gross_int = balance * (annual_rate / 12.0)
        gross_npv += gross_int / disc
        cost_npv += balance * (cost_of_funds / 12.0) / disc
        principal_payment = payment - gross_int
        balance -= principal_payment
    return gross_npv - cost_npv
