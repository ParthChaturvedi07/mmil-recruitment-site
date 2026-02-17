import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import { API_ENDPOINTS } from "../config/api.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const { token, needsProfile, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      if (needsProfile) {
        navigate("/complete-profile");
      } else {
        toast.success("Logged in successfully");
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* Main Container */
    <div className="relative h-screen w-full bg-[#FDF5E6] flex flex-col items-center justify-start font-montserrat overflow-x-hidden overflow-y-auto">

      {/* BACKGROUND TEXT — always visible on all screens including mobile */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-visible mt-10 sm:mt-0">
        <div className="flex flex-col scale-150 sm:scale-0 gap-[80px] sm:gap-0 items-center opacity-20" style={{ width: "100vw" }}>
          {["Inspire", "Invent", "Innovate"].map((word, i) => (
            <h1
              key={i}
              className="font-black text-transparent uppercase leading-none text-center w-full"
              style={{
                WebkitTextStroke: "1px #72341E",
                fontSize: "clamp(3.2rem, 22vw, 11.3rem)",
                marginTop: i === 0 ? 0 : "-0.06em",
                // marginBottom: work === "Invent" ? "60px" : "0",
              }}
            >
              {word}
            </h1>
          ))}
        </div>
      </div>


      {/* DECORATIVE ELEMENTS — hidden on small screens */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <div className="absolute flex flex-col items-center" style={{ top: "143px", right: "calc(50% - 620px)" }}>
          <img src="/light-bulb 1.png" alt="Bulb" className="w-[110px] h-auto object-contain z-20" />
          <div className="absolute top-[110px] right-[8%] z-0">
            <img src="/Vector 1.png" alt="Line Decoration" style={{ width: "375px", height: "210px" }} />
          </div>
        </div>
      </div>

      {/* STAR DECORATIONS — hidden on small screens */}
      <div className="absolute inset-0 pointer-events-none hidden md:block">
        <img src="/Vector 2.png" alt="Star" className="absolute w-[80px] h-auto" style={{ top: "40px", left: "calc(50% - 410px)", filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }} />
        <img src="/Vector 2.png" alt="Star" className="absolute w-[80px] h-auto" style={{ top: "685px", left: "calc(50% - 500px)", filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }} />
      </div>

      {/* LOGO — top center */}
      <div className="z-50 flex justify-center items-center pt-5 pb-2 w-full shrink-0">
        <img
          src="/mmil-logo1.png"
          alt="MMIL Logo"
          className="w-28 sm:w-36 md:w-40 h-auto object-contain"
        />
      </div>

      {/* LOGIN CARD — fills remaining height, vertically centered */}
      <div className="z-20 w-full max-w-[480px] px-4 flex-1 flex items-center justify-center">
        <div className="w-full bg-[#FDE2D8] rounded-[30px] px-7 py-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex flex-col items-center border border-white/20">

          <h2 className="text-[#1A1A1A] font-black text-2xl mb-5 sm:mb-8">Welcome Back !</h2>

          <form onSubmit={onSubmit} className="w-full flex flex-col items-center">
            {/* Stacked input group */}
            <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm mb-4 sm:mb-6">
              <input
                className="w-full h-[50px] sm:h-[55px] px-6 text-sm outline-none border-b border-gray-200 placeholder:text-gray-400"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="w-full h-[50px] sm:h-[55px] px-6 text-sm outline-none placeholder:text-gray-400"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] sm:h-[55px] bg-[#72341E] text-white rounded-xl font-bold text-base sm:text-lg shadow   -lg active:scale-95 transition-all mb-4 sm:mb-6"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="w-full flex items-center gap-3 mb-4 sm:mb-6">
            <div className="h-[1px] bg-[#777373] flex-1" />
            <span className="text-[10px] font-bold text-[#B18779]">OR</span>
            <div className="h-[1px] bg-[#777373] flex-1" />
          </div>

          <div className="flex justify-center">
            <AuthButton />
          </div>

          <p className="text-sm text-slate-600 mt-4 sm:mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-700 font-medium">
              Register
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}

export default Login;