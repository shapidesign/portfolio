#!/bin/bash

echo "Starting GitHub push process..."

# Navigate to the project directory
cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Current directory: $(pwd)"

# Check git status
echo "Checking git status..."
git status

# Add all changes
echo "Adding all changes..."
git add .

# Commit changes
echo "Committing changes..."
git commit -m "Push mobile modal fixes and improvements"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo "Push process completed!"
