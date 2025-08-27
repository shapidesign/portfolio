#!/bin/bash

echo "=== Fix Image Loading and Text Alignment v2.9.0 ==="
echo "Fixing image loading issues and text justification..."
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
echo "Committing image loading and text fixes..."
git commit -m "Fix image loading and text alignment v2.9.0

- FIXED: Image loading timeout issues with 10-second timeout
- FIXED: Text alignment - project descriptions now right-justified
- ADDED: Loading indicator while images are being processed
- ADDED: Placeholder images for failed image loads
- IMPROVED: Image loading reliability with timeout handling
- IMPROVED: User feedback during image loading process
- IMPROVED: Error handling for large image files
- IMPROVED: Mobile and desktop image display consistency
- UPDATED: Version tag to v2.9.0

Technical improvements:
- Added 10-second timeout for image loading
- Added loading indicator during image processing
- Created placeholder images for failed loads
- Right-justified all project descriptions
- Enhanced error handling for large files
- Improved mobile and desktop consistency
- Better user feedback during loading

Image loading flow:
1. Show loading indicator
2. Start loading all images with 10-second timeout
3. Remove loading indicator when complete
4. Show actual images or placeholders
5. Provide clear feedback for failed loads

Text alignment:
- Project descriptions now right-justified
- Consistent alignment across all projects
- Better visual hierarchy
- Improved readability

Error handling:
- Timeout for slow-loading images
- Placeholder images for failed loads
- Clear error messages in console
- Graceful degradation for large files

Mobile and desktop:
- Consistent image display across devices
- Same placeholder system for both layouts
- Improved loading feedback
- Better error handling

Ready for reliable image display!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Image Loading and Text Fix v2.9.0 Applied! ==="
echo "Changes include:"
echo "✅ Fixed image loading with 10-second timeout"
echo "✅ Right-justified all project descriptions"
echo "✅ Added loading indicator during image processing"
echo "✅ Created placeholder images for failed loads"
echo "✅ Enhanced error handling for large files"
echo "✅ Updated version to v2.9.0"
echo ""
echo "📸 Image loading improvements:"
echo "   - 10-second timeout for slow images"
echo "   - Loading indicator during processing"
echo "   - Placeholder images for failed loads"
echo "   - Better error handling"
echo "   - Consistent mobile/desktop display"
echo ""
echo "📝 Text alignment improvements:"
echo "   - Right-justified project descriptions"
echo "   - Better visual hierarchy"
echo "   - Improved readability"
echo "   - Consistent across all projects"
echo ""
echo "🚀 Ready to test! Images should load reliably now."
