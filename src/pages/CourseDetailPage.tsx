import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api, Course } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Share2, 
  Clock, 
  BarChart3, 
  User, 
  Users, 
  Award, 
  Star, 
  CheckCircle2, 
  BookOpen,
  Loader2
} from "lucide-react";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const { data: course, isLoading, error } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => api.getCourse(courseId!),
    enabled: !!courseId,
  });

  // Check enrollment status
  useQuery({
    queryKey: ["enrollment", courseId, user?.id],
    queryFn: async () => {
      const data = await api.checkEnrollment(courseId!, user!.id);
      setIsEnrolled(data.isEnrolled);
      return data;
    },
    enabled: !!courseId && !!user?.id,
  });

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to enroll in this course",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!course) return;

    setIsEnrolling(true);

    try {
      const enrollmentData = {
        userId: user!.id,
        courseId: course._id,
        userName: user?.name || `${user?.firstName} ${user?.lastName}`,
        userEmail: user!.email,
        courseName: course.name,
        coursePrice: course.price,
        courseCategory: course.category,
        courseDuration: course.duration,
        courseImage: course.image,
        enrollmentDate: new Date().toISOString(),
        paymentStatus: "pending",
        progress: 0,
        status: "active",
      };

      await api.createEnrollment(enrollmentData);
      await api.enrollInCourse(course._id);

      // Save to localStorage
      const enrolledCourses = JSON.parse(localStorage.getItem("enrolledCourses") || "[]");
      enrolledCourses.push(enrollmentData);
      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));

      setIsEnrolled(true);

      toast({
        title: "Success!",
        description: "You have successfully enrolled in the course!",
      });
    } catch (error: any) {
      toast({
        title: "Enrollment Failed",
        description: error.message || "Failed to enroll. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleShare = async () => {
    if (!course) return;
    
    try {
      await navigator.share({
        title: course.name,
        text: `Check out this course: ${course.name}\n\n${course.description}\n\nPrice: ${course.price}\nDuration: ${course.duration}`,
        url: window.location.href,
      });
    } catch {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Course link copied to clipboard!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
          <div className="container mx-auto px-4 py-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </Link>
          </div>
        </header>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="w-full h-64 rounded-xl mb-6" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="grid gap-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-muted-foreground mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  // Default curriculum if not provided
  const defaultCurriculum = [
    { week: 1, description: "Introduction to fundamentals and basic techniques" },
    { week: 2, description: "Advanced techniques and practical applications" },
    { week: 3, description: "Hands-on projects and case studies" },
    { week: 4, description: "Troubleshooting and best practices" },
    { week: 5, description: "Final project and certification" },
  ];

  const curriculum = course.curriculum?.length ? course.curriculum : defaultCurriculum;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={handleShare}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Course Image */}
      <div className="relative">
        <img 
          src={course.image} 
          alt={course.name}
          className="w-full h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-10">
        {/* Course Header */}
        <Card className="border-border/50 shadow-elegant mb-6">
          <CardContent className="pt-6">
            <Badge className="mb-3">{course.category}</Badge>
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              {course.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="font-medium text-foreground">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students || 0} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="mb-24">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-6">{course.description}</p>

                <h3 className="font-semibold text-lg mb-4">Course Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Level: {course.level || "Beginner"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary" />
                    <span>Instructor: {course.instructor?.name || "Expert Trainer"}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span>{course.students || 0} students enrolled</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Award className="h-5 w-5 text-primary" />
                    <span>Certificate: {course.certificate ? "Included" : "Not included"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">What You'll Learn</h3>
                  <div className="space-y-3">
                    {course.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {course.prerequisites && course.prerequisites.length > 0 && (
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Prerequisites</h3>
                  <div className="space-y-3">
                    {course.prerequisites.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="curriculum">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-lg mb-4">Course Curriculum</h3>
                <div className="space-y-4">
                  {curriculum.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-4 bg-muted/50 rounded-lg border border-border/50"
                    >
                      <h4 className="font-medium text-primary mb-1">
                        Week {item.week}
                      </h4>
                      <p className="text-muted-foreground">{item.description}</p>
                      {"topics" in item && (item as any).topics?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {(item as any).topics.map((topic: string, topicIndex: number) => (
                            <li key={topicIndex} className="text-sm text-muted-foreground">
                              • {topic}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-4xl font-bold">{course.rating}</div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                      <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {course.students || 0} students
                    </p>
                  </div>
                </div>

                {/* Rating bars */}
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3 mb-2">
                    <span className="text-sm w-8">{stars} ⭐</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(stars / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-12 text-right">
                      {Math.round((stars / 5) * 100)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{course.price}</span>
              {course.oldPrice && (
                <span className="text-muted-foreground line-through">{course.oldPrice}</span>
              )}
            </div>
          </div>
          
          {isEnrolled ? (
            <Button 
              className="flex-1 max-w-xs gap-2"
              onClick={() => navigate("/my-courses")}
            >
              <CheckCircle2 className="h-5 w-5" />
              Enrolled - View Course
            </Button>
          ) : (
            <Button 
              className="flex-1 max-w-xs"
              onClick={handleEnroll}
              disabled={isEnrolling}
            >
              {isEnrolling ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Enrolling...
                </>
              ) : (
                "Enroll Now"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
