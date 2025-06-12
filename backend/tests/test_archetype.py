import sys
import os

# Add repository root to Python path so `backend` package can be imported
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))
from backend.app.optimizer import archetype


def test_archetype_tu1():
    assert archetype(0.2, 0.1, 0, 20000) == 'TU-1'


def test_archetype_td1():
    assert archetype(-0.1, -0.1, 0, 20000) == 'TD-1'
