#!/bin/bash

echo "🚀 Pushing v2.1.3 scrollable projects and mobile fixes to GitHub..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

# Add all changes
git add .

# Commit with descriptive message
git commit -m "v2.1.3: scrollable projects and mobile compatibility fixes

- Redesign project modal to be scrollable instead of arrow navigation
- Add proper padding to project modals (top/bottom margins)
- Fix mobile launch button functionality with enhanced touch support
- Fix mobile hero section button positioning and styling
- Fix connecting lines to properly center on planets
- Remove extra space from About Me modal bottom
- Fix JavaScript errors preventing project modal opening
- Align mission control and creative universe to same right alignment
- Update version indicator to v2.1.3
- Enhance overall mobile compatibility and user experience"

# Push to GitHub
git push origin main

echo "✅ v2.1.3 scrollable projects and mobile fixes pushed successfully!"
echo "🌐 Your site should be updated at https://shapidesign.com"
echo "📱 Version v2.1.3 - Scrollable Projects & Mobile Fix is now live!"
