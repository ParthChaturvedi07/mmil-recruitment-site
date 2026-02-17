import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PublicRoute from "./components/PublicRoute";
import AdminPage from "./pages/AdminPage";
import AllApplications from "./pages/admin/AllApplications";
import DepartmentApplications from "./pages/admin/DepartmentApplications";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { API_ENDPOINTS } from "./config/api";

/* Splash Screen Component  */

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#FDF5E6]">
      <div className="relative w-[80vw] max-w-[429px] h-[429px] animate-fade-in">
        <img
          src="splash-img2.png"
          alt="Robot Background"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

/* Start Screen Component  */

const StartScreen = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-[#FDF5E6] flex flex-col items-center justify-center overflow-hidden font-['Montserrat']">
      {/* LIGHTBULB + VECTOR 1  */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute flex flex-col items-center"
          style={{
            top: "143px",
            right: "calc(50% - 620px)",
          }}
        >
          <img
            src="/light-bulb 1.png"
            alt="Bulb"
            className="w-[110px] h-auto object-contain z-20"
          />

          <div className="absolute top-[110px] right-[8%] z-0">
            <img
              src="/Vector 1.png"
              alt="Line Decoration"
              style={{
                width: "375px",
                height: "210px",
                opacity: "1.0",
              }}
            />
          </div>
        </div>
      </div>

      {/*  VECTOR 2 STARS  */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/Vector 2.png"
          alt="Star"
          className="absolute w-[80px] h-auto"
          style={{
            top: "40px",
            left: "calc(50% - 410px)",
            filter: "sepia(1) saturate(5) hue-rotate(-30deg)",
          }}
        />
        <img
          src="/Vector 2.png"
          alt="Star"
          className="absolute w-[80px] h-auto"
          style={{
            top: "675px",
            left: "calc(50% - 520px)",
            filter: "sepia(1) saturate(5) hue-rotate(-30deg)",
          }}
        />
      </div>

      {/* BACKGROUND TEXT  */}
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

      {/* TOP LOGO */}
      <div className="absolute top-[-10px] left-1/2 -translate-x-1/2">
        <img
          src="/mmil-logo1.png"
          alt="MMIL Logo"
          className="w-[150px] h-[150px] object-contain"
        />
      </div>

      {/*  MAIN CARD  */}
      <div className="z-10 bg-[#FFDED3] w-[85vw] max-w-[475px] h-[398px] rounded-[15px] shadow-sm text-center flex flex-col items-center justify-center border border-[#FFFFFF]/70">
        <h2 className="text-[48px] font-black text-gray-900 mb-1">MMIL</h2>

        <p className="text-[18px] font-bold tracking-[0.05em] mb-12 uppercase">
          Let's Start
        </p>

        {/* Start Button */}
        <button
          onClick={onStart}
          className="bg-[#6D3019] text-white px-12 py-3 rounded-[12px] text-[20px] font-bold hover:scale-105 transition-all active:scale-95 shadow-lg"
        >
          Start
        </button>
      </div>
    </div>
  );
};

/*  Main App Component  */

const App = () => {
  // Stages: splash → startScreen → website
  const [stage, setStage] = useState("splash");
  const navigate = useNavigate();

  useEffect(() => {
    // Splash shows for 2 sec
    const timer = setTimeout(() => {
      setStage("startScreen");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Start button click
  const handleStart = () => {
    setStage("website");
  };

  const location = useLocation();
  const [toastPosition, setToastPosition] = useState("bottom-right");

  useEffect(() => {
    const handleResize = () => {
      setToastPosition(window.innerWidth < 768 ? "top-center" : "bottom-right");
    };

    // Set initial position
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (stage === "website") {
      const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
          const res = await axios.get(API_ENDPOINTS.CHECK_STATUS, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data.needsProfile) {
            if (location.pathname !== "/complete-profile") {
              navigate("/complete-profile");
            }
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Optional: clear token if invalid?
          // localStorage.removeItem("token");
        }
      };

      checkAuth();
      // If we are already on website stage, we might just be landing there directly (e.g. refresh)
      // But actually, this app has a splash screen on every reload due to stage="splash" initial state.
      // Wait, if users refresh, they see splash again.
      // The current logic:
      // 1. Splash (2s) -> StartScreen
      // 2. Click Start -> Website

      // If user refreshes on /complete-profile, they see splash, then start screen, then website.
      // Once on website, we check auth.

      // But wait, the navigate("/") in the original code:
      // useEffect(() => {
      //   if (stage === "website") {
      //     navigate("/");
      //   }
      // }, [stage]);
      // This forces navigation to "/" whenever stage becomes "website".
      // This is the bug! It overrides the current URL or where we want to go.
    }
  }, [stage]); // checking authentication status whenever stage changes to website

  // Remove the forcing to "/" on stage change if we want to preserve URL or handle redirects manually.
  // The original code had:
  // useEffect(() => {
  //   if (stage === "website") {
  //     navigate("/");
  //   }
  // }, [stage]);

  // We should remove this entirely or modify it.
  // If I remove it, what happens?
  // If I reload on /complete-profile:
  // Splash -> Start -> Click Start -> setStage("website").
  // If no navigation happens, where does it render?
  // The Routes are rendered. React Router should handle the URL.
  // BUT, if I am on /complete-profile and I refresh.
  // The URL is /complete-profile.
  // Splash renders. Start renders.
  // I click Start. stage becomes "website".
  // Routes render. matching /complete-profile.
  // So it should work WITHOUT the explicit navigate("/").
  // The explicit navigate("/") was likely resetting to home.

  // So I will REPLACE that useEffect with my auth check logic, AND remove the navigate("/") call.

  return (
    <>
      {/* Splash Screen */}
      {stage === "splash" && <SplashScreen />}

      {/* Start Screen */}
      {stage === "startScreen" && <StartScreen onStart={handleStart} />}

      {/* Website Routes */}
      {stage === "website" && (
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="/complete-profile" element={<Chatbot />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/students" element={<AllApplications />} />
            <Route path="/admin/:domain" element={<DepartmentApplications />} />
          </Routes>

          <ToastContainer position={toastPosition} />
        </>
      )}
    </>
  );
};

export default App;
