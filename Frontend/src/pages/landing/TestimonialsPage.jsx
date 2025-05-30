import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const testimonials = [
  {
    quote: "BytePulse made me confident in coding interviews!",
    author: "Ayesha K., SDE Intern",
  },
  {
    quote: "Thanks to BytePulse, I landed my dream job at a startup.",
    author: "Rahul S., Software Engineer",
  },
  {
    quote: "The problem sets are top-notch and interview-relevant.",
    author: "Mehak T., Backend Developer",
  },
  {
    quote: "Great platform to track my progress and grow consistently.",
    author: "Kunal P., Final Year Student",
  },
  {
    quote: "Mock interviews helped me reduce anxiety before my real one.",
    author: "Fatima Z., Frontend Intern",
  },
  {
    quote: "BytePulse is the LeetCode alternative I never knew I needed.",
    author: "Rohan M., Full Stack Developer",
  },
];

export default function TestimonialsSection() {
  const [page, setPage] = useState(0);
  const testimonialsPerPage = 3;

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));
  const handleNext = () => {
    const maxPage = Math.ceil(testimonials.length / testimonialsPerPage) - 1;
    setPage((prev) => Math.min(prev + 1, maxPage));
  };

  const currentTestimonials = testimonials.slice(
    page * testimonialsPerPage,
    (page + 1) * testimonialsPerPage
  );

  return (
    <section className="py-16 ">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 font-inter">
          What our users say
        </h2>

        <div className="relative flex items-center justify-center">
          {/* Left Arrow Button (outside) */}
          <div className="absolute left-[-60px] top-1/2 transform -translate-y-1/2">
            <button
              onClick={handlePrev}
              className="p-3 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:text-white"
              disabled={page === 0}
            >
              <ArrowLeft />
            </button>
          </div>

          {/* Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 w-full ">
            {currentTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg dark:bg-gray-900 dark:text-white"
              >
                <p className="text-gray-700 dark:text-gray-200 font-lexend">
                  “{testimonial.quote}”
                </p>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-playpen">
                  — {testimonial.author}
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button (outside) */}
          <div className="absolute right-[-60px] top-1/2 transform -translate-y-1/2">
            <button
              onClick={handleNext}
              className="p-3 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-50 dark:bg-gray-900 dark:text-white"
              disabled={(page + 1) * testimonialsPerPage >= testimonials.length}
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
