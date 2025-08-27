#!/bin/bash

echo "=== Fix Zoom Exit and Mobile Images v2.6.0 ==="
echo "Fixing zoom exit method and mobile image visibility..."
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
echo "Committing zoom exit and mobile image fixes..."
git commit -m "Fix zoom exit method and mobile image visibility v2.6.0

- FIXED: Replaced X button with exit overlay for better usability
- FIXED: Mobile images now visible with proper z-index and positioning
- FIXED: Zoom modal exit now works reliably on all devices
- IMPLEMENTED: Semi-transparent overlay with 'Tap anywhere to close' text
- IMPROVED: Mobile image container with flexbox centering
- IMPROVED: Z-index management for proper image layering
- IMPROVED: Touch events for both overlay and image clicks
- REMOVED: Old X button and related event handlers
- UPDATED: Version tag to v2.6.0

Technical improvements:
- Exit overlay: Full-screen semi-transparent overlay with clear text
- Mobile images: Added z-index and flexbox centering for visibility
- Event handling: Simplified with overlay and image click events
- Touch support: Both click and touchend events for mobile
- Visual feedback: Hover effects on exit overlay text
- Responsive design: Proper sizing for mobile and desktop"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Zoom Exit and Mobile Images v2.6.0 Applied! ==="
echo "Changes include:"
echo "✅ Fixed zoom exit method with overlay"
echo "✅ Fixed mobile image visibility"
echo "✅ Improved touch interaction"
echo "✅ Better visual feedback"
echo "✅ Updated version to v2.6.0"
