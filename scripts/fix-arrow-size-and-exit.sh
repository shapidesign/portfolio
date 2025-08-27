#!/bin/bash

echo "=== Fixing Arrow Size and Exit Functionality ==="
echo "Decreasing arrow size and fixing exit functionality..."
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
echo "Committing arrow size and exit fixes..."
git commit -m "Fix arrow size and exit functionality

- Decrease navigation arrow size from 135px to 60px
- Fix exit functionality with multiple event handlers
- Add console logging for debugging exit issues
- Add onclick handler as backup for modal closing
- Remove duplicate CSS rules
- Ensure all exit methods work (click outside, X button, ESC)"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Arrow Size and Exit Fixes Applied! ==="
echo "Changes include:"
echo "✅ Decreased arrow size to 60px"
echo "✅ Fixed exit functionality with multiple handlers"
echo "✅ Added debugging console logs"
echo "✅ Added backup onclick handler"
echo "✅ Removed duplicate CSS rules"
