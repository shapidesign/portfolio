#!/bin/bash

echo "🚀 Pushing mobile fixes to GitHub..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

# Add all changes
git add .

# Commit with descriptive message
git commit -m "fix: mobile UX improvements

- Fix launch button touch events for mobile devices
- Reduce hero section button size on mobile for better UX
- Add proper outline stroke to mission control panel
- Enhance mobile touch responsiveness"

# Push to GitHub
git push origin main

echo "✅ Mobile fixes pushed successfully!"
echo "🌐 Your site should be updated at https://shapidesign.com"
