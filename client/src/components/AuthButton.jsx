import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { API_ENDPOINTS } from "../config/api.js";
function AuthButton() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        API_ENDPOINTS.GOOGLE_AUTH,
        { token: credentialResponse.credential }
      );
      const { token, needsProfile, userId } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      if (needsProfile) {
        navigate('/complete-profile');
      } else {
        toast.success("Logged in successfully ");
        navigate('/');
      }

    } catch (err) {
      console.log(err);
      toast.error("Login failed ");
      setIsLoading(false);
    }
  };

  const handleERROR = () => {
    toast.error("Google Login Failed");
    setIsLoading(false);
  }

  return (
    <div>
      {isLoading ? (
        <div className="flex items-center justify-center p-2 bg-white text-gray-700 rounded shadow-md border border-gray-300 w-[240px] h-[40px]">
          <svg className="animate-spin h-5 w-5 mr-3 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Signing in...
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleERROR}
        />
      )}
    </div>
  );
}

export default AuthButton;
