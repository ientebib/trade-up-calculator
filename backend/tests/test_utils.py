import sys
import os

# Add repository root to Python path so `backend` package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from backend.app.utils import calculate_monthly_payment, calculate_npv


def test_monthly_payment():
    p = calculate_monthly_payment(10000, 0.12, 12)
    assert round(p, 2) == 888.49


def test_npv():
    npv = calculate_npv(10000, 0.12, 12)
    assert round(npv, 2) != 0
