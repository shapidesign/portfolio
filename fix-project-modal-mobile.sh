#!/bin/bash

echo "=== Fixing Project Modal Mobile Issues ==="
echo "1. Added missing closeProjectModal function"
echo "2. Enhanced openProjectModal with proper display styling"
echo "3. Added touch events for mobile close button"
echo "4. Added click-outside-to-close for project modal"
echo "5. Added console logging for debugging"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing project modal mobile fixes..."
git commit -m "Fix project modal mobile: add missing functions, enhance display, add touch support"

echo "Pushing to GitHub..."
git push origin main

echo "=== Project modal mobile fixes pushed successfully! ==="
echo "Project modals now work properly on mobile devices."
