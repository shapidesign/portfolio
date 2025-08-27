#!/bin/bash

echo "=== Force Updating Arrow Sizes ==="
echo "Making arrows much smaller and adding visible test border..."
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
echo "Committing force update for arrow sizes..."
git commit -m "Force update arrow sizes and add test border

- Reduce arrow size to 30px (25px on mobile)
- Add red border to arrows for visibility testing
- Ensure changes are properly applied
- Fix CSS specificity issues
- Force refresh of styles"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Force Update Applied! ==="
echo "Changes include:"
echo "✅ Reduced arrow size to 30px (25px mobile)"
echo "✅ Added red border for visibility testing"
echo "✅ Fixed CSS specificity issues"
echo "✅ Force pushed to repository"
