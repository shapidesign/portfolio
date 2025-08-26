#!/bin/bash

echo "=== FINAL UI FIXES ==="
echo "🎯 1. Fixed hero section button size (removed 100% width/height)"
echo "🎯 2. Fixed hero camera window opening (added click listeners)"
echo "🎯 3. Reduced contact modal button glow (20px → 10px, 8px → 4px)"
echo "🎯 4. Fixed contact modal size to fit content (removed 100% width/height)"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing final UI fixes..."
git commit -m "Final UI fixes: hero button size, camera opening, contact modal styling"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 FINAL UI FIXES COMPLETE! ==="
echo "All UI issues resolved!"
