import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_ENDPOINTS } from "../config/api";
import { toast } from "react-toastify";
import TaskPageLayout from "../components/TaskPageLayout";

const ProgrammingTask = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        phoneNumber: "",
        hackerRankUsername: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            await axios.post(
                API_ENDPOINTS.PROGRAMMING_SUBMIT,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Programming participation recorded successfully!");
            // Redirect to HackerRank or Home? Design shows a "Click Here" link for contest page.
            // But details to be filled are just phone number. 
            navigate("/");
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error(error.response?.data?.message || "Failed to submit");
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
                    <li className="font-bold">The contest will be held on HackerRank.com.</li>
                    <li>It will be of 2 hours and will contain 5 questions.</li>
                    <li className="font-bold">The contest timing will be from 2:30 to 4:30pm IST on 19-02-26.</li>
                    <li className="font-bold">Please sign up on Hackerrank.com before attempting the quiz.</li>
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
                    <div>
                        <input
                            type="text"
                            name="hackerRankUsername"
                            placeholder="HackerRank Username*"
                            value={formData.hackerRankUsername}
                            onChange={handleChange}
                            disabled
                            className="w-full bg-transparent border-b border-black text-sm py-2 focus:outline-none focus:border-[#5D2E17] placeholder-gray-500"
                        />
                    </div>

                    <div className="text-center mt-4 text-xs">
                        <span className="text-gray-400">Contest link unavailable</span>
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

export default ProgrammingTask;
