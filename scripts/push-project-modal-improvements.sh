#!/bin/bash

echo "=== Pushing Project Modal Improvements ==="
echo "Including AFL Israel Designs project, grid layout, and z-index fixes..."
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
echo "Committing project modal improvements..."
git commit -m "Add AFL Israel Designs project and improve project modal

- Add AFL Israel Designs as first project with 8 project1 images
- Fix mouse spaceship cursor z-index (20000) to show above modals
- Implement responsive grid layout for project images
- Reorganize modal layout: Title → Description → Images
- Add hover effects and smooth transitions for images
- Improve mobile responsiveness with single-column grid
- Update project descriptions and color scheme"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Project Modal Improvements Pushed Successfully! ==="
echo "Changes include:"
echo "✅ AFL Israel Designs project added"
echo "✅ Mouse cursor z-index fixed"
echo "✅ Responsive image grid implemented"
echo "✅ Modal layout reorganized"
echo "✅ Mobile improvements added"
