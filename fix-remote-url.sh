#!/bin/bash

echo "=== Fixing Remote URL ==="
echo "Current remote: https://github.com/shapidesign/new-sat.git"
echo "Correct remote: https://github.com/shapidesign/portfolio.git"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Checking current remote..."
git remote -v

echo ""
echo "Removing old remote..."
git remote remove origin

echo "Adding correct remote..."
git remote add origin https://github.com/shapidesign/portfolio.git

echo ""
echo "Verifying new remote..."
git remote -v

echo ""
echo "Fetching from correct repository..."
git fetch origin

echo ""
echo "Adding all changes..."
git add .

echo "Committing changes..."
git commit -m "Fix remote URL and push all updates"

echo "Pushing to correct repository..."
git push origin main

echo ""
echo "=== Remote URL fixed and changes pushed! ==="
echo "Your repository is now correctly connected to:"
echo "https://github.com/shapidesign/portfolio.git"
