#!/bin/bash

echo "=== MOBILE PATCH FINAL ==="
echo "🎯 1. Added smooth camera movement animation (800ms)"
echo "🎯 2. Fixed planet trails - now connected lines instead of particles"
echo "🎯 3. Optimized About Me modal - no scrolling needed on mobile"
echo "🎯 4. Removed 'Call Ground Control' on mobile - only shows phone ring"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing mobile patch final..."
git commit -m "Mobile patch: smooth camera animation, fixed planet trails, optimized modals, removed ground control on mobile"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 MOBILE PATCH COMPLETE! ==="
echo "All mobile issues fixed: camera animation, planet trails, modals, and UI!"
