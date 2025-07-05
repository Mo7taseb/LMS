import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { coursesApi } from "@/services/courseApi";
import { Course, Category } from "@/data/types";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define the form schema
const courseFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  price: z.coerce.number().positive("Price must be positive"),
  discountPrice: z.coerce.number().optional(),
  duration: z.string(),
  thumbnail: z.string().url("Please enter a valid URL"),
});

type CourseFormValues = z.infer<typeof courseFormSchema>;

export default function CourseForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      level: "beginner",
      price: 0,
      duration: "",
      thumbnail: "",
    },
  });

  // Fetch course data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchCourse = async () => {
        try {
          setLoading(true);
          // Pass the ID directly as a string, no need to convert to number
          const course = await coursesApi.getCourseById(id);

          form.reset({
            title: course.title,
            description: course.description,
            level: course.level,
            price: course.price,
            discountPrice: course.discountPrice,
            duration: course.duration,
            thumbnail: course.thumbnail,
          });
        } catch (error) {
          console.error("Failed to fetch course:", error);
          toast({
            title: "Error",
            description: "Failed to load course data. Please try again.",
            variant: "destructive",
          });
          navigate("/admin/courses");
        } finally {
          setLoading(false);
        }
      };

      fetchCourse();
    }
  }, [id, isEditing, navigate, toast, form]);

  const onSubmit = async (data: CourseFormValues) => {
    try {
      setLoading(true);

      if (isEditing && id) {
        // Call the API to update the course with string ID
        await coursesApi.updateCourse(id, data);
        toast({
          title: "Course Updated",
          description: "The course has been successfully updated.",
        });
      } else {
        // Call the API to create a new course
        await coursesApi.createCourse(data);
        toast({
          title: "Course Created",
          description: "The new course has been successfully created.",
        });
      }

      navigate("/admin/courses");
    } catch (error) {
      console.error("Failed to save course:", error);
      toast({
        title: "Error",
        description: "Failed to save course data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Course" : "Create New Course"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update the details of an existing course"
              : "Fill out the form to create a new course"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Programming" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discount Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="Optional"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.value
                              ? parseFloat(e.target.value)
                              : undefined;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty if no discount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 8 weeks" {...field} />
                      </FormControl>
                      <FormDescription>
                        Format: "X hours" or "X weeks"
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="thumbnail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thumbnail URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/image.jpg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the course..."
                        className="min-h-32"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/courses")}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : isEditing ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
