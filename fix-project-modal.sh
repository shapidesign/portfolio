#!/bin/bash

echo "=== Fixing Project Modal ==="
echo "1. Removed unnecessary tags from project modals"
echo "2. Decreased mobile project description text size (0.8rem)"
echo "3. Added proper padding and spacing for mobile description"
echo "4. Ensured description always displays beneath image"
echo "5. Cleaned up tag-related JavaScript code"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing project modal improvements..."
git commit -m "Fix project modal: remove tags, optimize mobile description size and positioning"

echo "Pushing to GitHub..."
git push origin main

echo "=== Project modal improvements pushed successfully! ==="
echo "Project modals now have cleaner layout and better mobile UX."
