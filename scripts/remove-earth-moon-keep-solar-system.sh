#!/bin/bash

echo "=== Removing Earth and Moon from 3D Scene ==="
echo "Keeping solar system with planets and sun, removing Earth/moon background..."
echo ""

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Current directory: $(pwd)"

# Check git status
echo "Checking git status..."
git status

# Add all changes
echo "Adding all changes..."
git add .

# Commit changes with detailed message
echo "Committing removal of Earth and Moon from 3D scene..."
git commit -m "Remove Earth and Moon from 3D scene, keep solar system

- Comment out Earth and Moon creation in planet-hero-vanilla.js
- Remove Earth and Moon rotation animations
- Keep 3D solar system with planets and sun
- Restore interactive star field background
- Maintain all other 3D elements and functionality"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Earth and Moon Removal Complete! ==="
echo "Changes include:"
echo "✅ Earth and Moon removed from 3D scene"
echo "✅ 3D solar system with planets and sun preserved"
echo "✅ Interactive star field background restored"
echo "✅ All other 3D functionality maintained"
