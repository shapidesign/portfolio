#!/bin/bash

echo "=== Fixing Hero Section ==="
echo "1. Removed small white X button"
echo "2. Kept blue close button"
echo "3. Fixed exit button to properly close modal"
echo "4. Added touch support for mobile"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing hero section fixes..."
git commit -m "Fix hero section: remove white X button, improve close functionality"

echo "Pushing to GitHub..."
git push origin main

echo "=== Hero section fixes pushed successfully! ==="
echo "Hero modal now has proper close functionality."
