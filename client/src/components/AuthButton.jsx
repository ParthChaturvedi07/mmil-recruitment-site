import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
a
function AuthButton() {
    const navigate = useNavigate()
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: credentialResponse.credential }
      );
        const {token , needsProfile} = res.data
        console.log(res.data)
        localStorage.setItem('token',token)
        if(needsProfile){
            navigate('/complete-profile')
        }
        else{
            toast.success("Logged in successfully ");
        }
      
    } catch (err) {
      console.log(err);
      toast.error("Login failed ");
    }
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google Login Failed")}
      />
    </div>
  );
}

export default AuthButton;
