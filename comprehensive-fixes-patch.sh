#!/bin/bash

echo "🚀 Pushing comprehensive fixes to GitHub..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

# Add all changes
git add .

# Commit with descriptive message
git commit -m "fix: comprehensive mobile and UI improvements

- Fix mobile auto-layout for hero section text and button
- Fix launch button touch events for mobile portfolio access
- Update mission control with proper single border styling
- Auto-enable camera in hero section (no click prompt)
- Implement escape button styling with project-specific colors
- Fix project modal opening issues after closing previous modals
- Center project description text in modal window
- Enhance mobile touch responsiveness and modal state management"

# Push to GitHub
git push origin main

echo "✅ Comprehensive fixes pushed successfully!"
echo "🌐 Your site should be updated at https://shapidesign.com"
