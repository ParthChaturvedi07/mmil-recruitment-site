import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DomainStudents = () => {
  const { domainName } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`/api/admin/applications`)
      .then(res => res.json())
      .then(data => setStudents(data));
  }, [domainName]);

  return (
    <div className="min-h-screen p-10 bg-gray-50">
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {domainName} Applications
      </h1>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full">
          <thead className="border-b">
            <tr className="text-left">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Year</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-2">{s.name}</td>
                <td>{s.email}</td>
                <td>{s.year}</td>
                <td>{s.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DomainStudents;
