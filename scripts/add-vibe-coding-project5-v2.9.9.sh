#!/bin/bash

echo "=== Add Vibe Coding Project 5 v2.9.9 ==="
echo "Adding Project 5: Vibe Coding! with GIF support..."
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
echo "Committing Vibe Coding project with GIF support..."
git commit -m "Add Vibe Coding Project 5 v2.9.9

- ADDED: Project 5 - Vibe Coding! (Purple Planet)
- ADDED: GIF support with endless loop functionality
- ENHANCED: Media system to handle images, videos, and GIFs
- UPDATED: Version tag to v2.9.9

Project 5: Vibe Coding! (Purple Planet)
- Title: 'Vibe Coding!'
- Description: Journey through coding evolution and growth
- Tags: Web Development, Game Development, Animation, Full-Stack, Creative Coding
- Color: Purple (0xae81ff)
- Media: 4 images + 1 video + 1 GIF

Media Content:
- Screenshot 2025-08-27 at 15.16.08.png (Portfolio website)
- 3.jpeg (Rice cooker project)
- 1.svg (Squadron website)
- 2.svg (Bubble-trouble pixel game)
- Screen Recording 2025-08-27 at 15.16.51.mov (Video demo)
- wave-loop.gif (Endless wave animation)

Technical Enhancements:
- Added GIF support to media loading system
- GIFs play endlessly with proper styling
- Enhanced media array to include videos, GIFs, then images
- Mobile and desktop GIF display support
- Proper aspect ratio and responsive design

GIF Features:
- Endless loop playback
- Responsive design on mobile and desktop
- Proper object-fit and border-radius
- Consistent styling with other media types
- No controls needed (automatic loop)

Project Description:
'A journey through my coding evolution - from playful experiments to serious development. This collection showcases my growth as a developer, featuring this very portfolio website, a whimsical 'rice cooker' project, a professional squadron website, a retro pixel-style bubble-trouble game, and an endless wave animation. Each project represents a different phase of my coding journey, blending creativity with technical skill.'

Ready for complete coding portfolio showcase!"

# Push to GitHub
echo "Pushing to GitHub..."
git push origin main

echo ""
echo "=== Vibe Coding Project 5 Added v2.9.9! ==="
echo "Changes include:"
echo "✅ Added Project 5: Vibe Coding! (Purple Planet)"
echo "✅ Added GIF support with endless loop"
echo "✅ Enhanced media system (images + videos + GIFs)"
echo "✅ Updated version to v2.9.9"
echo ""
echo "🎨 Project 5: Vibe Coding!"
echo "   - 4 images (portfolio, rice cooker, squadron, bubble-trouble)"
echo "   - 1 video (screen recording demo)"
echo "   - 1 GIF (endless wave animation)"
echo "   - Coding evolution showcase"
echo ""
echo "🎬 GIF Features:"
echo "   - Endless loop playback"
echo "   - Responsive design"
echo "   - Proper aspect ratio"
echo "   - Consistent styling"
echo ""
echo "🚀 Complete coding portfolio now ready!"
