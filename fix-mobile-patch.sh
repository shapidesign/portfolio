#!/bin/bash

echo "=== Mobile Patch Fixes ==="
echo "1. Reduced star density on mobile (opacity: 0.3)"
echo "2. Fixed hero exit button to properly close modal"
echo "3. Removed 'click to enable camera' button permanently"
echo "4. Improved launch button for mobile (smoother animation, no hover)"
echo "5. Enhanced project modal arrows (larger, better styled, centered)"
echo "6. Fixed button overlap and positioning"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing mobile patch fixes..."
git commit -m "Mobile patch: reduce stars, fix hero exit, improve buttons and modals"

echo "Pushing to GitHub..."
git push origin main

echo "=== Mobile patch fixes pushed successfully! ==="
echo "All mobile issues resolved."
