#!/bin/bash

echo "=== Fixing Mobile Layout Issues ==="
echo "1. Hero camera now displays in vertical aspect ratio (like phone)"
echo "2. Fixed project modal page number and tags overlap"
echo "3. Navigation arrows now stay on same horizontal line"
echo "4. Increased project modal image sizes for better mobile viewing"
echo "5. Improved project modal header layout and spacing"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing mobile layout fixes..."
git commit -m "Fix mobile layout: vertical camera, modal spacing, image sizes, arrow alignment"

echo "Pushing to GitHub..."
git push origin main

echo "=== Mobile layout fixes pushed successfully! ==="
echo "Mobile experience now optimized for better viewing and interaction."
