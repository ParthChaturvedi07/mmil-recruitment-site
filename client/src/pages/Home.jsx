import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await axios.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/");
      window.location.reload();
    }
  };

  const rounds = [
    {
      name: "Technical Round",
      status: "Round 1",
      color: "bg-white",
      desc: "Task round to check your skills."
    },
    {
      name: "Interview and HR Round",
      status: "Round 2",
      color: "bg-[#FFFAE7]",
      desc: "Personal interview and HR interview round to check your personality and coordination skills."
    },
    {
      name: "Result",
      status: "Final",
      color: "bg-[#FFF3DA]",
      desc: "Check Technical round results."
    },
  ];

  const handleToast = (round) => {
    if(round=="Result"){
      toast.info("Result Yet to be Announced");
    }
    else{
      console.log(round);
      toast.info("Round Yet to be Started");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FDF5E6] flex flex-col items-center font-montserrat overflow-x-hidden">

      {/* TOP NAV BAR */}
      <div className="w-full flex justify-between md:justify-end items-center p-4 md:p-8 relative z-50">
        <img
          src="/mmil-logo1.png"
          alt="MMIL Logo"
          className="w-32 md:w-40 h-auto absolute left-1/2 transform -translate-x-1/2 top-6 md:top-8"
        />


        <div className="ml-auto">
          {token ? (
            <button className="px-4 py-1 md:px-8 md:py-2 border-2 border-[#5D2E17] text-[#5D2E17] font-bold rounded-xl hover:bg-[#5D2E17] hover:text-white transition-all text-sm md:text-base"
              onClick={handleLogout}
            >
              Logout
            </button>
          ) : (
            <button className="px-4 py-1 md:px-8 md:py-2 border-2 border-[#5D2E17] text-[#5D2E17] font-bold rounded-xl hover:bg-[#5D2E17] hover:text-white transition-all text-sm md:text-base"
              onClick={() => navigate('/login')}>
              Log In
            </button>
          )}
        </div>
      </div>

      {/*  BACKGROUND TEXT  */}
      <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
        <div className="flex flex-col items-center space-y-[-15px] md:space-y-[-30px] opacity-10 md:opacity-20">
          {["Inspire", "Invent", "Innovate"].map((word, i) => (
            <h1
              key={i}
              className="text-[60px] sm:text-[100px] md:text-[150px] lg:text-[181px] font-black text-transparent uppercase leading-tight"
              style={{ WebkitTextStroke: "1px #72341E" }}
            >
              {word}
            </h1>
          ))}
        </div>
      </div>

      {/*  DECORATIVE ELEMENTS  */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none">
        <div className="absolute flex flex-col items-center" style={{ top: "143px", right: "calc(50% - 620px)" }}>
          <img src="/light-bulb 1.png" alt="Bulb" className="w-[110px] h-auto object-contain z-20" />
          <div className="absolute top-[110px] right-[8%] z-0">
            <img src="/Vector 1.png" alt="Line Decoration" style={{ width: "375px", height: "210px" }} />
          </div>
        </div>
      </div>

      {/* MAIN CARD SECTION */}
      <div className="z-20 flex flex-col items-center justify-center flex-1 w-full px-4 py-10 md:py-0 md:-mt-10">

        {/* Responsive Card Container */}
        <div
          className="relative w-full max-w-[475px] h-auto md:h-[384px] bg-[#FFE0D4] p-5 md:p-6 flex flex-col items-center rounded-[30px] md:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
        >
          <h2 className="font-montserrat font-black text-xl md:text-2xl text-[#1A1A1A] mb-4 md:mb-5 uppercase tracking-tight">Rounds</h2>

          <div className="w-full space-y-3 px-1 md:px-2">
            {rounds.map((round, index) => (
              <div
                key={index}
                className={`${round.color} w-full min-h-[65px] md:h-[75px] py-2 px-4 md:px-6 rounded-2xl flex items-center shadow-sm border border-black/5 hover:scale-[1.02] transition-transform cursor-pointer relative`}
                onClick={()=>{handleToast(round.name)}}
              >
                <div className="flex flex-col items-center justify-center w-full text-center pr-6">
                  <span className="text-[8px] md:text-[10px] font-bold text-gray-600 uppercase tracking-tighter leading-none mb-1">
                    {round.status}
                  </span>
                  <span className="text-[#1A1A1A] font-black text-sm md:text-[16px] leading-tight">
                    {round.name}
                  </span>
                  <span className="text-[7px] md:text-[8px] font-medium text-gray-500 mt-0.5 line-clamp-1 md:line-clamp-none">
                    {round.desc}
                  </span>
                </div>

                <div className="absolute right-4 md:right-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Register Now Button */}
        {!token && (
          <button
            onClick={() => navigate('/register')}
            className="mt-6 md:mt-8 w-full max-w-[408px] h-[55px] md:h-[68px] bg-[#5D2E17] text-white font-black text-xl md:text-2xl rounded-[15px] md:rounded-[20px] shadow-2xl hover:brightness-110 transition-all active:scale-95 uppercase tracking-widest"
          >
            Register Now
          </button>
        )}
      </div>

      {/*  STAR DECORATIONS  */}
      <div className="absolute inset-0 pointer-events-none">
        <img src="/Vector 2.png" alt="Star" className="absolute w-10 md:w-20 h-auto top-10 md:top-10 left-[10%] md:left-[calc(50%-410px)] opacity-40 md:opacity-100" style={{ filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }} />
        <img src="/Vector 2.png" alt="Star" className="absolute w-12 md:w-20 h-auto bottom-10 md:top-[685px] right-[10%] md:left-[calc(50%-500px)] opacity-40 md:opacity-100" style={{ filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }} />
      </div>

    </div>
  );
};

export default Home;