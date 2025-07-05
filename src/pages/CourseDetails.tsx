
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { coursesApi } from "@/services/courseApi";
import { CourseDetails } from "@/data/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  BookCheck,
  BookOpen,
  Calendar,
  Clock,
  Play,
  Star,
  Users,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const CourseDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!slug) {
        console.warn("No slug found in URL.");
        setLoading(false);
        return;
      }

      console.log("Fetching course details for slug:", slug);
      setLoading(true);

      try {
        // Fetch course details
        const courseData = await coursesApi.getCourseBySlug(slug);
        setCourse(courseData);
        
        // Check if user is enrolled in this course
        if (user) {
          const enrolledCourses = await coursesApi.getEnrolledCourses();
          const enrolled = enrolledCourses.some(c => c.slug === slug);
          setIsEnrolled(enrolled);
          
          if (enrolled) {
            // Fetch progress data
            const userProgress = await coursesApi.getCourseProgress(courseData.id);
            setProgress(userProgress?.progress || 0);
          }
        }
      } catch (error) {
        console.error("Failed to fetch course details:", error);
        toast({
          title: "Error",
          description: "Failed to load course details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [slug, toast, user]);

  const handleStartLearning = () => {
    if (course) {
      navigate(`/course-content/${course.slug}`);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          Loading course details...
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          Course not found
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground mt-1">{course.description}</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge variant="secondary">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(course.createdAt).toLocaleDateString()}
            </Badge>
            {isEnrolled && (
              <Badge variant="outline" className="ml-2">
                <BookCheck className="mr-2 h-4 w-4" />
                Enrolled
              </Badge>
            )}
          </div>
        </div>

        {isEnrolled && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm text-muted-foreground">{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
            <AvatarFallback>{course.instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">{course.instructor.name}</h4>
            <p className="text-sm text-muted-foreground">Instructor</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>About this course</CardTitle>
                  <CardDescription>Learn the basics of {course.title} and more.</CardDescription>
                </CardHeader>
                <CardContent className="prose">
                  {course.description}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="curriculum">
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                  <CardDescription>Explore the course structure and lessons.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Accordion type="single" collapsible>
                    {course.sections.map((section, index) => (
                      <AccordionItem value={`section-${index}`} key={index}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex justify-between w-full items-center">
                            {section.title}
                            <Badge variant="secondary">{section.lessons.length} Lessons</Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="p-0">
                          <ul className="divide-y divide-border">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <li key={lessonIndex} className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Play className="h-4 w-4 text-muted-foreground" />
                                    {lesson.title}
                                  </div>
                                  <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Student Reviews</CardTitle>
                  <CardDescription>See what other students are saying about this course.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No reviews yet.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardContent className="p-6">
              {/* Course pricing info */}
              {!isEnrolled && (
                <>
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        ${course.discountPrice || course.price}
                      </span>
                      {course.discountPrice && (
                        <span className="text-xl text-muted-foreground line-through">
                          ${course.price}
                        </span>
                      )}
                    </div>
                    {course.discountPrice && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {Math.round((1 - course.discountPrice / course.price) * 100)}% off
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Course stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.totalLessons || "24"} lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{course.studentsCount || "1,543"} students</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">{course.rating} ({course.reviewsCount || "245"} reviews)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-3">
                {isEnrolled ? (
                  <Button className="w-full" size="lg" onClick={handleStartLearning}>
                    Continue Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <>
                    <Button className="w-full" size="lg" asChild>
                      <Link to={`/enroll/${course.slug}`}>
                        Enroll Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Try Free Preview
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
