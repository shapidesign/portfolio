#!/bin/bash

echo "=== Reverting Contact Button ==="
echo "1. Reverted from Guts-style button back to phone icon"
echo "2. Restored pixelated phone SVG design"
echo "3. Restored original hover effects and animations"
echo "4. Restored mobile responsive phone icon sizing"
echo "5. Maintained all other mobile improvements"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing contact button revert..."
git commit -m "Revert contact button: restore phone icon design"

echo "Pushing to GitHub..."
git push origin main

echo "=== Contact button reverted successfully! ==="
echo "Contact button is now back to the original phone icon design."
