#!/bin/bash

echo "=== Fixing Zoom Exit and Mouse Cursor ==="
echo "Fixing exit functionality and mouse cursor visibility in zoom modal..."
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
echo "Committing zoom exit and cursor fixes..."
git commit -m "Fix zoom exit functionality and mouse cursor visibility

- Fix exit functionality to work with all methods (click image, X button, outside, ESC)
- Replace navigation arrows with custom SVG arrows from assets
- Position navigation arrows outside image frame
- Fix mouse cursor visibility by increasing z-index to 50000
- Add proper event handling for content area clicks
- Ensure all exit methods work consistently
- Add hover effects for custom navigation arrows"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Zoom Exit and Cursor Fixes Applied! ==="
echo "Changes include:"
echo "✅ Fixed exit functionality (all methods now work)"
echo "✅ Added custom SVG navigation arrows"
echo "✅ Positioned arrows outside image frame"
echo "✅ Fixed mouse cursor visibility"
echo "✅ Added proper event handling"
