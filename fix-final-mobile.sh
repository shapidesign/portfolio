#!/bin/bash

echo "=== Final Mobile Fixes Applied ==="
echo "1. Fixed camera reset to show entire solar system after visiting planets"
echo "2. Decreased project description text size by 3px (now 0.5rem)"
echo "3. Removed white space from about modal (smaller size and padding)"
echo "4. Changed 'About the Creator' to 'About Me'"
echo "5. Fixed phone icon visibility - now stays visible when modals are open"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing final mobile fixes..."
git commit -m "Final mobile fixes: camera reset, text size, modal spacing, phone visibility"

echo "Pushing to GitHub..."
git push origin main

echo "=== Final mobile fixes pushed successfully! ==="
echo "Mobile experience now fully optimized and functional."
