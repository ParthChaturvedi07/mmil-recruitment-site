import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


function CompleteProfile() {
    const [department, setDepartment] = useState("");
    const navigate = useNavigate()
    const [links, setLinks] = useState({
        github: "",
        figma: "",
        behance: "",
    });
    const [phone, setPhone] = useState("")
    const [branch, setBranch] = useState("")
    const [resume, setResume] = useState(null)

   const handleLinkChange = (e) => {
   const { name, value } = e.target;
   setLinks((prev) => ({
    ...prev,
    [name]: value
     }));
    };

    const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("department", department);
    formData.append("phone", phone);
    formData.append("branch", branch);
    formData.append("resume", resume);
    formData.append("links", JSON.stringify(links));

    await axios.put(
      "http://localhost:5000/api/auth/complete-profile",
      formData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );


    // reseeting fileds
    setDepartment("");
    setPhone("");
    setBranch("");
    setResume(null);
    setLinks({
      github: "",
      figma: "",
      behance: "",
      portfolio: ""
    });

    
    navigate("/");

    toast.success("Profile completed");
  } catch (err) {
    toast.error("Error saving profile");
  }
};


    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg shadow-md w-[350px]"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Complete Your Profile</h2>

                <select
                    className="w-full mb-3 p-2 border rounded"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                >
                    <option value="">Select Department</option>
                    <option value="technical">Technical</option>
                    <option value="webdev">Web Dev</option>
                    <option value="programming">Programming</option>
                    <option value="designing">Designing</option>
                </select>

                 {department !== "designing" && (
  <input
    type="text"
    name="github"
    placeholder="GitHub Link"
    onChange={handleLinkChange}
    className="w-full mb-3 p-2 border rounded"
  />
)}

{department === "designing" && (
  <>
    <input
      type="text"
      name="figma"
      placeholder="Figma Link"
      onChange={handleLinkChange}
      className="w-full mb-3 p-2 border rounded"
    />
    <input
      type="text"
      name="behance"
      placeholder="Behance Link"
      onChange={handleLinkChange}
      className="w-full mb-3 p-2 border rounded"
    />
  </>
)}

 <input
  type="tel"
  placeholder="Phone Number"
  value={phone}
  onChange={(e) => setPhone(e.target.value)}
  className="w-full mb-3 p-2 border rounded"
/>

<input
  type="text"
  placeholder="Branch (CSE, IT, etc.)"
  value={branch}
  onChange={(e) => setBranch(e.target.value)}
  className="w-full mb-3 p-2 border rounded"
/>

<input
  type="file"
  accept=".pdf,.doc,.docx"
  onChange={(e) => setResume(e.target.files[0])}
  className="w-full mb-4"
 />


          

                <button className="w-full bg-blue-600 text-white py-2 rounded">
                    Save Profile
                </button>
            </form>
        </div>
    );
}

export default CompleteProfile;
