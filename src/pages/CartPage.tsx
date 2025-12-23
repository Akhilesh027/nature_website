import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Truck,
  Receipt,
  Lock,
} from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 99 : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleRemove = (productId: string, title: string) => {
    removeFromCart(productId);
    toast.success("Removed from cart", { description: title });
  };

  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              My Cart
            </h1>
            <p className="text-muted-foreground">
              {cart.products.length} {cart.products.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>

        {cart.products.length === 0 ? (
          /* Empty Cart */
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-primary/50" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Looks like you haven't added any services yet. Start exploring our beauty services!
            </p>
            <Link to="/">
              <Button size="lg" className="rounded-full">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.products.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-4 bg-card rounded-xl shadow-card"
                >
                  {/* Image */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground line-clamp-2 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-lg font-semibold text-primary mb-3">
                      ₹{item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.productId, item.title)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {/* Clear Cart */}
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleClearCart}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl shadow-card p-6 sticky top-24">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Receipt className="w-4 h-4" />
                      <span>Subtotal</span>
                    </div>
                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="w-4 h-4" />
                      <span>Shipping</span>
                    </div>
                    <span className="font-medium">₹{shipping.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Receipt className="w-4 h-4" />
                      <span>Tax (18%)</span>
                    </div>
                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  size="lg"
                  className="w-full rounded-xl"
                >
                  <Lock className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>

                <p className="text-xs text-center text-muted-foreground mt-4">
                  Secure checkout powered by trusted payment partners
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
