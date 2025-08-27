#!/bin/bash

echo "=== Optimize Loading & UI v2.10.4 ==="
echo "Optimizing loading times and improving UI elements..."
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
echo "Committing loading optimization and UI improvements..."
git commit -m "Optimize Loading & UI v2.10.4

- OPTIMIZED: Loading times with image preloading and reduced timeouts
- REDUCED: Hero button size for better UI balance
- FIXED: Mobile image cropping issues
- ENHANCED: User experience with faster loading
- UPDATED: Version tag to v2.10.4

Loading Time Optimizations:
- Added image preloading on page load
- Reduced image loading timeout from 5s to 2s
- Background preloading of all project images
- Faster fallback to placeholders
- Improved user experience with reduced wait times

Hero Button Improvements:
- Desktop: Reduced font size from 1.3rem to 1rem
- Desktop: Reduced padding from 1.1rem 2.2rem to 0.8rem 1.6rem
- Desktop: Reduced border radius from 18px to 12px
- Mobile: Reduced font size from 1rem to 0.8rem
- Mobile: Reduced padding from 0.7rem 1.2rem to 0.5rem 1rem
- Better UI balance and less intrusive appearance

Mobile Image Cropping Fixes:
- Added max-width: 100% and max-height: 100% to images
- Added max-width: 100% and max-height: 100% to videos
- Ensured images always fit within container
- Prevented image cropping on mobile devices
- Maintained aspect ratio while fitting content

Technical Improvements:
- Preloading function runs on DOM ready
- Console logging for preload progress
- Error handling for failed preloads
- Responsive design improvements
- Better mobile user experience

User Experience Enhancements:
- Faster project modal opening
- Reduced frustration from long loading times
- Better visual balance with smaller hero button
- Properly fitted images on mobile
- Smoother overall experience

Ready for optimized user experience!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Loading & UI Optimization Complete v2.10.4! ==="
echo "Changes include:"
echo "✅ Optimized loading times with preloading"
echo "✅ Reduced hero button size"
echo "✅ Fixed mobile image cropping"
echo "✅ Enhanced user experience"
echo "✅ Updated version to v2.10.4"
echo ""
echo "⚡ Loading Optimizations:"
echo "   - Image preloading on page load"
echo "   - Reduced timeout from 5s to 2s"
echo "   - Background preloading"
echo "   - Faster fallback to placeholders"
echo ""
echo "🎨 UI Improvements:"
echo "   - Smaller hero button (desktop & mobile)"
echo "   - Better visual balance"
echo "   - Less intrusive appearance"
echo "   - Improved mobile layout"
echo ""
echo "📱 Mobile Fixes:"
echo "   - Fixed image cropping issues"
echo "   - Proper image fitting"
echo "   - Maintained aspect ratios"
echo "   - Better mobile experience"
echo ""
echo "🚀 Optimized user experience ready!"
