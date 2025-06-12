# Trade-Up Value Creation Calculator

A modern, single-file web application for automotive finance professionals to analyze, structure, and visualize the economics of trade-up deals. This tool provides a comprehensive breakdown of vehicle margin, loan structuring, add-ons, taxes (IVA), and customer cash requirements, all in a clean, screenshot-ready interface.

## Features
- **Deal Inputs:** Enter all relevant vehicle, loan, and add-on details.
- **IVA Controls:** Granular toggles for applying IVA to each fee, add-on, and the interest rate.
- **Plan Matrix:** Side-by-side comparison of all loan terms, with a detailed P&L-style build-up and cash required breakdown.
- **P&L Analytics:** Professional-grade profit and loss analysis, including operating and financing profit.
- **Customer View:** One-click preset for a clean, client-facing summary.
- **Auto-save & Export:** Data is auto-saved locally; export results to CSV for further analysis.

## Setup & Usage
1. **Clone or Download:**
   ```sh
   git clone <your-repo-url>
   cd trade-up-calculator
   ```
2. **Open the App:**
   Simply open `calculator.html` in your web browser (Chrome recommended).

No build step, no dependencies—just a single HTML file.

## Screenshots
![screenshot](./screenshot.png)

## License
MIT License. Use and modify freely.

---

*Created by Isaac Entebi and AI pair programming. For questions or improvements, open an issue or pull request!* 
## Batch Mode Prototype

A simple FastAPI backend and React UI are provided under `/backend` and `/frontend` to run batch optimisations on multiple clients and vehicles.

### Running locally

1. Install Python requirements:
   ```sh
   cd backend && pip install -r requirements.txt
   ```
2. Start the API:
   ```sh
   uvicorn app.main:app --reload
   ```
3. In another terminal start the frontend:
   ```sh
   cd ../frontend && npm install && npm run dev
   ```
4. Open `http://localhost:5173` and click **Generate Demo Data** to create a demo run.

Unit tests can be run with `pytest backend/tests`.
