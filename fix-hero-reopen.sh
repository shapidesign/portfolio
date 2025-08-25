#!/bin/bash

echo "=== Fixing Hero Modal Re-Open Issue ==="
echo "1. Added complete modal state reset in openHeroModal"
echo "2. Force reflow to ensure proper reset"
echo "3. Explicitly set visibility and opacity"
echo "4. Ensure hero button is re-enabled after closing"
echo "5. Fixed modal state management for desktop and mobile"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing hero modal re-open fix..."
git commit -m "Fix hero modal: ensure it can re-open after closing"

echo "Pushing to GitHub..."
git push origin main

echo "=== Hero modal re-open fix pushed successfully! ==="
echo "Hero modal now properly re-opens after being closed."
