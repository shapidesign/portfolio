#!/bin/bash

echo "=== Syncing with Remote Repository ==="
echo "Pulling remote changes first, then pushing local changes..."
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Fetching latest changes from remote..."
git fetch origin

echo ""
echo "Checking current status..."
git status

echo ""
echo "Pulling remote changes (merge strategy)..."
git pull origin main --no-rebase

echo ""
echo "Adding all local changes..."
git add .

echo "Committing local changes..."
git commit -m "Fix JavaScript errors and sync with remote"

echo ""
echo "Pushing to remote repository..."
git push origin main

echo ""
echo "=== Sync and push completed! ==="
echo "Your local and remote repositories are now in sync."
