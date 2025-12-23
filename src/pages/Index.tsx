import { useEffect, useState } from "react";
import { api, Product, Package } from "@/lib/api";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";
import { Sparkles, Package as PackageIcon, TrendingUp, Home, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Index() {
  const [products, setProducts] = useState<Product[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, packagesRes] = await Promise.all([
          api.getProducts(),
          api.getPackages(),
        ]);
        setProducts(productsRes);
        setPackages(packagesRes);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const mostBooked = products.slice(0, 4);
  const bestSellers = products.slice(4, 8);
  const homeServices = products.filter((p) => p.category === "home_service").slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      {/* Categories */}
      <CategorySection />

      {/* Most Booked Section */}
      <section className="py-12 md:py-16 gradient-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Most Booked
                </h2>
                <p className="text-sm text-muted-foreground">Popular services loved by customers</p>
              </div>
            </div>
            <Link to="/category/salon_for_women">
              <Button variant="ghost" className="hidden md:flex">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {mostBooked.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent-foreground" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Best Sellers
                </h2>
                <p className="text-sm text-muted-foreground">Top-rated services this month</p>
              </div>
            </div>
            <Link to="/category/salon_for_women">
              <Button variant="ghost" className="hidden md:flex">
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {bestSellers.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-12 md:py-16 gradient-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <PackageIcon className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-foreground">
                  Special Packages
                </h2>
                <p className="text-sm text-muted-foreground">Save more with our bundles</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-video rounded-xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {packages.slice(0, 3).map((pkg) => (
                <div
                  key={pkg._id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={pkg.image || "/placeholder.svg"}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-display text-xl font-semibold text-card mb-1">
                        {pkg.name}
                      </h3>
                      <p className="text-sm text-card/80 line-clamp-2">{pkg.description}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xl font-semibold text-foreground">₹{pkg.price}</span>
                        {pkg.originalPrice && (
                          <span className="ml-2 text-sm text-muted-foreground line-through">
                            ₹{pkg.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Home Services Banner */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden gradient-hero p-8 md:p-12">
            <div className="relative z-10 max-w-lg">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-6 h-6 text-primary-foreground" />
                <span className="text-primary-foreground/80 font-medium">Home Services</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Beauty at Your Doorstep
              </h2>
              <p className="text-primary-foreground/80 mb-6">
                Get professional salon services in the comfort of your home. 
                Our experts come equipped with premium products and tools.
              </p>
              <Link to="/category/salon_for_women">
                <Button variant="secondary" size="lg" className="rounded-full">
                  Book Home Service
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
              <Sparkles className="absolute top-1/4 right-1/4 w-12 h-12 text-primary-foreground" />
              <Sparkles className="absolute bottom-1/3 right-1/3 w-8 h-8 text-primary-foreground" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-display text-xl font-semibold">Glamour</span>
              </div>
              <p className="text-background/70 text-sm">
                Premium beauty services at your doorstep. Salon, spa, facials & more.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>Salon for Women</li>
                <li>Spa Services</li>
                <li>Hydra Facial</li>
                <li>Pre Bridal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-background/70">
                <li>Help Center</li>
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Refund Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/50">
            © 2024 Glamour Beauty. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
