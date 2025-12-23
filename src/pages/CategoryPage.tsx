import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api, Product } from "@/lib/api";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface CategoryConfig {
  name: string;
  categories: { id: string; name: string; icon: string }[];
  subCategories?: { [key: string]: string[] };
}

const categoryConfig: { [key: string]: CategoryConfig } = {
  salon_for_women: {
    name: "Salon for Women",
    categories: [
      { id: "waxing", name: "Waxing", icon: "✨" },
      { id: "facials", name: "Facials", icon: "💆" },
      { id: "body", name: "Body", icon: "💪" },
      { id: "mani_pedi", name: "Mani-Pedi", icon: "💅" },
      { id: "cleanup", name: "Cleanup", icon: "✨" },
      { id: "bleach_dtan", name: "Bleach & D-Tan", icon: "🌟" },
      { id: "hair", name: "Hair", icon: "💇" },
    ],
    subCategories: {
      waxing: ["Self Care Package", "Roll-on Wax", "Rica Wax", "Keri Wax", "Face Wax"],
      facials: ["Classic Facial", "Premium Facial", "Ayurvedic Facial", "Gold Facial"],
      body: ["Body Polishing", "Threading & Face Wax"],
      mani_pedi: ["Manicure", "Pedicure", "Combo"],
      cleanup: ["Classic Clean-up", "Gold Clean-up", "Face/Neck Massage"],
      bleach_dtan: ["Bleach + D-Tan"],
      hair: ["Keratin", "Hair Spa with Serum"],
    },
  },
  spa_for_women: {
    name: "Spa for Women",
    categories: [
      { id: "stress_relief", name: "Stress Relief", icon: "🌸" },
      { id: "pain_relief", name: "Pain Relief", icon: "🔥" },
      { id: "post_natal", name: "Post Natal", icon: "👶" },
      { id: "body_rituals", name: "Body Rituals", icon: "🦶" },
      { id: "skin_care", name: "Skin Care", icon: "✨" },
    ],
  },
  hydra_facial: {
    name: "Hydra Facial",
    categories: [
      { id: "hydra_basic", name: "Hydra Basic", icon: "💧" },
      { id: "hydra_cleanup", name: "Hydra Cleanup", icon: "✨" },
      { id: "body_polishing", name: "Body Polishing", icon: "🌟" },
      { id: "intimate_care", name: "Intimate Care", icon: "🌸" },
    ],
    subCategories: {
      hydra_basic: ["Hydra Facials", "Hydra Glow"],
    },
  },
  pre_bridal: {
    name: "Pre Bridal",
    categories: [{ id: "premium", name: "Premium", icon: "🎁" }],
  },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>("all");

  const config = categoryConfig[category || "salon_for_women"] || categoryConfig.salon_for_women;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const filteredProducts =
    selectedSubCategory === "all"
      ? products
      : products.filter(
          (p) => p.category === selectedSubCategory || p.subCategory === selectedSubCategory
        );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="gradient-hero pt-8 pb-16">
        <div className="container mx-auto px-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground mb-4 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Home
          </Link>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
            {config.name}
          </h1>
          <p className="text-primary-foreground/80 mt-2">
            Discover our premium {config.name.toLowerCase()} services
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Category Tabs */}
        <div className="bg-card rounded-2xl shadow-card p-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Button
              variant={selectedSubCategory === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedSubCategory("all")}
              className="whitespace-nowrap"
            >
              All Services
            </Button>
            {config.categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedSubCategory === cat.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedSubCategory(cat.id)}
                className="whitespace-nowrap"
              >
                <span className="mr-1">{cat.icon}</span>
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Sub-categories */}
          {config.subCategories && config.subCategories[selectedSubCategory] && (
            <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
              {config.subCategories[selectedSubCategory].map((sub) => (
                <button
                  key={sub}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors",
                    "border border-border hover:bg-secondary"
                  )}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Products Grid */}
        <div className="pb-16">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-[4/3] rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Filter className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No services found</h3>
              <p className="text-muted-foreground">
                Try selecting a different category or filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
