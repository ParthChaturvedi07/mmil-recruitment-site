import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

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

      {/* LOGO — top center, fixed height */}
      <div className="z-50 flex justify-center items-center pt-5 pb-2 w-full shrink-0">
        <img
          src="/mmil-logo1.png"
          alt="MMIL Logo"
          className="w-28 sm:w-36 md:w-40 h-auto object-contain"
        />
      </div>

      {/* REGISTER CARD — takes remaining space, centered */}
      <div className="z-20 w-full max-w-[480px] px-4 flex-1 flex items-center justify-center">
        <div className="w-full bg-[#FFE0D4] backdrop-blur-md rounded-[40px] px-6 py-5 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">

          <h2 className="text-[#1A1A1A] font-black text-2xl sm:text-3xl mb-1 text-center">Register</h2>
          <p className="text-gray-600 text-[10px] sm:text-xs text-center mb-4 uppercase font-bold tracking-widest">
            Create an account to join us
          </p>

          <div className="mt-8 mb-8 text-center">
            <p className="text-lg font-bold text-[#72341E]">Registrations are currently closed.</p>
          </div>

          <p className="text-sm text-slate-600 mt-4 text-center">
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