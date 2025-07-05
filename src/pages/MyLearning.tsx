
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { coursesApi } from "@/services/courseApi";
import { Course, UserProgress } from "@/data/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  ChevronRight,
  Clock,
  PlayCircle,
  ClipboardCheck,
  BookCheck,
  Calendar,
  Award,
  PieChart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EnrolledCourse extends Course {
  progress: number;
  lastAccessed?: string;
}

const MyLearningPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [progressData, setProgressData] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getEnrolledCourses();
        
        // Fetch progress data for each enrolled course
        const progressPromises = data.map(course => 
          coursesApi.getCourseProgress(course.id)
        );
        
        const progressResults = await Promise.all(progressPromises);
        setProgressData(progressResults.filter(p => p !== null));
        
        // Combine course and progress data
        const coursesWithProgress = data.map(course => {
          const courseProgress = progressResults.find(p => p?.courseId === course.id);
          return {
            ...course,
            progress: courseProgress?.progress || 0,
            lastAccessed: courseProgress?.lastAccessed
          };
        });
        
        setCourses(coursesWithProgress);
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error);
        toast({
          title: "Error",
          description: "Failed to load your courses. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [toast]);

  const getAverageProgress = () => {
    if (courses.length === 0) return 0;
    const totalProgress = courses.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(totalProgress / courses.length);
  };

  const getCompletedCourses = () => {
    return courses.filter(course => course.progress === 100).length;
  };

  const continueCourse = (course: EnrolledCourse) => {
    navigate(`/course-content/${course.slug}`);
  };

  if (loading) {
    return <div className="container py-8">Loading enrolled courses...</div>;
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Learning</h1>
          <p className="text-muted-foreground">Track your progress and continue learning</p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button variant="outline" asChild>
            <Link to="/assessment/1">
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Take Assessment
            </Link>
          </Button>
          <Button asChild>
            <Link to="/courses">Find New Courses</Link>
          </Button>
        </div>
      </div>

      {courses.length > 0 ? (
        <>
          {/* Learning stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Enrolled Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{courses.length}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <PieChart className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{getAverageProgress()}%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Completed Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-primary mr-2" />
                  <span className="text-2xl font-bold">{getCompletedCourses()}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Last Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-primary mr-2" />
                  <span className="text-sm font-medium">
                    {courses.some(course => course.lastAccessed) 
                      ? new Date(Math.max(...courses
                          .filter(course => course.lastAccessed)
                          .map(course => new Date(course.lastAccessed!).getTime())))
                          .toLocaleDateString()
                      : 'No recent activity'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="inProgress" className="space-y-4">
            <TabsList>
              <TabsTrigger value="inProgress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="inProgress" className="space-y-4">
              {courses
                .filter(course => course.progress < 100)
                .map((course) => (
                  <Card key={course.id} className="overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="relative h-48 md:h-auto">
                        <img 
                          src={course.thumbnail} 
                          alt={course.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      </div>
                      <div className="col-span-2 p-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-semibold">{course.title}</h3>
                            <p className="text-muted-foreground text-sm mt-1">{course.instructor.name}</p>
                          </div>
                          <Badge>{course.level}</Badge>
                        </div>
                        
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{course.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{course.totalLessons || "12"} Lessons</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Your Progress</span>
                            <span className="text-sm text-muted-foreground">{course.progress}% Complete</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            {course.lastAccessed 
                              ? `Last accessed ${new Date(course.lastAccessed).toLocaleDateString()}`
                              : 'Not started yet'}
                          </div>
                          <Button onClick={() => continueCourse(course)}>
                            Continue Learning
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              
              {courses.filter(course => course.progress < 100).length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <BookCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You have no in-progress courses.</p>
                    <Button className="mt-4" asChild>
                      <Link to="/courses">Browse Courses</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {courses
                .filter(course => course.progress === 100)
                .map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{course.title}</CardTitle>
                        <Badge variant="outline">Completed</Badge>
                      </div>
                      <CardDescription>{course.instructor.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{course.totalLessons || "12"} Lessons</span>
                      </div>
                      <div className="col-span-2 flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Completed on {new Date(course.lastAccessed || Date.now()).toLocaleDateString()}
                        </p>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            View Certificate
                            <Award className="ml-1 h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => continueCourse(course)}>
                            Review Course
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              
              {courses.filter(course => course.progress === 100).length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">You haven't completed any courses yet.</p>
                    <p className="text-muted-foreground">Keep learning to earn your first certificate!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">You are not enrolled in any courses yet.</p>
            <Button asChild>
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MyLearningPage;
