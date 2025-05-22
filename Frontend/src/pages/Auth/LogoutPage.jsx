import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

function LogoutPage() {
  const { logout, isloggingIn } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(navigate);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center bg-[#0f0f1a]">
      <button onClick={handleLogout} className="btn btn-secondary">
        {isloggingIn ? (
          <span className="loading loading-spinner text-white"></span>
        ) : (
          "Logout"
        )}
      </button>
    </div>
  );
}

export default LogoutPage;
