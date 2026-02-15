import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="w-full px-8 py-4 bg-white shadow flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-800">
        MMIL Recruitment
      </h1>

      <div className="flex items-center gap-4">
        {token ? (
          <button
            type="button"
            className="text-sm text-blue-700 font-medium"
            onClick={handleLogout}
          >
            Logout
          </button>
        ) : (
          <>
            <button
              type="button"
              className="text-sm text-blue-700 font-medium"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              type="button"
              className="text-sm text-blue-700 font-medium"
              onClick={() => navigate("/register")}
            >
              Signup
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
