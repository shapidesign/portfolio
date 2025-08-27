#!/bin/bash

echo "=== Fixing 3D Rendering and Image Sizing Issues ==="
echo "Hiding 3D solar system and fixing project modal image sizing..."
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
echo "Committing fixes for 3D rendering and image sizing..."
git commit -m "Hide 3D solar system and fix project modal image sizing

- Hide 3D solar system section with display: none
- Fix project modal image sizing with object-fit: cover
- Set fixed height (400px) for image containers
- Ensure images fill their containers properly
- Remove empty space around images in grid"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== 3D Rendering and Image Sizing Fixes Pushed Successfully! ==="
echo "Changes include:"
echo "✅ 3D solar system hidden"
echo "✅ Project modal images now fill containers properly"
echo "✅ Fixed image sizing with object-fit: cover"
echo "✅ Consistent 400px height for all image containers"
