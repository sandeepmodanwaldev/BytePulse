import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore.js";

function VerifyemailPage() {
  const { verifyEmail, isVerifying } = useAuthStore();
  const navigate = useNavigate();
  const { emailVerificationToken } = useParams();

  useEffect(() => {
    async function verify() {
      try {
        await verifyEmail(emailVerificationToken, navigate);
      } catch (error) {
        console.error("Verification failed", error);
      }
    }

    if (emailVerificationToken) {
      verify();
    }
  }, [emailVerificationToken, verifyEmail, navigate]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="bg-[#0f0f1a] w-96 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-white mb-2">
          {isVerifying ? "Verifying..." : "Verification complete"}
        </h2>
        {!isVerifying && (
          <p className="text-center text-white">Redirecting to login...</p>
        )}
      </div>
    </div>
  );
}

export default VerifyemailPage;
