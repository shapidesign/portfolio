#!/bin/bash

echo "=== Video First & Aspect Ratio Fix v2.9.6 ==="
echo "Putting MP4 video first and ensuring correct aspect ratio..."
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
echo "Committing video-first order and aspect ratio fixes..."
git commit -m "Video First & Aspect Ratio Fix v2.9.6

- REORDERED: MP4 video now appears first in Project 3
- ENHANCED: Video aspect ratio and maximize functionality
- ADDED: Video-specific CSS styling for mobile and desktop
- IMPROVED: Video display with proper object-fit and background
- UPDATED: Version tag to v2.9.6

Project 3: Pixel Portrait Challenge (Green Planet)
- VIDEO FIRST: pixels2.mp4 now appears as the first item
- FOLLOWED BY: 7 pixel portraits (NIR.png, amichai.png, etc.)
- TOTAL: 1 video + 7 images = 8 media items

Video Enhancements:
- Mobile: Full-screen video with proper aspect ratio
- Desktop: Horizontal scrolling with video controls
- Both: object-fit: contain for correct aspect ratio
- Both: Black background for video elements
- Both: Rounded corners and proper styling

Technical Improvements:
- Videos now load before images in media array
- Enhanced video element styling for both layouts
- Proper aspect ratio maintenance on maximize
- Consistent video controls and appearance
- Better video integration with existing design

Media Order (Project 3):
1. pixels2.mp4 (Video - TikTok challenge)
2. NIR.png (Pixel portrait)
3. amichai.png (Pixel portrait)
4. bar.png (Pixel portrait)
5. guysha.png (Pixel portrait)
6. lenny.png (Pixel portrait)
7. potato.png (Pixel portrait)
8. thrift.png (Pixel portrait)

Ready for optimal video showcase!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Video First & Aspect Ratio Fixed v2.9.6! ==="
echo "Changes include:"
echo "✅ MP4 video now appears first in Project 3"
echo "✅ Enhanced video aspect ratio and maximize"
echo "✅ Added video-specific CSS styling"
echo "✅ Improved video display on mobile and desktop"
echo "✅ Updated version to v2.9.6"
echo ""
echo "🎥 Video Enhancements:"
echo "   - Video appears first in the gallery"
echo "   - Proper aspect ratio on maximize"
echo "   - Full-screen video on mobile"
echo "   - Horizontal scrolling on desktop"
echo "   - Native HTML5 video controls"
echo ""
echo "📱 Mobile & Desktop:"
echo "   - object-fit: contain for correct ratio"
echo "   - Black background for video elements"
echo "   - Rounded corners and consistent styling"
echo "   - Responsive design across all devices"
echo ""
echo "🚀 Video now showcases your TikTok challenge perfectly!"
