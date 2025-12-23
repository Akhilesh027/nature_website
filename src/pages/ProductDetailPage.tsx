import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { api, Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ChevronLeft,
  Star,
  Clock,
  ShoppingCart,
  Check,
  Sparkles,
  Shield,
  Award,
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        navigate("/");
        return;
      }

      try {
        setLoading(true);
        const data = await api.getProduct(productId);
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        toast.error("Product not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, navigate]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      toast.success("Added to cart!", {
        description: product.name || product.title,
      });
    }
  };

  const discountPercentage = product?.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : product?.discount;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images?.length ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to services
        </Link>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted">
              <img
                src={images[selectedImage] || "/placeholder.svg"}
                alt={product.name || product.title}
                className="w-full h-full object-cover"
              />
              {discountPercentage && discountPercentage > 0 && (
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                  {discountPercentage}% OFF
                </div>
              )}
              {product.tag && (
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                  {product.tag}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                {product.name || product.title}
              </h1>

              {/* Rating & Duration */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {product.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    {product.reviews && (
                      <span className="text-muted-foreground">
                        ({product.reviews} reviews)
                      </span>
                    )}
                  </div>
                )}
                {product.duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{product.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-foreground">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
              {discountPercentage && discountPercentage > 0 && (
                <span className="text-primary font-medium">
                  Save ₹{product.originalPrice! - product.price}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4 py-4 border-y border-border">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-5 h-5 text-primary" />
                <span>Safe & Hygienic</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Award className="w-5 h-5 text-primary" />
                <span>Expert Professionals</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                <span>Premium Products</span>
              </div>
            </div>

            {/* Add to Cart */}
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full text-base py-6 rounded-xl"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart - ₹{product.price}
            </Button>

            {/* FAQs */}
            {product.faqs && product.faqs.length > 0 && (
              <div className="pt-6">
                <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {product.faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
