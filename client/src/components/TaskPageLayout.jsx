import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TaskPageLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Derive activeTab from current path
    const [activeTab, setActiveTab] = useState('');

    const tabs = [
        { name: 'Design', path: '/task/design' },
        { name: 'Programming', path: '/task/programming' },
        { name: 'Web dev', path: '/task/webdev' },
        { name: 'Technical', path: '/task/android' },
    ];

    useEffect(() => {
        const currentTab = tabs.find(tab => location.pathname.includes(tab.path));
        if (currentTab) {
            setActiveTab(currentTab.name);
        }
    }, [location.pathname]);

    return (
        <div className="relative min-h-screen w-full bg-[#FDF5E6] flex flex-col items-center font-montserrat overflow-hidden">

            {/* LOGO (Matching Home.jsx position/style exactly) */}
            <img
                src="/mmil-logo1.png"
                alt="MMIL Logo"
                className="w-24 sm:w-32 md:w-40 h-auto absolute left-1/2 transform -translate-x-1/2 top-6 md:top-8 z-50 cursor-pointer transition-transform hover:scale-105"
                onClick={() => navigate('/')}
            />

            {/* NAVBAR */}
            {/* Width matches the main card below it */}
            <nav className="relative z-40 flex justify-center items-center pt-24 md:pt-32 pb-4 w-full px-1 sm:px-4">
                <div className="bg-[#72341E] w-full max-w-[500px] p-1 md:p-1.5 rounded-full flex justify-between items-center px-1 md:px-6 shadow-xl relative overflow-x-auto no-scrollbar">
                    {tabs.map((tab) => (
                        <button
                            key={tab.name}
                            onClick={() => navigate(tab.path)}
                            className={`py-1.5 px-2.5 md:py-2 md:px-4 text-[11px] sm:text-sm font-bold relative z-10 transition-colors duration-300 whitespace-nowrap ${activeTab === tab.name ? "text-white" : "text-[#FFE0D4] hover:text-white"
                                }`}
                        >
                            {tab.name}
                            {activeTab === tab.name && (
                                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white rounded-full"></span>
                            )}
                        </button>
                    ))}
                </div>
            </nav>

            {/* BACKGROUND TEXT */}
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

            {/* DECORATIVE ELEMENTS (Matching Home.jsx) */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
                <div className="absolute flex flex-col items-center" style={{ top: "143px", right: "calc(50% - 620px)" }}>
                    <img src="/light-bulb 1.png" alt="Bulb" className="w-[110px] h-auto object-contain z-20" />
                    <div className="absolute top-[110px] right-[8%] z-0">
                        <img src="/Vector 1.png" alt="Line Decoration" style={{ width: "375px", height: "210px" }} />
                    </div>
                </div>
            </div>

            {/* STAR DECORATIONS (Matching Home.jsx) */}
            <div className="absolute inset-0 pointer-events-none">
                <img src="/Vector 2.png" alt="Star" className="absolute w-10 md:w-20 h-auto top-10 md:top-10 left-[10%] md:left-[calc(50%-410px)] opacity-40 md:opacity-100" style={{ filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }} />
                <img src="/Vector 2.png" alt="Star" className="absolute w-12 md:w-20 h-auto bottom-10 md:top-[685px] right-[10%] md:left-[calc(50%-500px)] opacity-40 md:opacity-100" style={{ filter: "sepia(1) saturate(5) hue-rotate(-30deg)" }} />
            </div>


            {/* MAIN CARD: Brown outer box, Inner white box */}
            <div className="z-30 w-full max-w-[500px] bg-[#FFE0D4] rounded-[30px] p-2 md:p-3 shadow-2xl mt-0 border border-white/50 mx-4 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <div className="bg-white w-full h-full rounded-[25px] p-5 md:p-8 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default TaskPageLayout;
