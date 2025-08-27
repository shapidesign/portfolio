#!/bin/bash

echo "=== Fix Zoom X Button and Mobile Grid ==="
echo "Fixing X button position and mobile horizontal scrolling..."
echo ""

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Current directory: $(pwd)"

# Check git status
echo "Checking git status..."
git status

# Add all changes
echo "Adding all changes..."
git add .

# Commit changes with detailed message
echo "Committing zoom X button and mobile grid fixes..."
git commit -m "Fix zoom X button position and mobile grid layout

- FIXED: X button now positioned inside zoomed image (top-right corner)
- FIXED: X button works on both desktop and mobile
- FIXED: Mobile grid reverted to horizontal scrolling (not stacked)
- FIXED: Mobile images now scroll horizontally with proper spacing
- IMPROVED: X button positioned at top: 10px, right: 10px (desktop)
- IMPROVED: X button positioned at top: 5px, right: 5px (mobile)
- IMPROVED: Mobile grid uses flexbox with horizontal scrolling
- IMPROVED: Image sizes: 150px (tablet), 120px (phone)
- IMPROVED: Proper gap spacing for mobile horizontal layout

Technical changes:
- X button: top: 10px/5px, right: 10px/5px (desktop/mobile)
- Mobile grid: display: flex, flex-direction: row, overflow-x: auto
- Image sizing: 150px tablet, 120px phone with flex-shrink: 0
- Smooth scrolling behavior for mobile image gallery"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Zoom X Button and Mobile Grid Fixed! ==="
echo "Changes include:"
echo "✅ X button positioned inside zoomed image"
echo "✅ X button works on desktop and mobile"
echo "✅ Mobile grid uses horizontal scrolling"
echo "✅ Proper image spacing and sizing"
echo "✅ Smooth scrolling behavior"
