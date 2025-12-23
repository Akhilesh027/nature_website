import { Link } from "react-router-dom";
import { Star, Clock, ShoppingCart, Plus } from "lucide-react";
import { Product } from "@/lib/api";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Added to cart!", {
      description: product.name || product.title,
    });
  };

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount;

  return (
    <Link to={`/product/${product._id}`}>
      <div className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name || product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Discount Badge */}
          {discountPercentage && discountPercentage > 0 && (
            <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
              {discountPercentage}% OFF
            </div>
          )}

          {/* Tag */}
          {product.tag && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
              {product.tag}
            </div>
          )}

          {/* Quick Add Button */}
          <Button
            onClick={handleAddToCart}
            size="icon"
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name || product.title}
          </h3>

          {/* Rating & Duration */}
          <div className="flex items-center gap-3 mb-3 text-sm text-muted-foreground">
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{product.rating}</span>
              </div>
            )}
            {product.duration && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{product.duration}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-foreground">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
            <Button
              onClick={handleAddToCart}
              variant="secondary"
              size="sm"
              className="md:hidden"
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
