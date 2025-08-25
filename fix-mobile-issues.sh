#!/bin/bash

echo "=== Fixing Mobile Issues ==="
echo "1. Hiding hero button when modals are open"
echo "2. Improving close button accessibility"
echo "3. Fixing camera functionality"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing fixes..."
git commit -m "Fix mobile issues: hide hero button overlay, improve close buttons, fix camera"

echo "Pushing to GitHub..."
git push origin main

echo "=== Mobile fixes pushed successfully! ==="
echo "Your site should now work properly on mobile devices."
