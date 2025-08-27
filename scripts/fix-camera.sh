#!/bin/bash

echo "=== Fixing Camera Functionality ==="
echo "1. Improved camera permission dialog visibility"
echo "2. Auto-enable camera after 1 second"
echo "3. Simplified camera constraints for better compatibility"
echo "4. Better error handling and user feedback"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing camera fixes..."
git commit -m "Fix camera functionality: improve visibility, auto-enable, better error handling"

echo "Pushing to GitHub..."
git push origin main

echo "=== Camera fixes pushed successfully! ==="
echo "Hero section should now work on both desktop and mobile."
