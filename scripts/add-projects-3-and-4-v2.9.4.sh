#!/bin/bash

echo "=== Add Projects 3 & 4 v2.9.4 ==="
echo "Adding Pixel Portrait Challenge and Design as Social Commentary..."
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
echo "Committing new projects..."
git commit -m "Add Projects 3 & 4 v2.9.4

- ADDED: Pixel Portrait Challenge (Green Planet)
- ADDED: Design as Social Commentary (Orange Planet)
- IMPROVED: Professional project descriptions
- IMPROVED: Strategic tag categorization
- IMPROVED: Conceptual depth and storytelling
- UPDATED: Version tag to v2.9.4

Project 3: Pixel Portrait Challenge (Green Planet)
- Title: 'Pixel Portrait Challenge'
- Description: Viral TikTok challenge with 800+ followers in 24 hours
- Tags: Pixel Art, Social Media, Digital Illustration, Community Engagement
- Color: Green (0xa6e22e)
- Images: 5 pixel portrait examples

Project 4: Design as Social Commentary (Orange Planet)
- Title: 'Design as Social Commentary'
- Description: Provocative exploration of design as social criticism
- Tags: Social Commentary, Graphic Design, Poster Design, Conceptual Art
- Color: Orange (0xfd971f)
- Images: 5 social commentary posters

Enhanced descriptions:
- Pixel Portrait Challenge: Emphasizes viral success, community engagement, and social media strategy
- Design as Social Commentary: Highlights conceptual depth, visual dissonance, and social criticism

Strategic positioning:
- Green Planet: Community-driven, viral content creation
- Orange Planet: Conceptual, thought-provoking social commentary
- Both projects showcase different aspects of creative communication

Ready for portfolio expansion!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Projects 3 & 4 Added v2.9.4! ==="
echo "Changes include:"
echo "✅ Added Pixel Portrait Challenge (Green Planet)"
echo "✅ Added Design as Social Commentary (Orange Planet)"
echo "✅ Professional project descriptions"
echo "✅ Strategic tag categorization"
echo "✅ Enhanced conceptual storytelling"
echo "✅ Updated version to v2.9.4"
echo ""
echo "🎨 Project 3: Pixel Portrait Challenge"
echo "   - Viral TikTok success story"
echo "   - 800+ followers in 24 hours"
echo "   - Community engagement strategy"
echo "   - Pixel art digital illustration"
echo ""
echo "🎭 Project 4: Design as Social Commentary"
echo "   - Provocative social criticism"
echo "   - Visual dissonance concept"
echo "   - Conceptual art approach"
echo "   - Medium vs message exploration"
echo ""
echo "🚀 Portfolio now showcases diverse creative approaches!"
