import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const AllApplications = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const fetchStudents = async () => {
        try {
            const query = new URLSearchParams({ search, department }).toString();
            const response = await fetch(`${API_BASE}/api/admin/students?${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 403) throw new Error("Access denied. Admins only.");
                throw new Error("Failed to fetch students");
            }
            const data = await response.json();
            setStudents(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleStatusChange = async (studentId, field, value) => {
        try {
            const response = await fetch(`${API_BASE}/api/admin/students/${studentId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ [field]: value })
            });

            if (!response.ok) {
                throw new Error("Failed to update status");
            }

            // Real-time update via Socket.io will trigger refetch, 
            // but we can also update local state for immediate feedback
            setStudents(prev => prev.map(s => s._id === studentId ? { ...s, [field]: value } : s));
        } catch (err) {
            console.error("Status update error:", err.message);
            alert("Failed to update status. Please try again.");
        }
    };

    useEffect(() => {
        if (!token) {
            setError("No authentication token found");
            setLoading(false);
            return;
        }
        fetchStudents();

        // Initialize WebSocket
        const socket = io(API_BASE);

        socket.on("admin:update", (data) => {
            console.log("Real-time update received in student list:", data);
            fetchStudents(); // Refetch students on any update
        });

        return () => {
            socket.disconnect();
        };
    }, [department, token]); // Refetch on filter change or token change

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-10 flex items-center justify-center">
                <div className="text-2xl font-semibold text-red-600 text-center">
                    <p>Error: {error}</p>
                    <button
                        onClick={() => navigate("/admin")}
                        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-6 md:p-10">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">All Registered Students</h1>
                    <button
                        onClick={() => navigate("/admin")}
                        className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
                    >
                        Dashboard
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-2xl shadow-md mb-8 flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                        <input
                            type="text"
                            placeholder="Search by name, email, roll no..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Search
                        </button>
                    </form>
                    <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="px-4 py-2 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">All Departments</option>
                        <option value="webdev">Web Development</option>
                        <option value="designing">Design</option>
                        <option value="programming">Programming</option>
                        <option value="technical">Technical</option>
                    </select>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-indigo-600 text-xl font-semibold">Loading students...</div>
                ) : students.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <p className="text-xl text-gray-500">No students found</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Admission No.</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Univ. Roll</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Score</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Department</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Aptitude</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Technical</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">HR</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Links</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Resume</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Contact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {students.map((student, index) => (
                                        <tr key={student._id} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                <div className="font-semibold">{student.name || "-"}</div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                                                {student.admissionNumber || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-700">
                                                {student.universityRoll || "-"}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <input
                                                    type="number"
                                                    value={student.score || 0}
                                                    onChange={(e) => handleStatusChange(student._id, "score", parseInt(e.target.value) || 0)}
                                                    className="w-16 px-2 py-1 border rounded text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className="capitalize bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                                                    {student.department || "-"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <select
                                                    value={student.aptitudeStatus || "pending"}
                                                    onChange={(e) => handleStatusChange(student._id, "aptitudeStatus", e.target.value)}
                                                    className={`text-xs font-semibold px-2 py-1 rounded border outline-none ${student.aptitudeStatus === 'qualified' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        student.aptitudeStatus === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="qualified">Qualified</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <select
                                                    value={student.technicalStatus || "pending"}
                                                    onChange={(e) => handleStatusChange(student._id, "technicalStatus", e.target.value)}
                                                    className={`text-xs font-semibold px-2 py-1 rounded border outline-none ${student.technicalStatus === 'qualified' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        student.technicalStatus === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="qualified">Qualified</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <select
                                                    value={student.hrStatus || "pending"}
                                                    onChange={(e) => handleStatusChange(student._id, "hrStatus", e.target.value)}
                                                    className={`text-xs font-semibold px-2 py-1 rounded border outline-none ${student.hrStatus === 'selected' ? 'bg-green-100 text-green-800 border-green-200' :
                                                        student.hrStatus === 'rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                        }`}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="selected">Selected</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </td>
                                            <td className="px-6 py-4 text-sm space-x-2">
                                                {student.links?.github && (
                                                    <a href={student.links.github} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">GitHub</a>
                                                )}
                                                {student.links?.figma && (
                                                    <a href={student.links.figma} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">Figma</a>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                {student.resume ? (
                                                    <a
                                                        href={`${API_BASE}/${student.resume}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 shadow-sm transition-all"
                                                    >
                                                        PDF
                                                    </a>
                                                ) : <span className="text-gray-400">N/A</span>}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                <div className="text-xs truncate max-w-[150px]">{student.email}</div>
                                                <div className="text-xs">{student.phone}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllApplications;