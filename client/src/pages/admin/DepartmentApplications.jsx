import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DepartmentApplications = () => {
  const { department } = useParams();
  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!department) return;

    fetch(`http://localhost:5000/api/admin/applications/${department}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        setApplications(data?.data || []);
      })
      .catch((err) => console.error("Fetch Error:", err));
  }, [department, token]);

  return (
    <div>
      <h2>{department?.toUpperCase()} Applications</h2>

      {applications.length === 0 ? (
        <p>No Applications Found</p>
      ) : (
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
        ))
      )}
    </div>
  );
};

export default DepartmentApplications;