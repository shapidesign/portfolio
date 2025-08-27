#!/bin/bash

echo "=== Reorganize Bible Project v2.8.8 ==="
echo "Moving The Bible: Remastered to blue planet and keeping 5 planets..."
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
echo "Committing project reorganization..."
git commit -m "Reorganize Bible project v2.8.8

- MOVED: 'The Bible: Remastered' project to blue planet (second position)
- REMOVED: Duplicate purple planet to maintain exactly 5 planets
- UPDATED: Blue planet color to match Bible project theme
- MAINTAINED: 5-planet solar system structure
- UPDATED: Version tag to v2.8.8

Planet organization:
1. Pink Planet - AFL Israel Designs
2. Blue Planet - The Bible: Remastered (NEW POSITION)
3. Green Planet - Hebrew Glitch Typography
4. Orange Planet - Interactive Portfolio
5. Purple Planet - Motion Graphics Exploration

Technical changes:
- Bible project moved from position 3 to position 2
- Blue planet color (0x66d9ef) assigned to Bible project
- Removed duplicate purple planet entry
- Maintained clean 5-project portfolio structure
- All 15 bible cover images remain integrated

User experience:
- Blue planet now showcases Bible project
- Clean 5-planet navigation
- Consistent color theming
- Professional portfolio presentation
- Easy project discovery and navigation

Ready for optimal portfolio showcase!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Bible Project Reorganization v2.8.8 Complete! ==="
echo "Changes include:"
echo "✅ Moved Bible project to blue planet"
echo "✅ Removed duplicate planet"
echo "✅ Maintained 5-planet structure"
echo "✅ Updated blue planet color"
echo "✅ Updated version to v2.8.8"
echo ""
echo "🌍 Planet structure now:"
echo "   1. Pink - AFL Israel Designs"
echo "   2. Blue - The Bible: Remastered"
echo "   3. Green - Hebrew Glitch Typography"
echo "   4. Orange - Interactive Portfolio"
echo "   5. Purple - Motion Graphics Exploration"
echo ""
echo "🚀 Perfect 5-planet portfolio ready!"
