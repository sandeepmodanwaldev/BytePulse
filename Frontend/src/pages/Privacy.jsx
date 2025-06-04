const Privacy = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Privacy Policy</h1>
      <p className="text-gray-700 mb-4">
        At BytePulse, your privacy is a priority. This Privacy Policy outlines
        how we collect, use, and protect your data.
      </p>
      <ul className="list-disc list-inside text-gray-700 space-y-2">
        <li>
          We collect data solely to enhance your experience on the platform.
        </li>
        <li>
          Your data is stored securely and is never sold to third parties.
        </li>
        <li>
          We use cookies to keep you logged in and improve site performance.
        </li>
        <li>
          You can request account or data deletion by contacting us anytime.
        </li>
      </ul>
      <p className="text-gray-700 mt-4">
        By using BytePulse, you agree to this policy. If you have any questions,
        feel free to{" "}
        <a href="/contact" className="text-blue-600 underline">
          contact us
        </a>
        .
      </p>
    </div>
  );
};

export default Privacy;
