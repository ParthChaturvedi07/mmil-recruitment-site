import React from 'react';
import { useNavigate } from 'react-router-dom';

const Results = () => {
  const navigate = useNavigate();

  const domainResults = [
    { 
      name: "Programming", 
      firstYear: [
        "Aryan Singh [ 25CSE059 ]", "Kanav Mittal [ 25IT181 ]", "Prabhat Singh [ 25CSEDS098 ]",
        "Sanskar Pal [ 25IT100 ]","Sanskar Mittal [ 24CSE144 ]", "Shreyansh [ 25IT130 ]", "Aryan Singh [ 25CSE039 ]",
        "Mohd Fahad [ 25CSEDS100 ]", "Jayendra Kumar Srivastava [ 25CSEAIML199 ]", "Harsh Pandey [ 25IT010 ]","Gaurang Dhanuka [ J25CSE144 ]", "Muskan Yadav [ 25CSEDS105 ]","Prashasti Gupta [ 25CSEDS091 ]", "Urvashi kanojiya [ 25CSEDS039 ]", "Sidhi saxena [ J25IT145 ]", "Prashasti Jha [ 25CSEAIML139 ]", "Ritik Verma [ 25CSEDS085 ]", "Prashasti tiwari [ 25IT003 ] ", "Aditya Singh [25IT199 ]","Shubh Shukla [25IT004]"
      ],
      secondYear: ["Aryan [ 24CSEAIML087] ","Bhawna [ 24CSEDS020 ]","Ansh Tiwari [24CSE072]"]
       
      
    },
    { 
      name: "Web Development", 
      firstYear: ["Sahitya Thakurela [ 25CSE026 ] ", "Shreyansh Yadav [ 25IT046 ]", "Akhil Mishra [ 25CSE010 ]", "Ayushman Gupta [ 25CSEDS123 ]","Sambhav Gupta [ 25CSE223 ]", "Kriti Kesharwani [ 25CSE176 ]", "Maanas Verma [ J25CSE108 ]", "MOHD Salam [ 25CSEAIML032 ]", "Tanishka Israni [ 25CSEAIML071 ]"],
      secondYear: ["Sameer Singla [ 24CSEAIML043 ]", "Vishakha [ 24CSEDS061", "Abhishek [ 24IT139 ]", "Aryan Yadav [ 25DLCSE006 ]", "Somesh Upadhayay [ 24CSEDS110 ]", ]
    },
    { 
      name: "Technical", 
      firstYear: ["Mahi Gupta [ JSAIML059 ]","Aditya Singh [ 25IT199 ]"], 
      secondYear: ["Abhishek [ 24IT139 ]","Shivanshu Kushwaha [ 24CSEAIML021 ]", "Prateek Yadav [ 25CSEDS026 ] ", ] 
    },
    { 
      name: "Design", 
      firstYear: ["Kushagra Jaiswal [ 25IT154 ]", "Ankita Singh [ 25IT099 ]", "Bhaskar Shah [ 25CSEAIML057 ]","Soham Jain", "Dhruv Mridha [ 25CSEAIML169 ]"], 
      secondYear: []
    },
  ];

  
  const YearSection = ({ title, students }) => (
    <div className="mb-8">
      {/* Centered Heading with Lines */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="h-[2px] flex-1 bg-[#5D2E17] opacity-20"></div>
        <h4 className="text-[#5D2E17] font-black text-sm md:text-base uppercase tracking-widest whitespace-nowrap">
          {title}
        </h4>
        <div className="h-[2px] flex-1 bg-[#5D2E17] opacity-20"></div>
      </div>

      {students.length > 0 ? (
        <div className="grid grid-cols-1 gap-2.5">
          {students.map((student, idx) => (
            <div key={idx} className="bg-white/70 p-3.5 px-6 rounded-2xl border border-white hover:border-[#5D2E17]/20 hover:bg-white transition-all shadow-sm">
              <span className="text-sm font-bold text-[#1A1A1A] leading-tight block">
                {student}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter opacity-60">No Selections Available</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen w-full bg-[#FDF5E6] flex flex-col items-center font-montserrat overflow-x-hidden pb-20">
      
      {/* 1. TOP NAV */}
      <div className="w-full flex justify-between items-center p-8 relative z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="px-6 py-2 border-2 border-[#5D2E17] text-[#5D2E17] font-bold rounded-xl hover:bg-[#5D2E17] hover:text-white transition-all shadow-sm"
        >
          Back
        </button>
        <img src="/mmil-logo1.png" alt="MMIL Logo" className="w-32 md:w-40 h-auto absolute left-1/2 -translate-x-1/2" />
      </div>

      {/* 2. MAIN CARD */}
      <div className="z-20 flex flex-col items-center w-full px-4 mt-4">
        <div className="w-full max-w-[1100px] bg-[#FFE0D4] p-6 md:p-10 rounded-[40px] shadow-2xl border-[2px] border-white">
          <h2 className="text-center font-black text-3xl text-[#1A1A1A] mb-12 uppercase tracking-tight">
            Student Performance Results
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {domainResults.map((domain, index) => (
              <div 
                key={index} 
                className="bg-[#FFF9E5] rounded-[35px] p-6 md:p-10 flex flex-col border border-black/5 shadow-md min-h-[550px] max-h-[650px]"
              >
                {/* Domain Header */}
                <div className="text-center mb-8">
                  <h3 className="text-[#5D2E17] font-black text-2xl uppercase tracking-widest border-b-4 border-[#5D2E17] inline-block pb-1">
                    {domain.name}
                  </h3>
                </div>

                {/* 4. SCROLLABLE LIST AREA */}
                <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
                  {(domain.firstYear.length > 0 || domain.secondYear.length > 0) ? (
                    <>
                      <YearSection title="1st Year" students={domain.firstYear} />
                      <YearSection title="2nd Year" students={domain.secondYear} />
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 opacity-50">
                      <div className="p-4 bg-white/40 rounded-full">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="italic font-black text-xs uppercase tracking-widest">Results Pending</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. DECORATIONS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img src="/light-bulb 1.png" alt="Bulb" className="absolute top-20 right-[5%] w-24 opacity-80" />
        <div className="absolute top-[160px] right-[-50px] z-0 opacity-40">
          <img src="/Vector 1.png" alt="Line Decoration" className="w-[400px]" />
        </div>
        <img src="/Vector 2.png" alt="Star" className="absolute top-[20%] left-[5%] w-16 opacity-30" />
        <img src="/Vector 2.png" alt="Star" className="absolute bottom-[10%] right-[10%] w-20 opacity-30" />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.03); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #5D2E17; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default Results;