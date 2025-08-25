#!/bin/bash

echo "=== Fixing JavaScript Errors ==="
echo "1. Fixed null element event listener error"
echo "2. Fixed missing earth image path"
echo "3. Fixed Three.js material warning"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing error fixes..."
git commit -m "Fix JavaScript errors: null element, earth image path, Three.js material"

echo "Pushing to GitHub..."
git push origin main

echo "=== Error fixes pushed successfully! ==="
echo "Your site should now load without JavaScript errors."
