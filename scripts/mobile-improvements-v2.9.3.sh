#!/bin/bash

echo "=== Mobile Improvements v2.9.3 ==="
echo "Removing orbit curves and adding pinch-to-zoom for mobile..."
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
echo "Committing mobile improvements..."
git commit -m "Mobile improvements v2.9.3

- REMOVED: Orbit connecting curves on mobile devices
- ADDED: Pinch-to-zoom functionality for project images on mobile
- IMPROVED: Mobile user experience with better image interaction
- IMPROVED: Clean mobile interface without distracting curves
- IMPROVED: Image zoom functionality with smooth transitions
- MAINTAINED: All existing functionality for desktop
- UPDATED: Version tag to v2.9.3

Mobile improvements:
- Hidden orbit canvas on mobile (display: none)
- Removed connecting curves between planets
- Clean, distraction-free mobile interface
- Better focus on planet interactions

Pinch-to-zoom features:
- Two-finger pinch to zoom images
- Scale range: 1x to 3x zoom
- Smooth zoom transitions
- Tap to zoom out when zoomed
- Zoom only affects individual images
- No page zoom interference

Technical implementation:
- CSS: Hidden orbit canvas on mobile
- CSS: Zoom styles for project images
- JavaScript: Touch event handling for pinch gestures
- JavaScript: Scale calculation and limits
- JavaScript: Zoom state management
- JavaScript: Tap-to-zoom-out functionality

User experience:
- Clean mobile interface without curves
- Intuitive pinch-to-zoom on images
- Smooth zoom transitions
- Easy zoom out with tap
- No interference with page zoom
- Better image viewing experience

Ready for enhanced mobile experience!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Mobile Improvements v2.9.3 Applied! ==="
echo "Changes include:"
echo "✅ Removed orbit connecting curves on mobile"
echo "✅ Added pinch-to-zoom for project images"
echo "✅ Improved mobile user experience"
echo "✅ Clean mobile interface"
echo "✅ Smooth zoom transitions"
echo "✅ Updated version to v2.9.3"
echo ""
echo "📱 Mobile improvements:"
echo "   - No more connecting curves"
echo "   - Pinch-to-zoom on images"
echo "   - Scale range: 1x to 3x"
echo "   - Tap to zoom out"
echo "   - Smooth transitions"
echo ""
echo "🎯 User experience:"
echo "   - Clean mobile interface"
echo "   - Better image viewing"
echo "   - Intuitive zoom controls"
echo "   - No page zoom interference"
echo ""
echo "🚀 Ready to test on mobile devices!"
