#!/bin/bash

echo "=== Final Mobile Fixes Applied ==="
echo "1. Enhanced camera reset with additional timeout for mobile"
echo "2. Made project description text even smaller (0.4rem)"
echo "3. Made contact modal smaller (60vh) with less white space"
echo "4. Reduced about modal height to 55vh to remove bottom white space"
echo "5. Improved mobile modal proportions and spacing"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing final mobile fixes..."
git commit -m "Final mobile fixes: camera reset, text size, modal spacing, white space removal"

echo "Pushing to GitHub..."
git push origin main

echo "=== Final mobile fixes pushed successfully! ==="
echo "Mobile experience now fully optimized with proper camera reset and modal sizing."
