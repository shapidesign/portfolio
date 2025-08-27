#!/bin/bash

echo "=== Update Landing Text v2.9.2 ==="
echo "Updating landing page header and sub-header..."
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
echo "Committing landing text update..."
git commit -m "Update landing text v2.9.2

- UPDATED: Landing page header to 'Welcome to my creative universe'
- UPDATED: Landing page sub-header to 'prepare for launch'
- IMPROVED: More welcoming and engaging landing text
- IMPROVED: Better user experience with friendly messaging
- MAINTAINED: All existing styling and functionality
- UPDATED: Version tag to v2.9.2

Text changes:
- Header: 'This is not a Landing Page' → 'Welcome to my creative universe'
- Sub-header: 'prepare for launch...' → 'prepare for launch'

User experience improvements:
- More welcoming and friendly tone
- Better engagement with visitors
- Clearer invitation to explore
- Professional yet approachable messaging
- Maintains the creative theme

Design consistency:
- Same styling and animations
- Same launch button functionality
- Same visual hierarchy
- Same responsive behavior
- Same professional appearance

Ready for enhanced user engagement!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Landing Text Update v2.9.2 Applied! ==="
echo "Changes include:"
echo "✅ Updated header: 'Welcome to my creative universe'"
echo "✅ Updated sub-header: 'prepare for launch'"
echo "✅ More welcoming and engaging text"
echo "✅ Better user experience"
echo "✅ Maintained all functionality"
echo "✅ Updated version to v2.9.2"
echo ""
echo "🎨 Landing page improvements:"
echo "   - More welcoming header"
echo "   - Cleaner sub-header"
echo "   - Better user engagement"
echo "   - Professional messaging"
echo "   - Creative universe theme"
echo ""
echo "🚀 Ready to welcome visitors to your creative universe!"
