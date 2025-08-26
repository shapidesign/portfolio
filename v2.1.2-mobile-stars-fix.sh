#!/bin/bash

echo "🚀 Pushing v2.1.2 mobile and stars fixes to GitHub..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

# Add all changes
git add .

# Commit with descriptive message
git commit -m "v2.1.2: mobile compatibility and stars brightness fixes

- Fix stars brightness - restored full opacity for better visibility
- Fix mobile launch button functionality and positioning
- Fix mobile hero section button positioning (top right corner)
- Enhance mobile touch gestures with proper sizing and touch-action
- Fix project modal JavaScript errors preventing opening
- Improve project modal image borders and navigation arrow size
- Fix camera reset functionality after visiting projects
- Align creative universe and mission control positioning
- Update version indicator to v2.1.2
- Enhance overall mobile compatibility and responsiveness"

# Push to GitHub
git push origin main

echo "✅ v2.1.2 mobile and stars fixes pushed successfully!"
echo "🌐 Your site should be updated at https://shapidesign.com"
echo "📱 Version v2.1.2 - Mobile & Stars Fix is now live!"
