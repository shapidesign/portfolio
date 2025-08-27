#!/bin/bash

echo "=== Comprehensive Mobile Fixes ==="
echo "Fixing mobile grid, swipe gestures, close button, and arrow direction..."
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
echo "Committing comprehensive mobile fixes..."
git commit -m "Comprehensive mobile fixes and zoom modal improvements

- Create separate close button for zoom modal (zoom-modal-close)
- Disable project modal interactions when zoom modal is open
- Fix mobile grid spacing: reduce gap to 0.5rem, height to 35vh
- Reduce image item size to 180px on mobile for better fit
- Add proper swipe gestures for mobile image navigation
- Fix arrow direction and ensure proper navigation
- Improve mobile layout with optimized spacing
- Ensure project modal functions are disabled during zoom mode
- Add touch event handling for entire modal area"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Comprehensive Mobile Fixes Applied! ==="
echo "Changes include:"
echo "✅ Separate close button for zoom modal"
echo "✅ Disabled project modal during zoom mode"
echo "✅ Fixed mobile grid spacing and sizing"
echo "✅ Added swipe gestures for mobile navigation"
echo "✅ Fixed arrow direction and navigation"
