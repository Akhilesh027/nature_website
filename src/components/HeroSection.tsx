import { ArrowRight, Sparkles, Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function HeroSection() {
  const [location, setLocation] = useState("Getting location...");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            );
            const data = await res.json();
            setLocation(data.city || "Your Location");
          } catch {
            setLocation("Your Location");
          }
        },
        () => setLocation("Enable location")
      );
    }
  }, []);

  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-hero opacity-95" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-primary-foreground/10 blur-3xl animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      {/* Sparkle decorations */}
      <Sparkles className="absolute top-1/4 right-1/4 w-6 h-6 text-primary-foreground/50 animate-pulse-soft" />
      <Sparkles className="absolute bottom-1/3 left-1/5 w-4 h-4 text-primary-foreground/40 animate-pulse-soft" style={{ animationDelay: "1s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm text-primary-foreground/90 text-sm mb-6 animate-fade-in">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-6 leading-tight animate-slide-up">
            Discover Your
            <br />
            <span className="relative">
              Perfect Glow
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                <path d="M2 10C40 2 80 2 100 6C120 10 160 10 198 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary-foreground/40" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-lg animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Premium beauty services at your doorstep. Salon, spa, facials & more by top professionals.
          </p>

          {/* Rating */}
          <div className="flex items-center gap-4 mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-primary-foreground bg-primary-foreground/20 backdrop-blur-sm"
                />
              ))}
            </div>
            <div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-primary-foreground/70">10,000+ Happy Customers</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/category/salon_for_women">
              <Button size="lg" variant="secondary" className="text-base px-8 py-6 rounded-full shadow-elevated hover:shadow-soft transition-all">
                Book Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/category/spa_for_women">
              <Button size="lg" variant="ghost" className="text-base px-8 py-6 rounded-full text-primary-foreground border border-primary-foreground/30 hover:bg-primary-foreground/10">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path
            d="M0 120L60 105C120 90 240 60 360 55C480 50 600 70 720 75C840 80 960 70 1080 65C1200 60 1320 60 1380 60L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
}
