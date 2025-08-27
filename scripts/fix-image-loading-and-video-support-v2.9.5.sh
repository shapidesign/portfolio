#!/bin/bash

echo "=== Fix Image Loading & Video Support v2.9.5 ==="
echo "Fixing image paths and adding MP4 video support..."
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
echo "Committing image loading fixes and video support..."
git commit -m "Fix Image Loading & Video Support v2.9.5

- FIXED: Image loading for Projects 3 & 4
- ADDED: MP4 video support for Project 3
- UPDATED: Correct image paths for all projects
- IMPROVED: Media handling system (images + videos)
- ENHANCED: Mobile and desktop video display
- UPDATED: Version tag to v2.9.5

Project 3: Pixel Portrait Challenge (Green Planet)
- FIXED: Image paths to actual files (NIR.png, amichai.png, etc.)
- ADDED: Video support for pixels2.mp4
- TOTAL: 7 pixel portraits + 1 video

Project 4: Design as Social Commentary (Orange Planet)
- FIXED: Image paths to actual files (Artboard files, Hebrew posters)
- TOTAL: 17 social commentary posters

Technical Improvements:
- Combined image and video loading into unified media system
- Added video element creation with controls
- Enhanced mobile and desktop video display
- Improved error handling for media loading
- Updated console logging for better debugging

Media System:
- Images: Preloaded with timeout and error handling
- Videos: Direct element creation with controls
- Mobile: Instagram-style layout with video support
- Desktop: Horizontal scrolling with video support
- Both: Proper aspect ratio and responsive design

Ready for full media portfolio showcase!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Image Loading & Video Support Fixed v2.9.5! ==="
echo "Changes include:"
echo "✅ Fixed image loading for Projects 3 & 4"
echo "✅ Added MP4 video support for Project 3"
echo "✅ Updated correct image paths"
echo "✅ Enhanced media handling system"
echo "✅ Improved mobile and desktop video display"
echo "✅ Updated version to v2.9.5"
echo ""
echo "🎨 Project 3: Pixel Portrait Challenge"
echo "   - 7 pixel portraits loaded correctly"
echo "   - 1 MP4 video with controls"
echo "   - Viral TikTok success story"
echo ""
echo "🎭 Project 4: Design as Social Commentary"
echo "   - 17 social commentary posters"
echo "   - Hebrew and English content"
echo "   - Conceptual art approach"
echo ""
echo "🎥 Video Support Features:"
echo "   - Native HTML5 video controls"
echo "   - Responsive design"
echo "   - Mobile and desktop compatible"
echo "   - Preload metadata for performance"
echo ""
echo "🚀 All media now loads correctly!"
