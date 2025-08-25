#!/bin/bash

echo "=== Fixing Desktop Hero Close Button ==="
echo "1. Added desktop-specific hero close button styles"
echo "2. Larger size (50px) for better desktop visibility"
echo "3. Dark background with blue border and text"
echo "4. Hover effects with scale and color changes"
echo "5. Proper positioning and z-index for desktop"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing desktop hero close button fix..."
git commit -m "Fix desktop hero close button: add desktop-specific styling"

echo "Pushing to GitHub..."
git push origin main

echo "=== Desktop hero close button fix pushed successfully! ==="
echo "Desktop hero modal now has proper close button styling."
