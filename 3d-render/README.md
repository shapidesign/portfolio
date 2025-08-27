# Planet Hero Portfolio Component

A stunning React/Next.js planet hero section with Three.js, featuring realistic Earth textures, floating moon companion, scroll-driven camera motion, and cinematic post-processing effects.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

### 3. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the planet hero in action!

## 🎨 Features

- 🌍 **Realistic Earth** with clouds and atmospheric rim lighting
- 🌙 **Floating moon companion** with custom positioning
- 📱 **Scroll-driven camera motion** - camera moves as you scroll
- ✨ **Cinematic post-processing effects**:
  - Bloom lighting
  - Chromatic aberration
  - Vignette darkening
- 🎨 **Fully customizable** colors and content
- 📱 **Responsive design** for all devices
- ⚡ **Performance optimized** with proper loading states
- 🔧 **TypeScript support** for better development experience

## 🎯 Visual Effects

### Post-Processing Pipeline
- **Bloom**: Soft glow around bright objects
- **Chromatic Aberration**: Subtle color separation for cinematic look
- **Vignette**: Darkened edges for focus
- **Atmospheric Rim Lighting**: Glowing atmosphere around planets

### Textures & Materials
- **Earth**: High-resolution 4K Earth texture with normal mapping
- **Clouds**: Transparent cloud layer with realistic opacity
- **Moon**: Detailed lunar surface texture
- **Atmosphere**: Custom shader-based rim lighting

## 📱 Mobile Experience

- **Touch optimized**: Smooth scrolling on mobile
- **Performance**: Optimized for mobile GPUs
- **Responsive**: Adapts to screen sizes
- **Loading**: Fast initial load with progressive enhancement

## 🔧 Customization

### Props

```tsx
<PlanetHero 
  title="Your Title"
  subtitle="Your subtitle text"
  customColors={{
    primary: '#66d9ef',    // Main accent color
    secondary: '#a6e22e',  // Secondary accent
    accent: '#f92672'      // Highlight color
  }}
/>
```

### Color Scheme
The component uses your monokai color scheme by default:
- **Primary**: `#66d9ef` (Cyan)
- **Secondary**: `#a6e22e` (Green) 
- **Accent**: `#f92672` (Pink)

## 📁 Project Structure

```
planet-hero-portfolio/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Main page
├── components/
│   └── PlanetHero.tsx       # Main component
├── package.json             # Dependencies
├── tailwind.config.ts       # Tailwind config
├── next.config.js           # Next.js config
└── README.md                # This file
```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Tech Stack

- **Next.js 14** - React framework
- **Three.js** - 3D graphics library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for R3F
- **React Three Postprocessing** - Post-processing effects
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## 🎬 Scroll Motion

The component features smooth scroll-driven camera motion:

1. **Initial Position**: Camera starts at `(0, 0, 12)`
2. **Scroll Progress**: Calculated based on component visibility
3. **Target Position**: Interpolated between `(-2, 0, 12)` and `(2, 0, 6)`
4. **Smooth Damping**: Uses Three.js `MathUtils.damp` for smooth transitions

## 🔍 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📄 License

MIT License - feel free to use in your projects!

## 🤝 Integration with Your Portfolio

This component is designed to integrate seamlessly with your existing space-themed portfolio:

1. **Matches your design**: Uses your monokai color scheme
2. **Self-contained**: Won't interfere with existing code
3. **Performance optimized**: Efficient Three.js rendering
4. **Mobile friendly**: Responsive and touch-optimized

## 🚀 Performance Tips

- **Texture loading**: Uses CDN-hosted textures for speed
- **Progressive enhancement**: Graceful fallbacks for slower devices
- **Memory management**: Proper cleanup of Three.js resources
- **Mobile optimization**: Reduced particle count on mobile

## 🎯 Next Steps

1. **Test the demo**: Run `npm run dev` and scroll to see the effect
2. **Customize colors**: Modify the `customColors` prop to match your brand
3. **Integrate**: Copy the component to your existing portfolio
4. **Deploy**: Build and deploy to your hosting platform

---

**Ready to create an unforgettable first impression?** 🌟
