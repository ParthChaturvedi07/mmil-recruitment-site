import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-toastify";
import TaskPageLayout from "../components/TaskPageLayout";

const DesignTask = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: "",
        figmaLink: "",
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
                API_ENDPOINTS.DESIGN_SUBMIT,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Design project submitted successfully!");
            navigate("/");
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error(error.response?.data?.message || "Failed to submit project");
        } finally {
            setLoading(false);
        }
    };

    return (
        <TaskPageLayout>
            <div className="text-center mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-[#5D2E17] mb-1">Round 1</p>
                <h2 className="text-2xl md:text-3xl font-black text-[#1A1A1A]">Technical Round</h2>
                <p className="text-xs text-gray-600 mt-2">Task round to check your skills.</p>
            </div>

            <div className="mb-6">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-2">Instructions for Students</h3>
                <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                    <li>You are required to choose ANY ONE task from <a href="/design_task.pdf" target="_blank" rel="noopener noreferrer" className="underline font-bold text-[#5D2E17]">here</a></li>
                    <li className="font-bold">The task deadline is 11:59pm IST on 19-02-2026</li>
                    <li>Task should be submitted below</li>
                </ul>
            </div>

            <div className="mb-4">
                <h3 className="text-sm font-bold text-[#1A1A1A] mb-3">Details to be filled by students.</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            name="phoneNumber"
                            placeholder="Phone number*"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            className="w-full bg-transparent border-b border-black text-sm py-2 focus:outline-none focus:border-[#5D2E17] placeholder-gray-500"
                        />
                    </div>
                    <div className="relative">
                        <input
                            type="url"
                            name="figmaLink"
                            placeholder="Figma/Adobe Xd Link*"
                            value={formData.figmaLink}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            required
                            className="w-full bg-transparent border border-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#5D2E17] placeholder-gray-500"
                        />
                        {formData.figmaLink && (
                            <button type="button" onClick={() => setFormData({ ...formData, figmaLink: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black">
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#6D3019] text-white px-8 py-2 rounded-full font-bold text-sm hover:scale-105 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </TaskPageLayout>
    );
};

export default DesignTask;
