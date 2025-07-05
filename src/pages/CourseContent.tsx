
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { coursesApi } from "@/services/courseApi";
import { CourseDetails, Lesson, Section, ContentResource } from "@/data/types";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  BookOpen,
  FileText,
  Video,
  CheckCircle,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  ClipboardList,
} from "lucide-react";

const CourseContent = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseDetails | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseContent = async () => {
      if (!slug) {
        toast({
          title: "Error",
          description: "Invalid course URL.",
          variant: "destructive",
        });
        navigate("/my-learning");
        return;
      }

      try {
        setLoading(true);
        // Fetch course details with all content
        const courseData = await coursesApi.getCourseBySlug(slug);
        setCourse(courseData);

        // Get user progress for this course
        if (user) {
          const userProgress = await coursesApi.getCourseProgress(courseData.id);
          setProgress(userProgress?.progress || 0);
          setCompletedLessons(userProgress?.completedLessons || []);
          
          // Set initial active lesson (first incomplete lesson or first lesson)
          if (courseData.sections && courseData.sections.length > 0) {
            const firstSection = courseData.sections[0];
            setActiveSection(firstSection);
            
            // Find first incomplete lesson or use first lesson
            let lessonToShow = firstSection.lessons[0];
            for (const section of courseData.sections) {
              for (const lesson of section.lessons) {
                if (!userProgress?.completedLessons?.includes(lesson.id)) {
                  lessonToShow = lesson;
                  setActiveSection(section);
                  break;
                }
              }
            }
            
            setActiveLesson(lessonToShow);
          }
        }
      } catch (error) {
        console.error("Failed to fetch course content:", error);
        toast({
          title: "Error",
          description: "Failed to load course content. Please try again.",
          variant: "destructive",
        });
        navigate("/my-learning");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [slug, user, toast, navigate]);

  const markLessonComplete = async (lessonId: string) => {
    if (!course) return;
    
    try {
      // If already completed, don't do anything
      if (completedLessons.includes(lessonId)) return;
      
      // Optimistically update UI
      const newCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(newCompletedLessons);
      
      // Calculate new progress percentage
      const totalLessons = course.sections.reduce((acc, section) => 
        acc + section.lessons.length, 0);
      const newProgress = Math.round((newCompletedLessons.length / totalLessons) * 100);
      setProgress(newProgress);
      
      // Save to API
      await coursesApi.markLessonComplete(course.id, lessonId);
      
      toast({
        title: "Progress Saved",
        description: "Lesson marked as completed.",
      });
    } catch (error) {
      console.error("Failed to mark lesson as complete:", error);
      toast({
        title: "Error",
        description: "Failed to update progress. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLessonChange = (section: Section, lesson: Lesson) => {
    setActiveSection(section);
    setActiveLesson(lesson);
    window.scrollTo(0, 0);
  };

  const navigateToNextLesson = () => {
    if (!course || !activeLesson || !activeSection) return;
    
    // Find current indices
    const currentSectionIndex = course.sections.findIndex(s => s.id === activeSection.id);
    const currentLessonIndex = activeSection.lessons.findIndex(l => l.id === activeLesson.id);
    
    // Try to find next lesson in current section
    if (currentLessonIndex < activeSection.lessons.length - 1) {
      const nextLesson = activeSection.lessons[currentLessonIndex + 1];
      handleLessonChange(activeSection, nextLesson);
      return;
    }
    
    // Try to find first lesson in next section
    if (currentSectionIndex < course.sections.length - 1) {
      const nextSection = course.sections[currentSectionIndex + 1];
      const nextLesson = nextSection.lessons[0];
      handleLessonChange(nextSection, nextLesson);
      return;
    }
    
    // If we're at the last lesson of the last section
    toast({
      title: "Course Completed",
      description: "Congratulations! You've reached the end of this course.",
    });
  };

  const navigateToPreviousLesson = () => {
    if (!course || !activeLesson || !activeSection) return;
    
    // Find current indices
    const currentSectionIndex = course.sections.findIndex(s => s.id === activeSection.id);
    const currentLessonIndex = activeSection.lessons.findIndex(l => l.id === activeLesson.id);
    
    // Try to find previous lesson in current section
    if (currentLessonIndex > 0) {
      const prevLesson = activeSection.lessons[currentLessonIndex - 1];
      handleLessonChange(activeSection, prevLesson);
      return;
    }
    
    // Try to find last lesson in previous section
    if (currentSectionIndex > 0) {
      const prevSection = course.sections[currentSectionIndex - 1];
      const prevLesson = prevSection.lessons[prevSection.lessons.length - 1];
      handleLessonChange(prevSection, prevLesson);
      return;
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          Loading course content...
        </div>
      </div>
    );
  }

  if (!course || !activeLesson || !activeSection) {
    return (
      <div className="container py-8">
        <div className="flex justify-center items-center h-64">
          Course not found or no content available.
        </div>
      </div>
    );
  }

  const renderLessonContent = () => {
    switch (activeLesson.type) {
      case 'video':
        return (
          <div className="aspect-video bg-muted flex items-center justify-center rounded-md mb-4">
            {activeLesson.videoUrl ? (
              <iframe
                src={activeLesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-center p-8">
                <PlayCircle className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
                <p>Video not available</p>
              </div>
            )}
          </div>
        );
      case 'text':
        return (
          <div className="prose max-w-none mb-4">
            <div dangerouslySetInnerHTML={{ __html: activeLesson.content || 'No content available' }} />
          </div>
        );
      case 'quiz':
        return (
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>
                <ClipboardList className="h-5 w-5 inline-block mr-2" />
                Practice Quiz
              </CardTitle>
              <CardDescription>Test your knowledge of the material</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">This quiz contains {activeLesson.quiz?.questions?.length || 0} questions.</p>
              <Button>Start Quiz</Button>
            </CardContent>
          </Card>
        );
      default:
        return <p>No content available for this lesson type.</p>;
    }
  };

  const renderResourcesList = () => {
    const resources = activeLesson.resources || [];
    
    if (resources.length === 0) {
      return <p className="text-muted-foreground">No additional resources for this lesson.</p>;
    }
    
    return (
      <ul className="space-y-2">
        {resources.map((resource, index) => (
          <li key={index} className="flex items-center justify-between p-2 border rounded-md">
            <div className="flex items-center">
              {resource.type === 'pdf' && <FileText className="h-4 w-4 mr-2 text-red-500" />}
              {resource.type === 'video' && <Video className="h-4 w-4 mr-2 text-blue-500" />}
              {resource.type === 'link' && <BookOpen className="h-4 w-4 mr-2 text-green-500" />}
              <span>{resource.title}</span>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1" />
              Download
            </Button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container max-w-7xl py-6">
      {/* Course header */}
      <div className="mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate(`/courses/${course.slug}`)} className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to Course Overview
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">{course.title}</h1>
            <p className="text-muted-foreground">{activeSection.title} - {activeLesson.title}</p>
          </div>
          <div className="mt-2 md:mt-0 text-right">
            <p className="font-medium">Your progress</p>
            <div className="flex items-center justify-end gap-2">
              <Progress value={progress} className="w-24 h-2" />
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Main content area */}
          {renderLessonContent()}

          {/* Lesson navigation and completion */}
          <div className="flex items-center justify-between">
            <Button 
              variant="outline"
              onClick={navigateToPreviousLesson}
              disabled={
                course.sections.indexOf(activeSection) === 0 && 
                activeSection.lessons.indexOf(activeLesson) === 0
              }
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            
            <Button
              onClick={() => markLessonComplete(activeLesson.id)}
              disabled={completedLessons.includes(activeLesson.id)}
              variant={completedLessons.includes(activeLesson.id) ? "outline" : "default"}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              {completedLessons.includes(activeLesson.id) ? "Completed" : "Mark Complete"}
            </Button>
            
            <Button 
              onClick={navigateToNextLesson}
              disabled={
                course.sections.indexOf(activeSection) === course.sections.length - 1 && 
                activeSection.lessons.indexOf(activeLesson) === activeSection.lessons.length - 1
              }
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <Separator />
          
          {/* Additional content tabs */}
          <Tabs defaultValue="resources" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="notes">Your Notes</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>
            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Resources</CardTitle>
                  <CardDescription>Download additional materials for this lesson</CardDescription>
                </CardHeader>
                <CardContent>
                  {renderResourcesList()}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Your Notes</CardTitle>
                  <CardDescription>Keep track of important points</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea 
                    className="w-full min-h-[200px] p-4 border rounded-md" 
                    placeholder="Write your notes here..."
                  ></textarea>
                  <Button className="mt-4">Save Notes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="discussion">
              <Card>
                <CardHeader>
                  <CardTitle>Discussion</CardTitle>
                  <CardDescription>Connect with other students</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">No comments yet. Be the first to start a discussion!</p>
                  <div className="mt-4">
                    <textarea 
                      className="w-full min-h-[100px] p-4 border rounded-md" 
                      placeholder="Ask a question or share your thoughts..."
                    ></textarea>
                    <Button className="mt-4">Post Comment</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Course navigation sidebar */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Course Content</CardTitle>
              <CardDescription>
                {course.totalLessons} lessons • {course.duration}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto p-0">
              {course.sections.map((section, sectionIndex) => (
                <div key={section.id} className="border-b last:border-b-0">
                  <div className="p-4 bg-muted/50">
                    <h3 className="font-medium">{section.title}</h3>
                    <p className="text-xs text-muted-foreground">{section.lessons.length} lessons</p>
                  </div>
                  <ul>
                    {section.lessons.map((lesson, lessonIndex) => {
                      const isActive = activeLesson.id === lesson.id;
                      const isCompleted = completedLessons.includes(lesson.id);
                      
                      return (
                        <li 
                          key={lesson.id} 
                          className={`border-t first:border-t-0 transition-colors cursor-pointer
                            ${isActive ? 'bg-accent' : 'hover:bg-accent/50'}
                          `}
                          onClick={() => handleLessonChange(section, lesson)}
                        >
                          <div className="p-3 flex items-center gap-2">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <div className="h-4 w-4 rounded-full border border-muted-foreground flex items-center justify-center">
                                  {isActive && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <p className={`text-sm ${isActive ? 'font-medium' : ''}`}>{lesson.title}</p>
                              <div className="flex items-center gap-1 mt-1">
                                {lesson.type === 'video' && <Video className="h-3 w-3 text-muted-foreground" />}
                                {lesson.type === 'text' && <FileText className="h-3 w-3 text-muted-foreground" />}
                                {lesson.type === 'quiz' && <ClipboardList className="h-3 w-3 text-muted-foreground" />}
                                <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;
