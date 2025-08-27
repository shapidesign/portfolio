#!/bin/bash

echo "=== Adding Guts-style Contact Button ==="
echo "1. Replaced phone icon with 'Got guts? Get in touch' button"
echo "2. Added black background with white text"
echo "3. Implemented hover effect with white slide animation"
echo "4. Added scale and lift effects on hover"
echo "5. Maintained mobile responsiveness"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing Guts-style contact button..."
git commit -m "Add Guts-style contact button: black background, hover effects, responsive design"

echo "Pushing to GitHub..."
git push origin main

echo "=== Guts-style contact button added successfully! ==="
echo "Contact button now has the same bold, interactive style as Guts Agency."
