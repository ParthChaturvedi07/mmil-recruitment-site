// import { useEffect, useState } from "react";

// const AllApplications = () => {
//   const [applications, setApplications] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetch("http://localhost:5000/api/admin/applications", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then(async (res) => {
//         const data = await res.json();

//         if (!res.ok) {
//           throw new Error(data.message || "Failed to fetch applications");
//         }

//         console.log("All Applications:", data);
//         return data;
//       })
//       .then((data) => {
//         setApplications(data?.data || []);
//       })
//       .catch((err) => {
//         console.error("Error:", err.message);
//       });
//   }, [token]);

//   return (
//     <div>
//       <h2>All Applications</h2>

//       {applications.length === 0 ? (
//         <p>No Applications Found</p>
//       ) : (
//         applications.map((app) => (
//           <div
//             key={app._id}
//             style={{
//               border: "1px solid gray",
//               margin: "10px",
//               padding: "10px",
//             }}
//           >
//             <p>
//               <strong>Name:</strong> {app.name}
//             </p>
//             <p>
//               <strong>Email:</strong> {app.email}
//             </p>
//             <p>
//               <strong>Department:</strong> {app.department}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default AllApplications;