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

# Forcefully allow build scripts for tailwind and esbuild
# This is a workaround for environments that might cache the repo
# without pulling the latest package.json changes.
echo "Approving necessary build scripts for pnpm..."
npm pkg set pnpm.allow-build='["@tailwindcss/oxide", "esbuild"]'

# Install frontend dependencies using pnpm
# Assumes pnpm is installed. If not, you might need to install it first.
# e.g., npm install -g pnpm
echo "Installing frontend dependencies with pnpm..."
pnpm install

# Navigate back to the root directory
cd ..
echo "Frontend setup complete."
echo ""

echo "🎉 Setup finished successfully!" 