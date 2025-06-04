import { Code2 } from "lucide-react";

const About = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex items-cente gap-3 mb-6">
        <Code2 className="w-8 h-8 text-blue-600" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          About BytePulse
        </h1>
      </div>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        BytePulse is a next-gen coding platform for aspiring developers,
        problem-solvers, and tech enthusiasts. We provide a curated library of
        coding challenges, real-time feedback, and insightful discussions to
        help you grow.
      </p>
      <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
        Whether you're preparing for interviews or sharpening your algorithms,
        BytePulse is your coding companion. Join our developer-driven community
        and build your skills with purpose.
      </p>
    </div>
  );
};

export default About;
