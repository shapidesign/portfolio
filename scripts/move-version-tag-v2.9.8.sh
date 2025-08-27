#!/bin/bash

echo "=== Move Version Tag v2.9.8 ==="
echo "Moving version tag to avoid phone icon interference..."
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
echo "Committing version tag repositioning..."
git commit -m "Move Version Tag v2.9.8

- MOVED: Version tag from bottom-right to top-left
- FIXED: Phone icon interference issue
- IMPROVED: UI layout and element positioning
- UPDATED: Version tag to v2.9.8

Version Tag Repositioning:
- OLD: bottom: 10px; right: 10px (conflicted with phone icon)
- NEW: top: 10px; left: 10px (clean, unobtrusive position)
- Maintains same styling and z-index
- No interference with interactive elements

Phone Icon Position:
- Remains at bottom: 2.5rem; right: 2.5rem
- No longer conflicts with version tag
- Maintains accessibility and visibility
- Preserves all functionality

UI Improvements:
- Cleaner bottom-right area for phone icon
- Version tag in logical top-left position
- Better visual hierarchy
- No overlapping elements

Technical Details:
- Version tag: top-left corner, fixed position
- Phone icon: bottom-right corner, fixed position
- Both elements maintain proper z-index layering
- Responsive design preserved

Ready for clean UI layout!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Version Tag Moved v2.9.8! ==="
echo "Changes include:"
echo "✅ Version tag moved to top-left corner"
echo "✅ Fixed phone icon interference"
echo "✅ Improved UI layout"
echo "✅ Updated version to v2.9.8"
echo ""
echo "📍 New Positions:"
echo "   - Version tag: top-left (10px, 10px)"
echo "   - Phone icon: bottom-right (2.5rem, 2.5rem)"
echo "   - No more overlap or interference"
echo ""
echo "🎨 UI Improvements:"
echo "   - Cleaner bottom-right area"
echo "   - Logical version tag placement"
echo "   - Better visual hierarchy"
echo "   - Preserved functionality"
echo ""
echo "🚀 Clean UI layout achieved!"
