#!/bin/bash

echo "=== Fixing Mobile Hero Section ==="
echo "1. Moved close button to right side (removes duplicate)"
echo "2. Removed camera permission popup"
echo "3. Auto-enables camera immediately"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing mobile hero fixes..."
git commit -m "Fix mobile hero: move close button to right, remove camera popup"

echo "Pushing to GitHub..."
git push origin main

echo "=== Mobile hero fixes pushed successfully! ==="
echo "Mobile hero section now has single close button and no popup."
