import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
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
                  {student.resume && (
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
                className={`w-full px-3 py-2 rounded-lg border outline-none cursor-pointer ${
                  editedStudent.aptitudeStatus === "qualified"
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
                className={`w-full px-3 py-2 rounded-lg border outline-none cursor-pointer ${
                  editedStudent.technicalStatus === "qualified"
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
                className={`w-full px-3 py-2 rounded-lg border outline-none cursor-pointer ${
                  editedStudent.hrStatus === "selected"
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
              className={`px-6 py-2 rounded-lg font-bold text-white transition-all transform active:scale-95 ${
                !hasChanges || isSaving
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

const DepartmentApplications = () => {
  const { domain } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const token = localStorage.getItem("token");
  const fetchStudentsRef = useRef();

  // Domain mapping: backend value -> display name
  const domainDisplayNames = {
    webdev: "Web Development",
    designing: "Design",
    programming: "Programming",
    technical: "Technical",
  };

  const fetchStudents = async () => {
    if (!domain || !token) return;
    try {
      const response = await fetch(`${API_BASE}/api/admin/domain/${domain}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
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

  // Keep ref updated with the latest fetch function
  useEffect(() => {
    fetchStudentsRef.current = fetchStudents;
  });

  useEffect(() => {
    setLoading(true);
    setStudents([]);
    setError(null);
    fetchStudents();
  }, [domain, token]);

  useEffect(() => {
    if (!token) return;

    const socket = io(API_BASE, {
      auth: {
        token: token,
      },
    });

    socket.on("admin:update", (data) => {
      console.log("Real-time update received in department list:", data);
      if (fetchStudentsRef.current) {
        fetchStudentsRef.current();
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

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

  const displayName = domainDisplayNames[domain] || domain;

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-100 p-10 flex items-center justify-center">
        <div className="text-2xl font-semibold text-indigo-600">
          Loading students...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-100 p-10 flex items-center justify-center">
        <div className="text-2xl font-semibold text-red-600">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-100 p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          {displayName} Applications
        </h1>

        {students.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-2xl text-gray-500">
              No students found for this domain
            </p>
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
                      Adm No.
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Uni Roll
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Branch
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold whitespace-nowrap">
                      Contact
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student, index) => (
                    <tr
                      key={student._id}
                      onClick={() => setSelectedStudent(student)}
                      className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-blue-50/50 transition-colors cursor-pointer`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                        {student.name || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {student.admissionNumber || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {student.universityRoll || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 uppercase">
                        {student.branch || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        {student.score || 0}
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

export default DepartmentApplications;
