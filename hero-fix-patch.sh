#!/bin/bash

echo "=== HERO MODAL FIX & CONTACT MODAL UPDATE ==="
echo "🎯 1. Fixed hero modal auto-opening on page refresh"
echo "🎯 2. Updated contact modal to match Figma design"
echo "🎯 3. Camera now requires user interaction to enable"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing hero modal fix and contact modal update..."
git commit -m "Fix hero modal auto-opening and update contact modal to Figma design"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 HERO MODAL FIX COMPLETE! ==="
echo "Hero modal now only opens on button click!"
echo "Contact modal matches your Figma design!"
