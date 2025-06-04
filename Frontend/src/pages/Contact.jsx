import { Mail, User } from "lucide-react";

const Contact = () => {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact BytePulse</h1>
      <p className="text-gray-700 mb-6 text-center">
        Questions, feedback, or partnership inquiries? Reach out to us — we're
        here to help!
      </p>
      <form
        action="https://formspree.io/f/xrbkbkqb"
        method="POST"
        className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md"
      >
        <div className="flex items-center gap-2">
          <User className="text-gray-400" />
          <input
            type="text"
            name="name"
            required
            placeholder="Your Name"
            className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none px-2 py-2 text-gray-800 dark:text-white"
          />
        </div>
        <div className="flex items-center gap-2">
          <Mail className="text-gray-400" />
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="flex-1 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:outline-none px-2 py-2 text-gray-800 dark:text-white"
          />
        </div>
        <div>
          <textarea
            name="message"
            required
            rows="5"
            placeholder="Your message..."
            className="w-full bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-800 dark:text-white focus:outline-none"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
      ;
    </div>
  );
};

export default Contact;
