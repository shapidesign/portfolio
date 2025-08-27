#!/bin/bash

echo "=== Updating Social Links and Removing Emojis ==="
echo "1. Changed Instagram to TikTok"
echo "2. Removed emojis from modals"
echo ""

cd /Users/YehonatanShapira/Documents/Coding/portfolio-2/new-sat

echo "Adding changes..."
git add .

echo "Committing updates..."
git commit -m "Update social links: Instagram to TikTok, remove emojis from modals"

echo "Pushing to GitHub..."
git push origin main

echo "=== Updates pushed successfully! ==="
echo "Your TikTok link is now live and emojis are removed."
