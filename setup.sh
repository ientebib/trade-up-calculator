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

# Install dependencies first, then approve and rebuild the necessary packages
echo "Installing frontend dependencies with pnpm..."
pnpm install

# Approve and rebuild the build scripts for packages that need them
echo "Approving and rebuilding build scripts for Tailwind CSS and esbuild..."
echo -e "@tailwindcss/oxide\nesbuild" | pnpm approve-builds
pnpm rebuild @tailwindcss/oxide esbuild

# Navigate back to the root directory
cd ..
echo "Frontend setup complete."
echo ""

echo "🎉 Setup finished successfully!" 