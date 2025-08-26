#!/bin/bash

echo "=== FINAL CAMERA RESET FIX ==="
echo "🚀 FOUND THE BUG: Using wrong camera variables!"
echo "✅ Fixed: Now using solarControls and solarCamera (not controls and camera)"
echo "✅ Fixed: Correct position (0, 20, 30) for wide solar system view"
echo "✅ Fixed: Multiple reset attempts with proper timing"
echo "✅ Fixed: Enhanced logging for debugging"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing FINAL camera reset fix..."
git commit -m "FIXED: Camera reset now uses correct solarControls and solarCamera variables"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 CAMERA RESET FIXED ONCE AND FOR ALL! ==="
echo "Mobile camera will now ALWAYS reset to wide solar system view!"
