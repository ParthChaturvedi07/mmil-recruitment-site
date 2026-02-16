import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const DepartmentApplications = () => {
  const { department } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!department) return;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `/api/admin/applications/${department}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.message || "Failed to fetch applications"
          );
        }

        const data = await res.json();
        setApplications(data?.data || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message); 
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [department, token]);

  return (
    <div>
      <h2>{department?.toUpperCase()} Applications</h2>

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && applications.length === 0 && (
        <p>No Applications Found</p>
      )}

      {!loading &&
        !error &&
        applications.map((app) => (
          <div
            key={app._id}
            style={{
              border: "1px solid gray",
              margin: "10px",
              padding: "10px",
            }}
          >
            <p>
              <strong>Name:</strong> {app.name}
            </p>
            <p>
              <strong>Email:</strong> {app.email}
            </p>
            <p>
              <strong>Department:</strong> {app.department}
            </p>
          </div>
        ))}
    </div>
  );
};

export default DepartmentApplications;
