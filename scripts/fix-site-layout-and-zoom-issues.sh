#!/bin/bash

echo "=== Fixing Site Layout and Zoom Issues ==="
echo "Removing blue border, fixing zoom sizing, click events, and scrollbar styling..."
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
echo "Committing site layout and zoom fixes..."
git commit -m "Fix site layout and zoom functionality

- Remove blue border and make site truly one-page (no scrolling)
- Fix zoom image sizing to fit screen resolution while maintaining quality
- Fix click events for closing zoom modal (image click, X button, outside click)
- Add custom scrollbar styling to match site theme
- Ensure proper event propagation and stopPropagation
- Make zoom images responsive to screen size"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Site Layout and Zoom Issues Fixed! ==="
echo "Changes include:"
echo "✅ Removed blue border and made site one-page"
echo "✅ Fixed zoom image sizing to fit screen resolution"
echo "✅ Fixed click events for closing zoom modal"
echo "✅ Added custom scrollbar styling to match theme"
