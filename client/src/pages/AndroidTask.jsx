import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-toastify";
import TaskPageLayout from "../components/TaskPageLayout";

const AndroidTask = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: "",
        githubLink: "",
        projectLink: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e) => {
        let value = e.target.value;
        if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
            value = 'https://' + value;
            setFormData({ ...formData, [e.target.name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                API_ENDPOINTS.TECHNICAL_SUBMIT,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Technical project submitted successfully!");
            navigate("/");
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error(error.response?.data?.message || "Failed to submit");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TaskPageLayout activeTab="Technical">
            <div className="text-center mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#5D2E17] mb-1">Round 1</p>
                <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A]">Technical Round</h2>
                <p className="text-xs text-gray-600 mt-2">Task round to check your skills.</p>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-2">Instructions for Students</h3>
                <ul className="text-xs text-gray-700 space-y-1 list-disc list-outside pl-4 text-justify">
                    <li className="font-bold">For students doing app devlopment, they have to do task below</li>
                    <li>Task details can be found <a href="https://docs.google.com/document/d/1EMQy9lENxuM32YXd1zLrq5jtBE8U0uZj665mRVZQg2c/edit?tab=t.8jmyuqdajxv3" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#3b82f6]">here</a>.</li>
                    <li className="font-bold">The task deadline is 11:59pm IST on 19-02-2026.</li>

                    <li>Apk should be uploaded on g-drive and attached below.</li>
                    <li className="font-bold">For students applying under the Technical Domain (excluding Android) — such as AI, ML, Data Science, Cyber Security, Cloud, DevOps, etc. — there is no predefined task. You must submit a self-initiated project in your chosen domain that clearly demonstrates your technical skills and individual contribution. Include proper documentation (GitHub link/README/demo if available). The evaluation will be based on practical implementation, clarity, and impact of your work.</li>
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">Details to be filled by students.</h3>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong className="font-bold">Submissions Closed!</strong>
                    <span className="block sm:inline"> The deadline for project submissions has passed.</span>
                </div>
                <form className="space-y-4 opacity-50 pointer-events-none">
                    <div>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone number*"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            disabled
                            className="w-full bg-transparent border-b border-black text-sm py-2 focus:outline-none focus:border-[#5D2E17] placeholder-gray-500"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="url"
                            name="githubLink"
                            placeholder="Github Link*"
                            value={formData.githubLink}
                            onChange={handleChange}
                            disabled
                            className="w-full bg-transparent border border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5D2E17] placeholder-gray-500"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="url"
                            name="projectLink"
                            placeholder="G-drive Link*"
                            value={formData.projectLink}
                            onChange={handleChange}
                            disabled
                            className="w-full bg-transparent border border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5D2E17] placeholder-gray-500"
                        />
                    </div>


                    <div className="flex justify-center mt-6">
                        <button
                            type="button"
                            disabled
                            className="bg-gray-400 text-white px-8 py-2 rounded-full font-bold text-sm cursor-not-allowed"
                        >
                            Submissions Closed
                        </button>
                    </div>
                </form>
            </div>
        </TaskPageLayout>
    );
};

export default AndroidTask;
