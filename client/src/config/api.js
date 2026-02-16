const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  GOOGLE_AUTH: `${API_BASE_URL}/api/auth/google`,

  // Chat endpoints
  CHAT: `${API_BASE_URL}/api/chat/chat`,
  UPLOAD_RESUME: `${API_BASE_URL}/api/chat/upload-resume`,

  // Admin endpoints
  APPLICATIONS: `${API_BASE_URL}/api/admin/applications`,
};

export default API_BASE_URL;
