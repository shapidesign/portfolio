#!/bin/bash

echo "=== Disable Zoom Functionality v2.8.0 ==="
echo "Disabling zoom functionality completely..."
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
echo "Committing zoom functionality disable..."
git commit -m "Disable zoom functionality completely v2.8.0

- DISABLED: All zoom functionality removed
- DISABLED: Image click events commented out
- DISABLED: Zoom modal HTML commented out
- DISABLED: Zoom modal JavaScript functions kept but unused
- IMPROVED: Project modal works normally without zoom interruption
- IMPROVED: Mobile swipe gestures still work for image navigation
- IMPROVED: Clean, simple interaction without zoom complications
- UPDATED: Version tag to v2.8.0

Technical changes:
- Commented out: imageDiv.addEventListener('click') for zoom
- Commented out: Entire zoom modal HTML structure
- Kept: Zoom JavaScript functions for future reference
- Kept: Mobile swipe functionality for image navigation
- Result: Clean project modal experience without zoom issues"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Zoom Functionality Disabled v2.8.0 ==="
echo "Changes include:"
echo "✅ Disabled all zoom functionality"
echo "✅ Removed image click events"
echo "✅ Commented out zoom modal HTML"
echo "✅ Project modal works normally"
echo "✅ Updated version to v2.8.0"
