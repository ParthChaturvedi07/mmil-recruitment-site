const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  GOOGLE_AUTH: `${API_BASE_URL}/api/auth/google`,
  CHECK_STATUS: `${API_BASE_URL}/api/auth/check-status`,

  // Chat endpoints
  CHAT: `${API_BASE_URL}/api/chat/chat`,
  UPLOAD_RESUME: `${API_BASE_URL}/api/chat/upload-resume`,
  UPLOAD_RESUME2: `${API_BASE_URL}/api/profile/upload-resume`,

  // Admin endpoints
  APPLICATIONS: `${API_BASE_URL}/api/admin/applications`,

  // Domain endpoints
  WEBDEV_SUBMIT: `${API_BASE_URL}/api/webdev/submit`,
  DESIGN_SUBMIT: `${API_BASE_URL}/api/design/add`,
  PROGRAMMING_SUBMIT: `${API_BASE_URL}/api/programming/submit`,
  TECHNICAL_SUBMIT: `${API_BASE_URL}/api/technical/submit`,
};

export default API_BASE_URL;
