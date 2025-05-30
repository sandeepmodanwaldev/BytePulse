import { useState } from "react";

const faqs = [
  {
    question: "Is BytePulse free to use?",
    answer:
      "Yes! BytePulse offers a free tier with access to many coding problems. We also offer a premium plan with additional features.",
  },
  {
    question: "Can I use BytePulse without signing in?",
    answer:
      "You can browse some public content, but to solve problems and track progress, you need to create an account.",
  },
  {
    question: "What kind of problems are available?",
    answer:
      "We offer real-world problems across various difficulty levels, including algorithms, data structures, and system design.",
  },
  {
    question: "Can I practice coding in the browser?",
    answer:
      "Absolutely! BytePulse includes an in-browser code editor with instant result feedback.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className=" py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10 font-inter">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all dark:bg-gray-900 dark:text-white"
              onClick={() => toggleFAQ(index)}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold font-lexend">
                  {faq.question}
                </h3>
                <span className="text-xl">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="mt-2 text-gray-600 font-playpen">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
