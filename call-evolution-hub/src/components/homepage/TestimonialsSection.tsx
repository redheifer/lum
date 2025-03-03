
import React from "react";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  company: string;
  stars: number;
}

const TestimonialsSection: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "We've increased our call review coverage from 2% to 100% while cutting costs by 70%.",
      author: "Sarah Johnson",
      company: "Global Support Services",
      stars: 5
    },
    {
      quote: "The insights we're getting have helped us improve agent performance across the board.",
      author: "Michael Chen",
      company: "TechCare Solutions",
      stars: 5
    },
    {
      quote: "Implementation was seamless and we saw ROI within the first month.",
      author: "Jessica Rodriguez",
      company: "Premier Financial",
      stars: 4
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from organizations that have transformed their QA process with our platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-8 relative">
              <div className="flex mb-4">
                {Array(testimonial.stars).fill(0).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
