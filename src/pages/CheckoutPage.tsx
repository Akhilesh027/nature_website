import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Building2, 
  MapPin, 
  Phone, 
  User, 
  CheckCircle2,
  Home,
  Building,
  CalendarIcon,
  Clock
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { api, OrderPayload } from "@/lib/api";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 01:00 PM",
  "02:00 PM - 03:00 PM",
  "03:00 PM - 04:00 PM",
  "04:00 PM - 05:00 PM",
  "05:00 PM - 06:00 PM",
];

export default function CheckoutPage() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Service type selection
  const [serviceType, setServiceType] = useState<"home" | "clinic">("home");

  // Booking state
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");

  // Address state
  const [fullName, setFullName] = useState(user?.name || `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const subtotal = getCartTotal();
  const shipping = serviceType === "home" ? 5.99 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.products.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedDate || !selectedTimeSlot) {
      toast({
        title: "Booking Required",
        description: "Please select a date and time slot.",
        variant: "destructive",
      });
      return;
    }

    if (serviceType === "home" && (!street || !city || !state || !zipCode)) {
      toast({
        title: "Address Required",
        description: "Please fill in your delivery address.",
        variant: "destructive",
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast({
        title: "Login Required",
        description: "Please login to place an order.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    try {
      const generatedOrderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      const orderPayload: OrderPayload = {
        userId: user.id,
        products: cart.products.map(item => ({
          productId: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        address: {
          fullName,
          street,
          city,
          state,
          zipCode,
          phone,
        },
        booking: {
          serviceType,
          date: selectedDate.toISOString(),
          timeSlot: selectedTimeSlot,
        },
        paymentType: paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod,
        amounts: {
          subtotal,
          shipping,
          tax,
          total,
        },
        orderId: generatedOrderId,
      };

      await api.createOrder(orderPayload);

      setOrderId(generatedOrderId);
      setOrderPlaced(true);
      clearCart();

      toast({
        title: "Order Placed!",
        description: `Your order ${generatedOrderId} has been placed successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Could not place your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Order Placed!</h1>
            <p className="text-lg text-primary font-medium mb-4">Order ID: {orderId}</p>
            <p className="text-muted-foreground mb-4">
              {serviceType === "home" 
                ? "Your service will be provided at your home."
                : "Please visit our clinic at the scheduled time."}
            </p>
            <div className="bg-muted/50 rounded-lg p-4 mb-8">
              <p className="text-sm text-muted-foreground mb-1">Scheduled For:</p>
              <p className="font-medium">{selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
              <p className="text-primary">{selectedTimeSlot}</p>
            </div>
            <div className="space-y-3">
              <Button onClick={() => navigate("/")} className="w-full">
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate("/orders")} className="w-full">
                View Orders
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4">
          <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Cart</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Service Type */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5 text-primary" />
                    Service Type
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={serviceType} onValueChange={(v) => setServiceType(v as "home" | "clinic")} className="grid grid-cols-2 gap-4">
                    <div className={cn(
                      "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors",
                      serviceType === "home" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}>
                      <RadioGroupItem value="home" id="home" />
                      <Label htmlFor="home" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Home className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Home Service</p>
                          <p className="text-xs text-muted-foreground">We'll come to you</p>
                        </div>
                      </Label>
                    </div>

                    <div className={cn(
                      "flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors",
                      serviceType === "clinic" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    )}>
                      <RadioGroupItem value="clinic" id="clinic" />
                      <Label htmlFor="clinic" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Building className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Clinic Visit</p>
                          <p className="text-xs text-muted-foreground">Visit our location</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Booking Date & Time */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Schedule Appointment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Select Time Slot</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <Button
                          key={slot}
                          type="button"
                          variant={selectedTimeSlot === slot ? "default" : "outline"}
                          className="text-xs h-auto py-2"
                          onClick={() => setSelectedTimeSlot(slot)}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {slot.split(" - ")[0]}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address - Only for Home Service */}
              {serviceType === "home" && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Delivery Address
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="fullName"
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="pl-10"
                            required={serviceType === "home"}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 9876543210"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="pl-10"
                            required={serviceType === "home"}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        type="text"
                        placeholder="123 Main Street, Apt 4B"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        required={serviceType === "home"}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Hyderabad"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          required={serviceType === "home"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="Telangana"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          required={serviceType === "home"}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">PIN Code</Label>
                        <Input
                          id="zipCode"
                          type="text"
                          placeholder="500001"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          required={serviceType === "home"}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Cash on Delivery</p>
                          <p className="text-sm text-muted-foreground">Pay when you receive service</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Credit / Debit Card</p>
                          <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Wallet className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">UPI Payment</p>
                          <p className="text-sm text-muted-foreground">Pay using UPI apps</p>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-3 p-4 border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">Net Banking</p>
                          <p className="text-sm text-muted-foreground">Pay through your bank</p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <Card className="border-border/50 sticky top-24">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Service Details */}
                  {(selectedDate || selectedTimeSlot) && (
                    <>
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <p className="text-sm font-medium">Service Details</p>
                        <div className="flex items-center gap-2 text-sm">
                          {serviceType === "home" ? <Home className="h-4 w-4 text-primary" /> : <Building className="h-4 w-4 text-primary" />}
                          <span>{serviceType === "home" ? "Home Service" : "Clinic Service"}</span>
                        </div>
                        {selectedDate && (
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                            <span>{format(selectedDate, "MMM d, yyyy")}</span>
                          </div>
                        )}
                        {selectedTimeSlot && (
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{selectedTimeSlot}</span>
                          </div>
                        )}
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Cart Items Preview */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {cart.products.map((item) => (
                      <div key={item.productId} className="flex items-center gap-3">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-medium">₹{(item.price * item.quantity).toFixed(0)}</p>
                      </div>
                    ))}
                  </div>

                  {cart.products.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">Your cart is empty</p>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className={shipping === 0 ? "text-green-600" : ""}>
                        {shipping === 0 ? "Free" : `₹${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (8%)</span>
                      <span>₹{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={isProcessing || cart.products.length === 0}
                  >
                    {isProcessing ? "Processing..." : `Place Order • ₹${total.toFixed(2)}`}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    By placing this order, you agree to our Terms of Service
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
