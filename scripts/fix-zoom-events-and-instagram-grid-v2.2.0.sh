#!/bin/bash

echo "=== Fix Zoom Events and Instagram Grid v2.2.0 ==="
echo "Fixing zoom modal events and implementing Instagram-style mobile grid..."
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
echo "Committing zoom events fix and Instagram-style mobile grid..."
git commit -m "Fix zoom events and implement Instagram-style mobile grid v2.2.0

- FIXED: X button now properly closes zoom modal (not project modal)
- FIXED: Click outside now properly closes zoom modal
- FIXED: Event handling completely rewritten with proper isolation
- FIXED: Event listeners reinitialized when zoom modal opens
- IMPLEMENTED: Instagram-style mobile grid with single image view
- IMPLEMENTED: Mobile swipe navigation between images
- IMPLEMENTED: Image counter showing current position (1/5)
- IMPLEMENTED: Smooth transitions between images on mobile
- IMPLEMENTED: Desktop maintains horizontal scrolling layout
- IMPROVED: Event handler functions separated for better debugging
- IMPROVED: Touch/swipe detection optimized for mobile
- IMPROVED: Proper event propagation and stopPropagation usage
- UPDATED: Version tag to v2.2.0

Technical improvements:
- Event handlers: handleZoomBackgroundClick, handleZoomImageClick, etc.
- Mobile detection: window.innerWidth <= 768
- Instagram layout: position: absolute, opacity transitions
- Swipe detection: touchstart/touchend with 50px threshold
- Image counter: data-image-counter attribute with CSS ::after
- Event reinitialization: initializeZoomModalEvents() on open"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Zoom Events and Instagram Grid v2.2.0 Applied! ==="
echo "Changes include:"
echo "✅ Fixed X button and click outside functionality"
echo "✅ Implemented Instagram-style mobile grid"
echo "✅ Added mobile swipe navigation"
echo "✅ Added image counter and transitions"
echo "✅ Updated version to v2.2.0"
echo "✅ Proper event handling isolation"
