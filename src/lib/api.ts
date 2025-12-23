const API_BASE = "https://api.hellonature.in/api";

export interface Product {
  _id: string;
  name: string;
  title?: string;
  description?: string;
  price: number;
  oldPrice?: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  images?: string[];
  category?: string;
  subCategory?: string;
  tag?: string;
  rating?: number;
  reviews?: number;
  time?: string;
  duration?: string;
  faqs?: { question: string; answer: string }[];
  benefits?: string[];
  overview?: string[];
  thingsToKnow?: string[];
  precautions?: string[];
  procedure?: { title: string; desc: string; img?: string }[];
  serviceType?: string;
  gender?: string;
  type?: string;
}

export interface Course {
  _id: string;
  name: string;
  description: string;
  price: string;
  oldPrice?: string;
  image: string;
  category: string;
  duration: string;
  level?: string;
  rating: number;
  students?: number;
  instructor?: { name: string; avatar?: string };
  certificate?: boolean;
  whatYouWillLearn?: string[];
  prerequisites?: string[];
  curriculum?: {
    week: number;
    description: string;
    topics?: string[];
  }[];
}

export interface Package {
  _id: string;
  name: string;
  description?: string;
  amount?: number;
  price?: number;
  originalPrice?: number;
  image?: string;
  services: { productId?: string; name: string }[];
  duration?: string;
}

export interface Banner {
  _id: string;
  imageUrl: string;
  section?: string;
  navigateTo?: string;
  title?: string;
}

export interface CartItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Cart {
  products: CartItem[];
  userId?: string;
}

export interface Enrollment {
  userId: string;
  courseId: string;
  userName?: string;
  userEmail?: string;
  courseName: string;
  coursePrice: string;
  courseCategory: string;
  courseDuration: string;
  courseImage: string;
  enrollmentDate: string;
  paymentStatus: string;
  progress: number;
  status: string;
}

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

export interface Booking {
  serviceType: "home" | "clinic";
  date: string;
  timeSlot: string;
}

export interface OrderPayload {
  userId: string;
  products: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  address: Address;
  booking: Booking;
  paymentType: string;
  amounts: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  orderId: string;
}

export interface Order {
  _id: string;
  orderId: string;
  userId: string;
  products: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  address: Address;
  booking: Booking;
  paymentType: string;
  amounts: {
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
  };
  status?: string;
  createdAt?: string;
}

export interface UserBooking {
  _id: string;
  orderId: string;
  booking: {
    serviceType: string;
    date: string;
    timeSlot: string;
  };
  products: {
    productId: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  status: string;
  createdAt: string;
}

export const api = {
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error("Failed to fetch products");
    return response.json();
  },

  async getProduct(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  },

  async getPackages(): Promise<Package[]> {
    const response = await fetch(`${API_BASE}/packages`);
    if (!response.ok) throw new Error("Failed to fetch packages");
    return response.json();
  },

  async getBanners(): Promise<Banner[]> {
    const response = await fetch(`${API_BASE}/banners`);
    if (!response.ok) throw new Error("Failed to fetch banners");
    return response.json();
  },

  async getRelatedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE}/products/related`);
    if (!response.ok) throw new Error("Failed to fetch related products");
    return response.json();
  },

  async getReferralStatus(userId: string, token: string) {
    const response = await fetch(`${API_BASE}/referral-status/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch referral status");
    return response.json();
  },

  // Courses API
  async getCourses(): Promise<Course[]> {
    const response = await fetch(`${API_BASE}/courses`);
    if (!response.ok) throw new Error("Failed to fetch courses");
    return response.json();
  },

  async getCourse(id: string): Promise<Course> {
    const response = await fetch(`${API_BASE}/courses/${id}`);
    if (!response.ok) throw new Error("Failed to fetch course");
    return response.json();
  },

  // Enrollment API
  async checkEnrollment(courseId: string, userId: string): Promise<{ isEnrolled: boolean }> {
    const response = await fetch(`${API_BASE}/enrollments/check/${courseId}/${userId}`);
    if (!response.ok) throw new Error("Failed to check enrollment");
    return response.json();
  },

  async createEnrollment(enrollment: Enrollment): Promise<{ success: boolean; data: Enrollment }> {
    const response = await fetch(`${API_BASE}/enrollments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enrollment),
    });
    if (!response.ok) throw new Error("Failed to create enrollment");
    return response.json();
  },

  async enrollInCourse(courseId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/courses/${courseId}/enroll`, {
      method: "POST",
    });
    if (!response.ok) throw new Error("Failed to enroll in course");
    return response.json();
  },

  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const response = await fetch(`${API_BASE}/enrollments/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch enrollments");
    return response.json();
  },

  // Orders API
  async createOrder(order: OrderPayload): Promise<{ success: boolean; orderId: string }> {
    const response = await fetch(`${API_BASE}/orders/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (!response.ok) throw new Error("Failed to create order");
    return response.json();
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE}/orders/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch orders");
    return response.json();
  },

  // Bookings API
  async getUserBookings(userId: string): Promise<UserBooking[]> {
    const response = await fetch(`${API_BASE}/bookings/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch bookings");
    return response.json();
  },

  async cancelBooking(bookingId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
      method: "PATCH",
    });
    if (!response.ok) throw new Error("Failed to cancel booking");
    return response.json();
  },
};
