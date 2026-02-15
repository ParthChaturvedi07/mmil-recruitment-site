import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AuthButton from "../components/AuthButton";
import { API_ENDPOINTS } from "../config/api.js";

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
      const res = await axios.post(API_ENDPOINTS.REGISTER, {
        name,
        email,
        password,
      });

      const { token, needsProfile, userId } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

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
  
  /* Main Container  */
  <div className="relative min-h-screen w-full bg-[#FDF5E6] flex items-center justify-center font-montserrat overflow-hidden">
    
    {/*  BACKGROUND TEXT  */}
<div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        <div className="flex flex-col items-center space-y-[-30px] opacity-20">
          {["Inspire", "Invent", "Innovate"].map((word, i) => (
            <h1
              key={i}
              className="text-[181px] font-black text-transparent uppercase"
              style={{
                WebkitTextStroke: "1px #72341E",
              }}
            >
              {word}
            </h1>
          ))}
        </div>
      </div>


   {/* Logo Placeholder */}
<div className="w-full absolute top-0 left-0 flex justify-end items-center p-8 z-50">
  
  {/*  Logo */}
  <div className="absolute left-1/2 -translate-x-1/2 top-8">
    <img
      src="/mmil-logo1.png"
      alt="MMIL Logo"
      className="w-40 h-auto object-contain"
    />
  </div>
</div>

{/*  DECORATIVE ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute flex flex-col items-center" style={{ top: "143px", right: "calc(50% - 620px)" }}>
          <img src="/light-bulb 1.png" alt="Bulb" className="w-[110px] h-auto object-contain z-20" />
          <div className="absolute top-[110px] right-[8%] z-0">
            <img src="/Vector 1.png" alt="Line Decoration" style={{ width: "375px", height: "210px" }} />
          </div>
        </div>
      </div>

{/* 5. STAR DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none">
        <img src="/Vector 2.png" alt="Star" className="absolute w-[80px] h-auto" style={{ top: "40px", left: "calc(50% - 410px)", filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }} />
        <img src="/Vector 2.png" alt="Star" className="absolute w-[80px] h-auto" style={{ top: "685px", left: "calc(50% - 500px)", filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }} />
      </div>



    {/*  THE REGISTER CARD  */}
    <div className="z-20 w-full max-w-[480px] px-4">
      <div className="bg-[#FFE0D4] backdrop-blur-md rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        
        <h2 className="text-[#1A1A1A] font-black text-3xl mb-2 text-center">Register</h2>
        <p className="text-gray-600 text-xs text-center mb-6 uppercase font-bold tracking-widest">
          Create an account to join us
        </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-2">
            <div>
              <label className="block text-sm text-slate-700">Name</label>
              <input
                className="mt-1 w-full bg-white border rounded-lg px-3 py-2"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Email</label>
              <input
                className="mt-1 w-full bg-white  border rounded-lg px-3 py-2"
                type="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-700">Password</label>
              <input
                className="mt-1 w-full bg-white border rounded-lg px-3 py-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-slate-600 mt-1">Minimum 6 characters.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#72341E] text-white rounded-lg py-2 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px bg-[#777373] flex-1" />
            <span className="text-xs font-bold text-[#B18779]">OR</span>
            <div className="h-px bg-[#777373] flex-1" />
          </div>

          <div className="flex justify-center">
            <AuthButton />
          </div>

          <p className="text-sm text-slate-600 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#72341E] font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
