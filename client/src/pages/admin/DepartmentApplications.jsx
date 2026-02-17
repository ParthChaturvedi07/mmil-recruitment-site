import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const DepartmentApplications = () => {
    const { domain } = useParams();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = localStorage.getItem("token");

    // Domain mapping: backend value -> display name
    const domainDisplayNames = {
        webdev: "Web Development",
        designing: "Design",
        programming: "Programming",
        technical: "Technical"
    };

    useEffect(() => {
        if (!domain || !token) return;

        const fetchStudents = async () => {
            try {
                const response = await fetch(`${API_BASE}/api/admin/domain/${domain}`, {
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

        fetchStudents();
    }, [domain, token]);

    const handleStatusChange = async (studentId, field, value) => {
        let prevValue;
        setStudents(prev => {
            const student = prev.find(s => s._id === studentId);
            if (student) prevValue = student[field];
            return prev.map(s => s._id === studentId ? { ...s, [field]: value } : s);
        });

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
                setStudents(prev => prev.map(s => s._id === studentId ? { ...s, [field]: prevValue } : s));
                throw new Error("Failed to update status");
            }
        } catch (err) {
            setStudents(prev => prev.map(s => s._id === studentId ? { ...s, [field]: prevValue } : s));
            console.error("Status update error:", err.message);
            alert("Failed to update status. Please try again.");
        }
    };

    const displayName = domainDisplayNames[domain] || domain;

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-10 flex items-center justify-center">
                <div className="text-2xl font-semibold text-indigo-600">Loading students...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-10 flex items-center justify-center">
                <div className="text-2xl font-semibold text-red-600">Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">
                    {displayName} Applications
                </h1>

                {students.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <p className="text-2xl text-gray-500">No students found for this domain</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Name</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Adm No.</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Uni Roll</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Score</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Branch</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Year</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Aptitude</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Technical</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">HR</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Links</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Resume</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">Contact</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map((student, index) => (
                                        <tr
                                            key={student._id}
                                            className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}
                                        >
                                            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{student.name || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 font-mono">{student.admissionNumber || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{student.universityRoll || "-"}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <input
                                                    type="number"
                                                    defaultValue={student.score || 0}
                                                    onBlur={(e) => handleStatusChange(student._id, "score", parseInt(e.target.value) || 0)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") e.target.blur();
                                                    }}
                                                    className="w-16 px-2 py-1 border rounded text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900 uppercase">{student.branch || "-"}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{student.year || "-"}</td>
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

export default DepartmentApplications;