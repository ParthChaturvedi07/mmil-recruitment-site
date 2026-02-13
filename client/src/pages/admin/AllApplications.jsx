import { useEffect, useState } from "react";

const AllApplications = () => {
  const [applications, setApplications] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("http://localhost:5000/api/admin/applications", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setApplications(data.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Applications</h2>

      {applications.map((app) => (
        <div key={app._id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <p><strong>Name:</strong> {app.name}</p>
          <p><strong>Email:</strong> {app.email}</p>
          <p><strong>Department:</strong> {app.department}</p>
        </div>
      ))}
    </div>
  );
};

export default AllApplications;
