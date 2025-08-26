#!/bin/bash

echo "=== MOBILE & ASSETS PATCH FINAL ==="
echo "🎯 1. Removed trail lines from mobile version"
echo "🎯 2. Fixed image loading time with preloading"
echo "🎯 3. Integrated Figma assets:"
echo "   - Phone.svg (new phone icon)"
echo "   - Mission-control.svg"
echo "   - Creative Universe.svg"
echo "   - Hero Section.svg"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing mobile and assets patch..."
git commit -m "Mobile patch: removed trails, fixed image loading, integrated Figma assets"

echo "Pushing to GitHub..."
git push origin main

echo "=== 🎉 MOBILE & ASSETS PATCH COMPLETE! ==="
echo "All fixes applied and Figma assets integrated!"
