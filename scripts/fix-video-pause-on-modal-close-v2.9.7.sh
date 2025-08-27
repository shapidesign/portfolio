#!/bin/bash

echo "=== Fix Video Pause on Modal Close v2.9.7 ==="
echo "Adding video pause functionality when project modal closes..."
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
echo "Committing video pause fix..."
git commit -m "Fix Video Pause on Modal Close v2.9.7

- FIXED: Videos now pause when project modal closes
- ADDED: Video pause functionality to closeProjectModal()
- ENHANCED: User experience - no more background video playback
- UPDATED: Version tag to v2.9.7

Video Pause Functionality:
- Automatically pauses all videos when modal closes
- Works for all exit methods (X button, click outside, ESC key)
- Console logging for debugging video pause events
- Only pauses videos that are currently playing

Exit Methods Covered:
- Close button (X) click
- Click outside modal backdrop
- Touch outside modal (mobile)
- Escape key press
- Any other method that calls closeProjectModal()

Technical Implementation:
- Added video pause logic to closeProjectModal() function
- Uses querySelectorAll('video') to find all videos in modal
- Checks if video is playing (!video.paused) before pausing
- Console logging for debugging and monitoring

User Experience:
- No more background video noise when modal closes
- Clean exit from project viewing
- Consistent behavior across all devices
- Professional portfolio experience

Ready for seamless video interaction!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Video Pause Fix Applied v2.9.7! ==="
echo "Changes include:"
echo "✅ Videos now pause when project modal closes"
echo "✅ Added video pause functionality"
echo "✅ Enhanced user experience"
echo "✅ Updated version to v2.9.7"
echo ""
echo "🎥 Video Pause Features:"
echo "   - Automatic pause on modal close"
echo "   - Works for all exit methods"
echo "   - Only pauses playing videos"
echo "   - Console logging for debugging"
echo ""
echo "🚪 Exit Methods Covered:"
echo "   - Close button (X)"
echo "   - Click outside modal"
echo "   - Touch outside modal (mobile)"
echo "   - Escape key"
echo ""
echo "🚀 No more background video playback!"
