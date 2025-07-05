import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Clock, CreditCard, GraduationCap, Wallet, Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Course } from "@/data/types";
import { coursesApi } from "@/services/courseApi";
import { useAuth } from "@/contexts/AuthContext";

// Define default course features for when they're not available
const defaultFeatures = [
  "Lifetime Access",
  "Downloadable Resources",
  "Mobile and TV Access",
  "Certificate of Completion",
  "Q&A Support"
];

const EnrollPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [loading, setLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  // Fetch the course data based on the slug
  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) {
        toast({
          title: "Error",
          description: "Course information not found.",
          variant: "destructive"
        });
        navigate("/courses");
        return;
      }

      try {
        setCourseLoading(true);
        const courseData = await coursesApi.getCourseBySlug(slug);
        setCourse(courseData);
      } catch (error) {
        console.error("Failed to fetch course:", error);
        toast({
          title: "Error",
          description: "Unable to load course information. Please try again.",
          variant: "destructive"
        });
        navigate("/courses");
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourse();
  }, [slug, toast, navigate]);

  const handleCouponApply = () => {
    if (couponCode.trim() === "DISCOUNT20") {
      setCouponApplied(true);
      toast({
        title: "Coupon Applied!",
        description: "You've received a 20% discount.",
      });
    } else {
      toast({
        title: "Invalid Coupon",
        description: "The coupon code you entered is invalid or expired.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails({ ...cardDetails, [name]: value });
  };

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!course) {
      toast({
        title: "Error",
        description: "Course information is missing. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Process enrollment through the API
      const response = await coursesApi.enrollInCourse(course.id);

      if (response && response.success) {
        toast({
          title: "Enrollment Successful!",
          description: `You have successfully enrolled in ${course.title}.`,
        });

        // Redirect to my-learning page to see the newly enrolled course
        navigate("/my-learning");
      } else {
        throw new Error("Enrollment failed");
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      toast({
        title: "Enrollment Failed",
        description: "There was a problem processing your enrollment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = course ? (couponApplied
    ? (course.discountPrice || course.price) * 0.8
    : (course.discountPrice || course.price)) : 0;

  if (courseLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading course information...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container py-8">
        <p className="text-center">Course not found. Please try another course.</p>
      </div>
    );
  }

  // Use course features if available, otherwise use default features
  const features = defaultFeatures;

  return (
    <div className="container py-8 animate-fadeIn">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Enroll in {course.title}</h1>
        <p className="text-muted-foreground mb-8">Complete your enrollment to get started with this course</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content - Payment Form */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" /> Payment Method
                </CardTitle>
                <CardDescription>Choose how you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEnroll}>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-4 mb-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="credit-card" id="credit-card" />
                      <Label htmlFor="credit-card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" /> Credit/Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" /> PayPal
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "credit-card" && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input
                          id="cardName"
                          name="cardName"
                          placeholder="John Doe"
                          value={cardDetails.cardName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={cardDetails.cardNumber}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            name="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            name="cvv"
                            placeholder="123"
                            value={cardDetails.cvv}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "paypal" && (
                    <div className="bg-muted p-6 rounded-md text-center">
                      <p className="text-muted-foreground mb-4">
                        You'll be redirected to PayPal to complete your purchase securely.
                      </p>
                      <img
                        src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg"
                        alt="PayPal"
                        className="h-12 mx-auto"
                      />
                    </div>
                  )}

                  <div className="mt-8">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Processing..." : `Pay $${finalPrice.toFixed(2)}`}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Have a coupon?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                  />
                  <Button
                    type="button"
                    onClick={handleCouponApply}
                    variant="outline"
                    disabled={couponApplied}
                  >
                    {couponApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" /> Coupon DISCOUNT20 applied: 20% off
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-2">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {course.duration}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <Badge variant="outline" className="capitalize">{course.level}</Badge>
                  </div>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Original Price:</span>
                    <span className="line-through text-muted-foreground">${course.price.toFixed(2)}</span>
                  </div>
                  {course.discountPrice && (
                    <div className="flex justify-between">
                      <span>Discounted Price:</span>
                      <span>${course.discountPrice.toFixed(2)}</span>
                    </div>
                  )}
                  {couponApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon Discount:</span>
                      <span>-${((course.discountPrice || course.price) * 0.2).toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${finalPrice.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col">
                <p className="text-xs text-muted-foreground mb-4">
                  By completing your purchase, you agree to our Terms of Service and Privacy Policy.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Course Details Accordion */}
        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What's included in this course?</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>About the instructor</AccordionTrigger>
              <AccordionContent>
                <div className="flex items-center gap-4">
                  <img
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    className="h-12 w-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-medium">{course.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">Instructor</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Refund Policy</AccordionTrigger>
              <AccordionContent>
                <p>
                  If you're unsatisfied with your purchase, we offer a 30-day money-back guarantee.
                  Please contact our support team within 30 days of purchase for a full refund.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default EnrollPage;
