#!/bin/bash

echo "=== Mobile Layout and Email Fixes v2.8.3 ==="
echo "Fixing mobile solar system layout and email functionality..."
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
echo "Committing mobile layout and email fixes..."
git commit -m "Mobile layout and email fixes v2.8.3

- FIXED: Solar system now fits full mobile screen width (no invisible borders)
- FIXED: Notification text now has dark color for better readability
- IMPROVED: Email functionality with proper EmailJS integration
- IMPROVED: Mobile solar system uses full viewport without scaling
- IMPROVED: Notification styling with better contrast and shadow
- ADDED: EmailJS service configuration (needs user credentials)
- ADDED: Fallback mailto link for email delivery
- UPDATED: Version tag to v2.8.3

Technical improvements:
- Mobile: Removed scale(0.8) transform that was cutting off solar system
- Mobile: Solar system now uses 100vw width and 100vh height
- Email: Added EmailJS integration with template parameters
- Email: Fallback to mailto link if EmailJS unavailable
- UI: Dark text color on notifications for better readability
- UI: Added box shadow to notifications for better visibility
- Responsive: Full screen solar system on mobile devices

Setup required:
- Replace 'your_service_id' with actual EmailJS service ID
- Replace 'your_template_id' with actual EmailJS template ID  
- Replace 'your_user_id' with actual EmailJS user ID
- Replace 'your-email@example.com' with actual email address"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Mobile Layout and Email Fixes v2.8.3 Applied! ==="
echo "Changes include:"
echo "✅ Fixed mobile solar system - full screen width"
echo "✅ Fixed notification text color - dark and readable"
echo "✅ Improved email functionality - EmailJS integration"
echo "✅ Removed mobile scaling that was cutting off content"
echo "✅ Added fallback email delivery method"
echo "✅ Updated version to v2.8.3"
echo ""
echo "⚠️  IMPORTANT: You need to configure EmailJS credentials:"
echo "   - Replace 'your_service_id' with your EmailJS service ID"
echo "   - Replace 'your_template_id' with your EmailJS template ID"
echo "   - Replace 'your_user_id' with your EmailJS user ID"
echo "   - Replace 'your-email@example.com' with your actual email"
