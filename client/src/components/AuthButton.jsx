import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
function AuthButton() {
    const navigate = useNavigate()
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "https://mmil-recruitment-site.vercel.app/api/auth/google",
        { token: credentialResponse.credential }
      );
        const {token , needsProfile, userId} = res.data
        localStorage.setItem('token',token)
        localStorage.setItem('userId', userId)
        if(needsProfile){
            navigate('/complete-profile')
        }
        else{
            toast.success("Logged in successfully ");
            navigate('/')
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
