#!/bin/bash

echo "=== Update Wave Loop to HD v2.10.0 ==="
echo "Updating wave loop GIF to high definition version..."
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
echo "Committing wave loop HD update..."
git commit -m "Update Wave Loop to HD v2.10.0

- UPDATED: Wave loop GIF to high definition version
- ENHANCED: Visual quality of endless wave animation
- IMPROVED: Project 5 media showcase
- UPDATED: Version tag to v2.10.0

Wave Loop Enhancement:
- OLD: wave-loop.gif (standard definition)
- NEW: wave-loop-hd.gif (high definition)
- Improved visual clarity and detail
- Better animation quality for endless loop
- Enhanced user experience

Project 5: Vibe Coding! (Purple Planet)
- Updated GIF file reference
- Maintains endless loop functionality
- Enhanced visual presentation
- Better showcase of coding animation skills

Technical Details:
- Updated project data to reference new HD GIF
- Maintains all existing functionality
- No changes to media loading system
- Preserves responsive design and styling

Visual Improvements:
- Higher resolution wave animation
- Better detail and clarity
- Enhanced visual impact
- Professional presentation quality

Ready for enhanced visual experience!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Wave Loop HD Update Complete v2.10.0! ==="
echo "Changes include:"
echo "✅ Updated wave loop GIF to HD version"
echo "✅ Enhanced visual quality"
echo "✅ Improved Project 5 showcase"
echo "✅ Updated version to v2.10.0"
echo ""
echo "🎬 Wave Loop Enhancement:"
echo "   - Higher definition animation"
echo "   - Better visual clarity"
echo "   - Enhanced endless loop"
echo "   - Professional quality"
echo ""
echo "🎨 Project 5 Improvements:"
echo "   - Updated GIF reference"
echo "   - Better visual presentation"
echo "   - Enhanced coding showcase"
echo "   - Improved user experience"
echo ""
echo "🚀 HD wave animation now ready!"
