#!/bin/bash

echo "🚀 Pushing v2.1.1 critical fixes to GitHub..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

# Add all changes
git add .

# Commit with descriptive message
git commit -m "v2.1.1: critical fixes and UI improvements

- Fix camera aspect ratio to fill entire modal box properly
- Implement proper colored escape buttons using Figma SVGs
- Remove unwanted outer boxes from mission control and creative universe
- Make contact modal smaller and more UI friendly
- Fix solar system canvas sizing to prevent cutoff on screen edges
- Fix About Me modal sizing and remove duplicate escape buttons
- Fix project modal JavaScript errors preventing opening
- Remove 404 error from planet-upgrade.js reference
- Fix modal outline reset in closeProjectModal
- Enhance overall UI consistency and responsiveness"

# Push to GitHub
git push origin main

echo "✅ v2.1.1 critical fixes pushed successfully!"
echo "🌐 Your site should be updated at https://shapidesign.com"
echo "📱 Version v2.1.1 - Critical Fixes is now live!"
