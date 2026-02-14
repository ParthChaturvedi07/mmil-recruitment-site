import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AuthButton from "../components/AuthButton";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      const { token, needsProfile, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      toast.success("Registered successfully");

      if (needsProfile) {
        navigate("/complete-profile");
      } else {
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
          <h2 className="text-xl font-semibold text-slate-900">Register</h2>
          <p className="text-sm text-slate-600 mt-1">
            Create an account using email/password or Google.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm text-slate-700">Name</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Email</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Password</label>
              <input
                className="mt-1 w-full border rounded-lg px-3 py-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-slate-500 mt-1">Minimum 6 characters.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 text-white rounded-lg py-2 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px bg-slate-200 flex-1" />
            <span className="text-xs text-slate-500">OR</span>
            <div className="h-px bg-slate-200 flex-1" />
          </div>

          <div className="flex justify-center">
            <AuthButton />
          </div>

          <p className="text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-700 font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
