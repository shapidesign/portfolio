#!/bin/bash

echo "=== Email and Swipe Fixes v2.8.2 ==="
echo "Fixing email functionality and swipe direction..."
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
echo "Committing email and swipe fixes..."
git commit -m "Email and swipe fixes v2.8.2

- FIXED: Email form now opens default email client with pre-filled message
- FIXED: Swipe direction now works naturally and intuitively
- IMPROVED: Email functionality uses mailto link for reliable delivery
- IMPROVED: Swipe animations follow natural finger movement direction
- IMPROVED: Previous image goes in opposite direction of swipe
- ADDED: EmailJS library for future email service integration
- UPDATED: Version tag to v2.8.2

Technical improvements:
- Email: mailto link opens default email client with form data
- Swipe: Previous image animation follows natural swipe direction
- Animation: Proper prev/next class assignment based on swipe direction
- User experience: Reliable email delivery and natural swipe gestures
- Fallback: Email client opens even if EmailJS service not configured"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Email and Swipe Fixes v2.8.2 Applied! ==="
echo "Changes include:"
echo "✅ Fixed email functionality - opens email client"
echo "✅ Fixed swipe direction - natural and intuitive"
echo "✅ Improved animation classes"
echo "✅ Added EmailJS library"
echo "✅ Updated version to v2.8.2"
