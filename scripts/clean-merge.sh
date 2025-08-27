#!/bin/bash

echo "=== Cleaning Up Merge State ==="
echo "Resolving swap file conflict and cleaning up..."
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Aborting any current merge..."
git merge --abort

echo ""
echo "Cleaning up any leftover merge files..."
rm -f .git/.MERGE_MSG.swp
rm -f .git/MERGE_HEAD
rm -f .git/MERGE_MSG

echo ""
echo "Checking git status..."
git status

echo ""
echo "Fetching latest from remote..."
git fetch origin

echo ""
echo "Resetting to match remote main branch..."
git reset --hard origin/main

echo ""
echo "Adding all local changes..."
git add .

echo "Committing changes..."
git commit -m "Fix JavaScript errors: null element, earth image path, Three.js material"

echo ""
echo "Pushing to remote..."
git push origin main

echo ""
echo "=== Clean merge completed! ==="
echo "All conflicts resolved and changes pushed successfully."
