#!/bin/bash

echo "🚀 Pushing v2.1.0 comprehensive fixes to GitHub..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

# Add all changes
git add .

# Commit with descriptive message
git commit -m "v2.1.0: comprehensive mobile and UI fixes

- Add version indicator to track site versions
- Fix hero section text to show 'you are the real hero' instead of click prompt
- Implement responsive camera sizing (landscape desktop, portrait mobile)
- Fix escape button styling with proper SVG implementation
- Fix project modal opening issues on desktop and mobile
- Update mission control and creative universe boxes to match Figma designs
- Fix creative universe text responsiveness and auto-layout
- Update About Me modal to match Figma design specifications
- Enhance mobile touch responsiveness and modal state management
- Fix CSS syntax errors and improve overall stability"

# Push to GitHub
git push origin main

echo "✅ v2.1.0 comprehensive fixes pushed successfully!"
echo "🌐 Your site should be updated at https://shapidesign.com"
echo "📱 Version v2.1.0 - Mobile & UI Fixes is now live!"
