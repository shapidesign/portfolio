#!/bin/bash

echo "🚀 Pushing Figma UI updates to GitHub..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: integrate Figma UI updates

- Update hero camera modal with new Figma design
- Remove extra outer borders from Creative Universe and Mission Control
- Redesign project modal with responsive layout and project-specific colors
- Implement new navigation arrow states (active/hover/unactive)
- Add project-specific color mapping for buttons and UI elements
- Enhance modal responsiveness and visual consistency"

# Push to GitHub
git push origin main

echo "✅ Figma UI updates pushed successfully!"
echo "🌐 Your site should be updated at https://shapidesign.com"
