// import React from "react";
// import DomainCard from "../components/DomainCard";
// import { useNavigate } from "react-router";


// const AdminPage = () => {
  
//   const domains = [
//     {
//       title: "Programming",
//       count: 80,
//       gradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
//     },
//     {
//       title: "Development",
//       count: 60,
//       gradient: "bg-gradient-to-br from-pink-500 to-rose-600",
//     },
//     {
//       title: "Technical",
//       count: 50,
//       gradient: "bg-gradient-to-br from-emerald-500 to-green-600",
//     },
//     {
//       title: "Design",
//       count: 40,
//       gradient: "bg-gradient-to-br from-orange-500 to-red-600",
//     },
//   ];

//   const total = domains.reduce((sum, d) => sum + d.count, 0);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 p-10">

//       <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-3xl shadow-2xl p-12 flex justify-center items-center mb-10">
//         <div className="text-center">
//           <h2 className="text-xl opacity-90">Total Applications</h2>
//           <p className="text-6xl font-bold mt-2">{total}</p>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         {domains.map((domain, index) => (
//           <DomainCard
//             key={index}
//             title={domain.title}
//             count={domain.count}
//             gradient={domain.gradient}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminPage;
