#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Backend Setup ---
echo "--- Setting up Python backend ---"

# Create a virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv .venv
fi

# Activate the virtual environment and install dependencies
source .venv/bin/activate
echo "Installing Python dependencies from backend/requirements.txt..."
pip install -r backend/requirements.txt
echo "Backend setup complete."
echo ""

# --- Frontend Setup ---
echo "--- Setting up Node.js frontend ---"

# Navigate to the frontend directory
cd frontend

# Set environment variable to allow build scripts and install dependencies
echo "Installing frontend dependencies with pnpm (allowing build scripts)..."
PNPM_SCRIPT_SHELL=/bin/bash pnpm install --ignore-scripts=false

# Navigate back to the root directory
cd ..
echo "Frontend setup complete."
echo ""

echo "🎉 Setup finished successfully!" 