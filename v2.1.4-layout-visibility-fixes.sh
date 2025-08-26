#!/bin/bash

echo "🚀 Pushing v2.1.4 layout and visibility fixes to GitHub..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

# Add all changes
git add .

# Commit with descriptive message
git commit -m "v2.1.4: layout and visibility fixes

- Fix launch button centering on desktop and mobile
- Fix stars visibility on desktop (restored full opacity)
- Fix project modal layout to prevent images overlaying text
- Fix mission control alignment to match creative universe (both right-aligned)
- Keep original creative universe text (no unauthorized changes)
- Remove connecting lines on both mobile and desktop as requested
- Fix mobile layout to prevent hero section and creative universe overlap
- Fix planet hover and pause functionality with proper null checks
- Update version indicator to v2.1.4
- Enhance overall layout consistency and visibility"

# Push to GitHub
git push origin main

echo "✅ v2.1.4 layout and visibility fixes pushed successfully!"
echo "🌐 Your site should be updated at https://shapidesign.com"
echo "📱 Version v2.1.4 - Layout & Visibility Fixes is now live!"
