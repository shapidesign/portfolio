#!/bin/bash

echo "=== Fixing Hero Button and Mobile Modal ==="
echo "1. Restored hero close button to original appearance"
echo "2. Made mobile project modal smaller (90vw x 80vh)"
echo "3. Centered gallery navigation arrows"
echo "4. Improved close button positioning"
echo "5. Fixed button overlap issues"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing hero and mobile fixes..."
git commit -m "Fix hero button appearance and mobile project modal layout"

echo "Pushing to GitHub..."
git push origin main

echo "=== Hero and mobile fixes pushed successfully! ==="
echo "Hero button restored and mobile modal improved."
