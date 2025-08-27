import PlanetHero from '../components/PlanetHero';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Planet Hero Section */}
      <PlanetHero 
        title="Shapi Design"
        subtitle="Creative developer crafting cosmic digital experiences. Scroll to explore my universe of projects."
        customColors={{
          primary: '#66d9ef',    // Your cyan
          secondary: '#a6e22e',  // Your green
          accent: '#f92672'      // Your pink
        }}
      />
      
      {/* Demo content to show scroll effect */}
      <div className="container mx-auto px-4 py-16 space-y-8">
        <section className="text-center">
          <h2 className="text-4xl font-bold text-primary mb-8 font-mono">
            Welcome to My Portfolio
          </h2>
          <p className="text-white/80 text-lg leading-relaxed font-mono max-w-3xl mx-auto">
            This is where your existing portfolio content would continue. 
            The planet hero section above creates a stunning introduction 
            that perfectly matches your space theme.
          </p>
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-bold text-secondary mb-6 font-mono">
            Features
          </h3>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="p-6 bg-black/20 border border-primary/20 rounded-lg">
              <h4 className="text-primary font-mono font-semibold mb-2">Scroll-Driven Camera</h4>
              <p className="text-white/70 text-sm">Smooth camera movement as you scroll through the page</p>
            </div>
            <div className="p-6 bg-black/20 border border-secondary/20 rounded-lg">
              <h4 className="text-secondary font-mono font-semibold mb-2">Realistic Textures</h4>
              <p className="text-white/70 text-sm">High-quality Earth and Moon textures with atmospheric effects</p>
            </div>
            <div className="p-6 bg-black/20 border border-accent/20 rounded-lg">
              <h4 className="text-accent font-mono font-semibold mb-2">Post-Processing</h4>
              <p className="text-white/70 text-sm">Cinematic effects including bloom, chromatic aberration, and vignette</p>
            </div>
          </div>
        </section>

        <section className="text-center">
          <h3 className="text-2xl font-bold text-primary mb-6 font-mono">
            Integration Ready
          </h3>
          <p className="text-white/80 text-lg leading-relaxed font-mono max-w-3xl mx-auto">
            This component is designed to integrate seamlessly with your existing portfolio. 
            It uses your monokai color scheme and won't interfere with your current code.
          </p>
        </section>

        {/* More demo content for scrolling */}
        <div className="space-y-16">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="text-center p-8 bg-black/10 border border-primary/10 rounded-lg">
              <h4 className="text-xl font-bold text-primary mb-4 font-mono">
                Section {i + 1}
              </h4>
              <p className="text-white/70 font-mono">
                This demonstrates the scroll effect. As you scroll down, the camera will move around the planets.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
