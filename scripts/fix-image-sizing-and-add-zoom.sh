#!/bin/bash

echo "=== Fixing Image Sizing and Adding Zoom Functionality ==="
echo "Implementing horizontal scrolling and click-to-zoom for project images..."
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
echo "Committing image sizing fixes and zoom functionality..."
git commit -m "Fix image sizing and add click-to-zoom functionality

- Change from grid to horizontal scrolling layout
- Fix image sizing with object-fit: contain (no cropping)
- Add click-to-zoom modal for project images
- Implement smooth horizontal scrolling
- Add close functionality (click outside, close button, ESC key)
- Maintain proper image aspect ratios
- Add smooth animations and transitions"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Image Sizing and Zoom Functionality Complete! ==="
echo "Changes include:"
echo "✅ Images now display at proper size (no cropping)"
echo "✅ Horizontal scrolling implemented"
echo "✅ Click-to-zoom functionality added"
echo "✅ Multiple ways to close zoom modal"
echo "✅ Smooth animations and transitions"

