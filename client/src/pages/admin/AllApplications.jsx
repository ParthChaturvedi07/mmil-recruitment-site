import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const isSafeUrl = (url) => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return ["http:", "https:", "mailto:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const StudentDetailsModal = ({
  student,
  onClose,
  onStatusChange,
  isSafeUrl,
}) => {
  const [editedStudent, setEditedStudent] = useState(student);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setEditedStudent({
      ...student,
      technicalScore: student.technicalScore || 0,
      problemSolvingScore: student.problemSolvingScore || 0,
      communicationScore: student.communicationScore || 0,
      confidenceScore: student.confidenceScore || 0,
      commitmentScore: student.commitmentScore || 0,
      hosteler: student.hosteler || false,
      score: student.score || 0,
      comment: student.comment || "",
    });
  }, [student]);

  if (!student) return null;

  const hasChanges =
    JSON.stringify({
      score: editedStudent.score,
      technicalScore: editedStudent.technicalScore,
      problemSolvingScore: editedStudent.problemSolvingScore,
      communicationScore: editedStudent.communicationScore,
      confidenceScore: editedStudent.confidenceScore,
      commitmentScore: editedStudent.commitmentScore,
      hosteler: editedStudent.hosteler,
      aptitudeStatus: editedStudent.aptitudeStatus,
      technicalStatus: editedStudent.technicalStatus,
      hrStatus: editedStudent.hrStatus,
      comment: editedStudent.comment,
    }) !==
    JSON.stringify({
      score: student.score || 0,
      technicalScore: student.technicalScore || 0,
      problemSolvingScore: student.problemSolvingScore || 0,
      communicationScore: student.communicationScore || 0,
      confidenceScore: student.confidenceScore || 0,
      commitmentScore: student.commitmentScore || 0,
      hosteler: student.hosteler || false,
      aptitudeStatus: student.aptitudeStatus,
      technicalStatus: student.technicalStatus,
      hrStatus: student.hrStatus,
      comment: student.comment || "",
    });

  const handleChange = (field, value) => {
    setEditedStudent((prev) => ({ ...prev, [field]: value }));
  };

  const handleScoreChange = (scoreField, value, max) => {
    const numValue = Math.min(Math.max(0, parseInt(value) || 0), max);
    setEditedStudent((prev) => {
      const updatedStudent = {
        ...prev,
        [scoreField]: numValue,
      };

      const totalScore =
        (updatedStudent.technicalScore || 0) +
        (updatedStudent.problemSolvingScore || 0) +
        (updatedStudent.communicationScore || 0) +
        (updatedStudent.confidenceScore || 0) +
        (updatedStudent.commitmentScore || 0);

      return {
        ...updatedStudent,
        score: totalScore,
      };
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    const fields = [
      "aptitudeStatus",
      "technicalStatus",
      "hrStatus",
      "technicalScore",
      "problemSolvingScore",
      "communicationScore",
      "confidenceScore",
      "commitmentScore",
      "hosteler",
      "score",
      "comment",
    ];

    for (const field of fields) {
      if (editedStudent[field] !== student[field]) {
        await onStatusChange(student._id, field, editedStudent[field], true);
      }
    }

    setIsSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
            <p className="text-sm text-gray-500 mt-1">{student.email}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Academic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Academic Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400">
                    Admission Number
                  </label>
                  <div className="font-mono font-medium">
                    {student.admissionNumber || "-"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">
                    University Roll
                  </label>
                  <div className="font-medium">
                    {student.universityRoll || "-"}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Branch</label>
                    <div className="font-medium uppercase">
                      {student.branch || "-"}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Year</label>
                    <div className="font-medium">{student.year || "-"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    checked={editedStudent.hosteler || false}
                    onChange={(e) => handleChange("hosteler", e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Hosteller
                  </label>
                </div>
              </div>
            </div>

            {/* Contact & Links */}
            <div className="bg-gray-50 p-4 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Contact & Links
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-400">Email</label>
                  <div className="font-medium break-all">
                    {student.email || "-"}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-400">Phone</label>
                  <div className="font-medium">{student.phone || "-"}</div>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {student.links?.github && isSafeUrl(student.links.github) && (
                    <a
                      href={student.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-gray-900 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-gray-800"
                    >
                      <span>GitHub</span>
                    </a>
                  )}
                  {student.links?.figma && isSafeUrl(student.links.figma) && (
                    <a
                      href={student.links.figma}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-purple-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-purple-700"
                    >
                      <span>Figma</span>
                    </a>
                  )}
                  {student.resumeId ? (
                    <a
                      href={`${API_BASE}/api/profile/resume/${student.resumeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700"
                    >
                      <span>Resume PDF</span>
                    </a>
                  ) : student.resume && (
                    <a
                      href={`${API_BASE}/${student.resume}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-blue-700"
                    >
                      <span>Resume PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Evaluation Status */}
          <div className="bg-white border-2 border-indigo-50 p-6 rounded-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-indigo-600 rounded-full"></span>
              Evaluation Status
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Detailed Scores */}
              <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-4 bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-sm text-gray-700 border-b pb-2 mb-2">
                  Detailed Scoring
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Tech Knowledge (10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={editedStudent.technicalScore || 0}
                      onChange={(e) =>
                        handleScoreChange("technicalScore", e.target.value, 10)
                      }
                      className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Prob Solving (10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={editedStudent.problemSolvingScore || 0}
                      onChange={(e) =>
                        handleScoreChange(
                          "problemSolvingScore",
                          e.target.value,
                          10,
                        )
                      }
                      className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Communication (5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={editedStudent.communicationScore || 0}
                      onChange={(e) =>
                        handleScoreChange(
                          "communicationScore",
                          e.target.value,
                          5,
                        )
                      }
                      className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Confidence (5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={editedStudent.confidenceScore || 0}
                      onChange={(e) =>
                        handleScoreChange("confidenceScore", e.target.value, 5)
                      }
                      className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">
                      Commitment (5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={editedStudent.commitmentScore || 0}
                      onChange={(e) =>
                        handleScoreChange("commitmentScore", e.target.value, 5)
                      }
                      className="w-full px-2 py-1 border rounded text-sm outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-800">
                      Total Score
                    </label>
                    <div className="w-full px-2 py-1 bg-gray-200 rounded text-sm font-bold text-center">
                      {editedStudent.score || 0} / 35
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-4 col-span-1 md:col-span-2 lg:col-span-4 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-sm text-gray-700 border-b pb-2 mb-2">
                Feedback / Comments
              </h4>
              <textarea
                value={editedStudent.comment || ""}
                onChange={(e) => handleChange("comment", e.target.value)}
                placeholder="Add any additional comments or feedback here..."
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:border-indigo-500 h-24 resize-none"
              />
            </div>

            {/* Status Dropdowns */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Aptitude
              </label>
              <select
                value={editedStudent.aptitudeStatus || "pending"}
                onChange={(e) => handleChange("aptitudeStatus", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none cursor-pointer ${editedStudent.aptitudeStatus === "qualified"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : editedStudent.aptitudeStatus === "rejected"
                    ? "bg-red-50 text-red-800 border-red-200"
                    : "bg-yellow-50 text-yellow-800 border-yellow-200"
                  }`}
              >
                <option value="pending">Pending</option>
                <option value="qualified">Qualified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Technical
              </label>
              <select
                value={editedStudent.technicalStatus || "pending"}
                onChange={(e) =>
                  handleChange("technicalStatus", e.target.value)
                }
                className={`w-full px-3 py-2 rounded-lg border outline-none cursor-pointer ${editedStudent.technicalStatus === "qualified"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : editedStudent.technicalStatus === "rejected"
                    ? "bg-red-50 text-red-800 border-red-200"
                    : "bg-yellow-50 text-yellow-800 border-yellow-200"
                  }`}
              >
                <option value="pending">Pending</option>
                <option value="qualified">Qualified</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                HR Round
              </label>
              <select
                value={editedStudent.hrStatus || "pending"}
                onChange={(e) => handleChange("hrStatus", e.target.value)}
                className={`w-full px-3 py-2 rounded-lg border outline-none cursor-pointer ${editedStudent.hrStatus === "selected"
                  ? "bg-green-50 text-green-800 border-green-200"
                  : editedStudent.hrStatus === "rejected"
                    ? "bg-red-50 text-red-800 border-red-200"
                    : "bg-yellow-50 text-yellow-800 border-yellow-200"
                  }`}
              >
                <option value="pending">Pending</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          {/* Update Button */}
          <div className="flex justify-end pt-6 mt-6 border-t border-gray-100">
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className={`px-6 py-2 rounded-lg font-bold text-white transition-all transform active:scale-95 ${!hasChanges || isSaving
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
                }`}
            >
              {isSaving ? "Updating..." : "Update Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllApplications = () => {
  /* State & Filters */
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: "all",
    technicalStatus: "all",
    hrStatus: "all",
    hosteler: "all",
    minScore: "",
    year: "all",
    branch: "",
    hasResume: "all",
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const fetchStudentsRef = useRef();

  const fetchStudents = async () => {
    try {
      // Build Query
      const queryParams = new URLSearchParams({
        search,
        ...filters,
      });
      // Remove empty parameters
      if (filters.minScore === "") queryParams.delete("minScore");
      if (filters.branch === "") queryParams.delete("branch");

      const response = await fetch(
        `${API_BASE}/api/admin/students?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!response.ok) {
        if (response.status === 403)
          throw new Error("Access denied. Admins only.");
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

  useEffect(() => {
    fetchStudentsRef.current = fetchStudents;
  });

  /* Initial Fetch */
  useEffect(() => {
    if (!token) {
      setError("No authentication token found");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Manual filter trigger, only re-fetch on token/mount

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setFilters({
      department: "all",
      technicalStatus: "all",
      hrStatus: "all",
      hosteler: "all",
      minScore: "",
      year: "all",
      branch: "",
      hasResume: "all",
    });
    setSearch("");
    // We can trigger fetch here or let user click apply
    setTimeout(fetchStudents, 0);
  };

  const handleStatusChange = async (
    studentId,
    field,
    value,
    shouldSave = true,
  ) => {
    // Optimistic update
    setStudents((prev) => {
      const updated = prev.map((s) =>
        s._id === studentId ? { ...s, [field]: value } : s,
      );
      // Update selected student if it's the one being modified
      if (selectedStudent && selectedStudent._id === studentId) {
        setSelectedStudent((prevSelected) => ({
          ...prevSelected,
          [field]: value,
        }));
      }
      return updated;
    });

    if (!shouldSave) return;

    let prevStudent = students.find((s) => s._id === studentId);
    let prevValue = prevStudent ? prevStudent[field] : null;

    try {
      const response = await fetch(
        `${API_BASE}/api/admin/students/${studentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ [field]: value }),
        },
      );

      if (!response.ok) {
        // Rollback on failure
        setStudents((prev) =>
          prev.map((s) =>
            s._id === studentId ? { ...s, [field]: prevValue } : s,
          ),
        );
        if (selectedStudent && selectedStudent._id === studentId) {
          setSelectedStudent((prev) => ({ ...prev, [field]: prevValue }));
        }
        throw new Error("Failed to update status");
      }
    } catch (err) {
      // Rollback on error
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, [field]: prevValue } : s,
        ),
      );
      if (selectedStudent && selectedStudent._id === studentId) {
        setSelectedStudent((prev) => ({ ...prev, [field]: prevValue }));
      }
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
    setLoading(true);
    setStudents([]);
    setError(null);
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token) return;

    // Initialize WebSocket with authentication
    const socket = io(API_BASE, {
      auth: {
        token: token,
      },
    });

    socket.on("admin:update", (data) => {
      console.log("Real-time update received in student list:", data);
      if (fetchStudentsRef.current) {
        fetchStudentsRef.current(); // Refetch using latest search/filters
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]); // Re-initialize only if token changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-100 p-10 flex items-center justify-center">
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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            All Registered Students
          </h1>
          <button
            onClick={() => navigate("/admin")}
            className="px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-50 transition-colors"
          >
            Dashboard
          </button>
        </div>

        {/* Filters and Search */}
        {/* Filters and Search Controls */}
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8 flex flex-col gap-6 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 w-full flex gap-2">
              <input
                type="text"
                placeholder="Search by name, email, roll no..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Toggle Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-all ${showFilters
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "border-gray-300 hover:bg-gray-50 text-gray-700"
                }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>{showFilters ? "Hide Filters" : "Filters"}</span>
            </button>
          </div>

          {/* Collapsible Filter Panel */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100 animate-fade-in-down">
              {/* Department */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) =>
                    handleFilterChange("department", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                >
                  <option value="all">All Departments</option>
                  <option value="webdev">Web Development</option>
                  <option value="designing">Design</option>
                  <option value="programming">Programming</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              {/* Technical Status */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Technical Status
                </label>
                <select
                  value={filters.technicalStatus}
                  onChange={(e) =>
                    handleFilterChange("technicalStatus", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                >
                  <option value="all">All</option>
                  <option value="qualified">Qualified</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* HR Status */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  HR Status
                </label>
                <select
                  value={filters.hrStatus}
                  onChange={(e) =>
                    handleFilterChange("hrStatus", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                >
                  <option value="all">All</option>
                  <option value="selected">Selected</option>
                  <option value="rejected">Rejected</option>
                  <option value="pending">Pending</option>
                </select>
              </div>

              {/* Hosteller */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Hosteller
                </label>
                <select
                  value={filters.hosteler}
                  onChange={(e) =>
                    handleFilterChange("hosteler", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                >
                  <option value="all">All</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Resume Uploaded */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Resume Uploaded
                </label>
                <select
                  value={filters.hasResume}
                  onChange={(e) =>
                    handleFilterChange("hasResume", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                >
                  <option value="all">All</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Year */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Year
                </label>
                <select
                  value={filters.year}
                  onChange={(e) => handleFilterChange("year", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                >
                  <option value="all">All Years</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                </select>
              </div>

              {/* Branch */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Branch
                </label>
                <input
                  type="text"
                  placeholder="e.g. CSE, IT"
                  value={filters.branch}
                  onChange={(e) => handleFilterChange("branch", e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                />
              </div>

              {/* Min Score */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Min Score
                </label>
                <input
                  type="number"
                  placeholder="Min Score"
                  value={filters.minScore}
                  onChange={(e) =>
                    handleFilterChange("minScore", e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                />
              </div>

              {/* Actions */}
              <div className="flex items-end gap-2 lg:col-span-1">
                <button
                  type="button"
                  onClick={fetchStudents}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-indigo-600 text-xl font-semibold">
            Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-xl text-gray-500">No students found</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-indigo-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Admission No.
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Univ. Roll
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Resume
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => (
                    <tr
                      key={student._id}
                      onClick={() => setSelectedStudent(student)}
                      className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        <div className="font-semibold">
                          {student.name || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {student.admissionNumber || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {student.universityRoll || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="capitalize bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold">
                          {student.department || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {student.score || 0}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {student.resumeId ? (
                          <a
                            href={`${API_BASE}/api/profile/resume/${student.resumeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-indigo-600 hover:text-indigo-800 underline"
                          >
                            View
                          </a>
                        ) : student.resume ? (
                          <a
                            href={`${API_BASE}/${student.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-indigo-600 hover:text-indigo-800 underline"
                          >
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400">No</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-900">
                            {student.email || "-"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {student.phone || "-"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedStudent && (
          <StudentDetailsModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
            onStatusChange={handleStatusChange}
            isSafeUrl={isSafeUrl}
          />
        )}
      </div>
    </div>
  );
};

export default AllApplications;
