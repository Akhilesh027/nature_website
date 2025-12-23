import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Package, 
  BookOpen, 
  LogOut,
  MapPin,
  Gift,
  ChevronRight,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { api, Order, Enrollment, UserBooking } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user, isAuthenticated, logout, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        const [ordersData, enrollmentsData, bookingsData] = await Promise.allSettled([
          api.getUserOrders(user.id),
          api.getUserEnrollments(user.id),
          api.getUserBookings(user.id),
        ]);

        if (ordersData.status === "fulfilled") setOrders(ordersData.value);
        if (enrollmentsData.status === "fulfilled") setEnrollments(enrollmentsData.value);
        if (bookingsData.status === "fulfilled") setBookings(bookingsData.value);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    navigate("/");
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await api.cancelBooking(bookingId);
      setBookings(prev => 
        prev.map(b => b._id === bookingId ? { ...b, status: "cancelled" } : b)
      );
      toast({ title: "Booking Cancelled", description: "Your booking has been cancelled." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to cancel booking.", variant: "destructive" });
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-500/10 text-green-600 border-green-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
      case "completed": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* User Info Card */}
        <Card className="mb-8 border-border/50 overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary/30 via-primary/20 to-accent/30" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div className="flex-1 pb-4 md:pb-0">
                <h1 className="font-display text-2xl font-bold text-foreground">
                  {user?.firstName} {user?.lastName}
                </h1>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </span>
                  {user?.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="h-4 w-4" />
                      {user.phone}
                    </span>
                  )}
                </div>
              </div>
              {user?.referralCode && (
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
                  <Gift className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Code: {user.referralCode}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="bookings" className="gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
              {bookings.length > 0 && <Badge variant="secondary" className="ml-1">{bookings.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-2">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
              {orders.length > 0 && <Badge variant="secondary" className="ml-1">{orders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Courses</span>
              {enrollments.length > 0 && <Badge variant="secondary" className="ml-1">{enrollments.length}</Badge>}
            </TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : bookings.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No bookings yet</p>
                    <Button onClick={() => navigate("/")}>Browse Services</Button>
                  </CardContent>
                </Card>
              ) : (
                bookings.map((booking) => (
                  <Card key={booking._id} className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status || "Pending"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">#{booking.orderId}</span>
                          </div>
                          <h3 className="font-medium mb-1">
                            {booking.products?.map(p => p.title).join(", ") || "Service Booking"}
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {booking.booking?.date ? format(new Date(booking.booking.date), "MMM d, yyyy") : "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {booking.booking?.timeSlot || "N/A"}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5" />
                              {booking.booking?.serviceType === "home" ? "Home Service" : "Clinic Visit"}
                            </span>
                          </div>
                        </div>
                        {booking.status?.toLowerCase() !== "cancelled" && booking.status?.toLowerCase() !== "completed" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-destructive hover:text-destructive border-destructive/30"
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button onClick={() => navigate("/")}>Start Shopping</Button>
                  </CardContent>
                </Card>
              ) : (
                orders.map((order) => (
                  <Card key={order._id} className="border-border/50 hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status || "Processing"}
                            </Badge>
                            <span className="text-sm text-muted-foreground">#{order.orderId}</span>
                          </div>
                          <h3 className="font-medium mb-1">
                            {order.products?.length || 0} item(s)
                          </h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "N/A"}
                            </span>
                            <span className="font-medium text-foreground">
                              ₹{order.amounts?.total?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses">
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : enrollments.length === 0 ? (
                <Card className="border-border/50">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No enrolled courses</p>
                    <Button onClick={() => navigate("/")}>Explore Courses</Button>
                  </CardContent>
                </Card>
              ) : (
                enrollments.map((enrollment) => (
                  <Card key={enrollment.courseId} className="border-border/50 hover:border-primary/30 transition-colors overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-48 h-32 md:h-auto">
                          <img 
                            src={enrollment.courseImage || "/placeholder.svg"} 
                            alt={enrollment.courseName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(enrollment.status)}>
                              {enrollment.status || "Active"}
                            </Badge>
                            <Badge variant="outline">{enrollment.courseCategory}</Badge>
                          </div>
                          <h3 className="font-medium mb-2">{enrollment.courseName}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {enrollment.courseDuration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Enrolled: {format(new Date(enrollment.enrollmentDate), "MMM d, yyyy")}
                            </span>
                          </div>
                          {enrollment.progress !== undefined && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span className="font-medium">{enrollment.progress}%</span>
                              </div>
                              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${enrollment.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
