#!/bin/bash

echo "=== Fixing Hero Modal Close Functionality ==="
echo "1. Updated close button to match styled design (light blue with white X)"
echo "2. Added click-outside-to-close functionality for desktop"
echo "3. Added touch-outside-to-close functionality for mobile"
echo "4. Added keyboard escape key support"
echo "5. Improved close button styling and positioning"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing hero modal close fixes..."
git commit -m "Fix hero modal: styled close button, click-outside-to-close, keyboard support"

echo "Pushing to GitHub..."
git push origin main

echo "=== Hero modal close fixes pushed successfully! ==="
echo "Hero modal now has proper close functionality on all devices."
