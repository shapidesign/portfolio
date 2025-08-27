#!/bin/bash

echo "=== Fix Zoom Events and Animations v2.3.0 ==="
echo "Fixing zoom modal events, improving animations, and mobile zoom handling..."
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
echo "Committing zoom events fix and animation improvements..."
git commit -m "Fix zoom events and improve animations v2.3.0

- FIXED: X button now properly closes zoom modal (event handling rewritten)
- FIXED: Click outside now properly closes zoom modal
- FIXED: Event listeners cleared and reinitialized properly
- IMPROVED: Swipe animations now use smooth cubic-bezier transitions
- IMPROVED: Added transform animations for slide effects
- IMPROVED: Removed dark grey background from mobile image container
- IMPROVED: Removed image borders on mobile for cleaner look
- IMPROVED: Added proper prev/next animation states
- ADDED: Mobile zoom prevention (page zoom disabled, image zoom enabled)
- ADDED: Touch action manipulation for better mobile interaction
- ADDED: User select prevention on mobile for better UX
- UPDATED: Version tag to v2.3.0

Technical improvements:
- Event handling: Clone and replace elements to clear all listeners
- Animations: transform: translateX() with cubic-bezier easing
- Mobile CSS: touch-action, user-select, webkit-touch-callout
- Animation states: active, prev classes for smooth transitions
- Mobile optimization: Prevent page zoom, enable image interaction"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Zoom Events and Animations v2.3.0 Applied! ==="
echo "Changes include:"
echo "✅ Fixed X button and click outside functionality"
echo "✅ Improved swipe animations with smooth transitions"
echo "✅ Removed dark background and borders on mobile"
echo "✅ Added mobile zoom prevention and image zoom"
echo "✅ Updated version to v2.3.0"
echo "✅ Proper event handling with element cloning"
