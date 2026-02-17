import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
import DomainCard from "../components/DomainCard";

const AdminPage = () => {
    const [totalStudents, setTotalStudents] = useState(0);
    const [domainStats, setDomainStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    // Domain mapping: backend value -> display name
    const domainDisplayNames = {
        webdev: "Web Development",
        designing: "Design",
        programming: "Programming",
        technical: "Technical"
    };

    // Define gradients for each domain
    const domainGradients = {
        webdev: "bg-gradient-to-br from-pink-500 to-rose-600",
        designing: "bg-gradient-to-br from-orange-500 to-red-600",
        programming: "bg-gradient-to-br from-blue-500 to-indigo-600",
        technical: "bg-gradient-to-br from-emerald-500 to-green-600"
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE}/api/admin/stats`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 403) throw new Error("Access denied. Admins only.");
                throw new Error("Failed to fetch statistics");
            }
            const data = await response.json();

            setTotalStudents(data.totalStudents);
            setDomainStats(data.domainStats);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchStats();

            // Initialize WebSocket
            const socket = io(API_BASE);

            socket.on("admin:update", (data) => {
                console.log("Real-time update received:", data);
                fetchStats(); // Refetch stats on any update
            });

            return () => {
                socket.disconnect();
            };
        } else {
            setError("No authentication token found");
            setLoading(false);
        }
    }, [token]);

    // Prepare domains array with counts
    const domains = ["webdev", "designing", "programming", "technical"].map(domain => {
        // Backend now returns department names in _id
        const stat = domainStats.find(s => s._id === domain);
        return {
            key: domain,
            title: domainDisplayNames[domain],
            count: stat ? stat.count : 0,
            gradient: domainGradients[domain]
        };
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-10 flex items-center justify-center">
                <div className="text-2xl font-semibold text-indigo-600">Loading Dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-10 flex items-center justify-center">
                <div className="text-2xl font-semibold text-red-600 text-center">
                    <p>Error: {error}</p>
                    <button
                        onClick={() => navigate("/login")}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-10">
            <div
                onClick={() => navigate("/admin/students")}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl shadow-2xl p-12 flex justify-center items-center mb-10 cursor-pointer transform hover:scale-[1.02] transition-all"
            >
                <div className="text-center">
                    <h2 className="text-xl opacity-90">Total Applications</h2>
                    <p className="text-6xl font-bold mt-2">{totalStudents}</p>
                    <p className="mt-4 text-sm bg-white/20 px-4 py-1 rounded-full">Click to view all students</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {domains.map((domain) => (
                    <DomainCard
                        key={domain.key}
                        title={domain.title}
                        count={domain.count}
                        gradient={domain.gradient}
                        domainKey={domain.key}
                    />
                ))}
            </div>
        </div>
    );
};

export default AdminPage;
