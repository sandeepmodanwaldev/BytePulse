import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import TestimonialsSection from "./TestimonialsPage";
import FAQSection from "./FAQ";
import { BarChart3, Search, Target, UserCheck, UserCheck2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
function HomePage() {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const features = [
    { icon: <Search size={32} />, title: "Real-world coding problems" },
    { icon: <UserCheck2 size={32} />, title: "User profiles & leaderboards" },
    { icon: <BarChart3 size={32} />, title: "Performance analytics" },
    { icon: <Target size={32} />, title: "Difficulty levels" },
  ];
  const steps = [
    { step: "1", title: "Sign up" },
    { step: "2", title: "Choose a problem" },
    { step: "3", title: "Code in-browser" },
    { step: "4", title: "Get results instantly" },
  ];
  return (
    <>
      <div className="flex items-center justify-center ">
        <div className="flex justify-evenly w-[90%] md:grid-cols-2 borde border-gray-40 rounded-3xl p-6 md:p-10 shadow-md bg-white dark:bg-gray-900 dark:text-white">
          {/* Text Content */}
          <div className="text-base md:text-lg font-medium space-y-10 pt-5 w-[50%]">
            <h1 className="text-2xl md:text-3xl font-bold text-orange-400 font-playpen">
              Crack Code. Conquer Challenges. Fuel Your Pulse with BytePower.
            </h1>
            <p className="font-lexend">
              Dive into BytePulse — your next-gen coding arena built for
              developers, learners, and job-seekers. Solve real interview
              problems, sharpen your logic, and level up your career, one byte
              at a time.
            </p>
            <div className="flex justify-center md:justify-start">
              <button
                className="btn btn-primary md:btn-lg md:btn-wide"
                onClick={() => {
                  authUser ? navigate("/dashboard") : navigate("/login");
                }}
              >
                Get Started{" "}
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="flex justify-cente  md:justify-aroun w-50% ">
            <img
              src="./girl.svg"
              alt="Hero Illustration"
              className="w-64 h-64 md:w-80 md:h-80 object-contain  "
            />
          </div>
        </div>
      </div>
      {/* Feature */}
      <section className="py-16 bg-gray-10 ">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 font-inter">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 ">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-lg  dark:bg-gray-900 dark:text-white"
              >
                <div className="text-4xl flex items-center justify-center mb-5">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold font-playpen">
                  {feature.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* workflow */}
      <section className="py-16 ">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 font-inter">
            How BytePulse Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map(({ step, title }) => (
              <div key={step} className="p-4  dark:text-white">
                <div className="text-4xl font-bold mb-2 text-indigo-600 font-lexend">
                  {step}
                </div>
                <p className="text-lg font-playpen">{title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* testimonials */}
      {/* TestimonialsSection */}
      <TestimonialsSection />
      {/* FAQSection */}
      <FAQSection />
    </>
  );
}

export default HomePage;
