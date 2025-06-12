import random
import csv
from pathlib import Path
from faker import Faker

fake = Faker()

CLIENT_FIELDS = [
    'client_id','orig_loan_amount','orig_term_months','months_left','current_interest_rate_pct','current_total_payment_gross','current_vehicle_value','equity','current_risk_tier','new_risk_tier','insurance_flag','insurance_cost'
]

VEHICLE_FIELDS = ['vehicle_id','brand','model','year','km','sale_price','base_rate','available_terms']


def generate_clients(n=100, path=Path('/tmp/clients.csv')):
    rows = []
    for i in range(n):
        loan = random.randint(150000,300000)
        term = random.choice([48,60,72])
        months_left = random.randint(12,term)
        current_rate = random.uniform(0.08,0.14)
        payment = random.randint(4000,9000)
        value = random.randint(int(loan*0.6), int(loan*1.1))
        equity = random.randint(-20000,20000)
        rows.append({
            'client_id': f'C{i:03d}',
            'orig_loan_amount': loan,
            'orig_term_months': term,
            'months_left': months_left,
            'current_interest_rate_pct': round(current_rate*100,2),
            'current_total_payment_gross': payment,
            'current_vehicle_value': value,
            'equity': equity,
            'current_risk_tier': random.choice(['A','B','C']),
            'new_risk_tier': random.choice(['A','B','C']),
            'insurance_flag': True,
            'insurance_cost': random.randint(8000,12000)
        })
    with open(path,'w',newline='') as f:
        writer = csv.DictWriter(f, fieldnames=CLIENT_FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    return path


def generate_vehicles(n=150, path=Path('/tmp/vehicles.csv')):
    rows=[]
    for i in range(n):
        price = random.randint(150000,350000)
        model_name = fake.word().title()
        # Ensure model name is not None or empty
        if not model_name or model_name.lower() in ['none', 'null', '']:
            model_name = f"Model{i:03d}"
        
        rows.append({
            'vehicle_id': f'V{i:03d}',
            'brand': random.choice(['Nissan','Toyota','Chevy']),
            'model': model_name,
            'year': random.randint(2018,2023),
            'km': random.randint(5000,60000),
            'sale_price': price,
            'base_rate': round(random.uniform(0.12,0.16)*100,2),
            'available_terms': '12,24,36,48,60'
        })
    with open(path,'w',newline='') as f:
        writer = csv.DictWriter(f, fieldnames=VEHICLE_FIELDS)
        writer.writeheader()
        writer.writerows(rows)
    return path
