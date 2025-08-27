#!/bin/bash

echo "=== Mobile Image Fixes v2.8.1 ==="
echo "Fixing mobile image styling and swipe direction..."
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
echo "Committing mobile image fixes..."
git commit -m "Mobile image fixes v2.8.1

- FIXED: Removed glow and drop shadow from mobile image placeholders
- FIXED: Improved swipe direction for backwards swiping
- IMPROVED: Clean mobile image appearance without visual effects
- IMPROVED: Proper animation classes for swipe transitions
- IMPROVED: Better visual feedback for swipe direction
- UPDATED: Version tag to v2.8.1

Technical improvements:
- Mobile images: box-shadow: none, filter: none for clean appearance
- Swipe animations: Proper prev/next class assignment
- Visual feedback: Clear comments for swipe direction logic
- Clean styling: No more glow or drop shadow effects
- Smooth transitions: Better animation class management"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Mobile Image Fixes v2.8.1 Applied! ==="
echo "Changes include:"
echo "✅ Removed glow and drop shadow from mobile images"
echo "✅ Fixed swipe direction for backwards swiping"
echo "✅ Improved animation class assignment"
echo "✅ Clean mobile image appearance"
echo "✅ Updated version to v2.8.1"
