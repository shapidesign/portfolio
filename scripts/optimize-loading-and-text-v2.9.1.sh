#!/bin/bash

echo "=== Optimize Loading and Text Alignment v2.9.1 ==="
echo "Optimizing loading time and fixing text alignment..."
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
echo "Committing loading optimization and text fixes..."
git commit -m "Optimize loading and text alignment v2.9.1

- FIXED: Text alignment - project descriptions now left-justified
- OPTIMIZED: Image loading timeout reduced from 10s to 5s
- IMPROVED: Faster image loading with shorter timeout
- IMPROVED: Better user experience with quicker feedback
- MAINTAINED: All existing image loading features
- MAINTAINED: Placeholder images for failed loads
- MAINTAINED: Loading indicator during processing
- UPDATED: Version tag to v2.9.1

Technical optimizations:
- Reduced image loading timeout from 10s to 5s
- Faster failure detection for slow images
- Quicker user feedback for loading issues
- Maintained all error handling features
- Left-justified project descriptions

Loading improvements:
- 5-second timeout instead of 10 seconds
- Faster detection of failed image loads
- Quicker display of placeholder images
- Better user experience with faster feedback
- Maintained loading indicator functionality

Text alignment:
- Project descriptions now left-justified
- Better readability and natural flow
- Consistent alignment across all projects
- Improved visual hierarchy

Performance benefits:
- 50% faster timeout detection
- Quicker fallback to placeholders
- Better perceived performance
- Faster user feedback
- Maintained reliability

Ready for optimized performance!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Loading Optimization v2.9.1 Applied! ==="
echo "Changes include:"
echo "✅ Left-justified all project descriptions"
echo "✅ Reduced loading timeout from 10s to 5s"
echo "✅ Faster image loading feedback"
echo "✅ Improved user experience"
echo "✅ Maintained all error handling"
echo "✅ Updated version to v2.9.1"
echo ""
echo "⚡ Loading optimizations:"
echo "   - 5-second timeout (50% faster)"
echo "   - Quicker failure detection"
echo "   - Faster placeholder display"
echo "   - Better user feedback"
echo "   - Maintained reliability"
echo ""
echo "📝 Text alignment:"
echo "   - Left-justified descriptions"
echo "   - Better readability"
echo "   - Natural text flow"
echo "   - Consistent styling"
echo ""
echo "🚀 Ready to test! Loading should be noticeably faster now."
