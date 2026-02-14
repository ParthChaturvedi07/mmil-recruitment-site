import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading, messages.length]);

  useEffect(() => {
    // Check if user is authenticated
    if (!userId) {
      console.error("No user ID found in localStorage");
      toast.error("Please login first to access the chatbot");
      navigate("/");
      return;
    }

    // Start conversation with welcome message
    const startConversation = async () => {
      try {
        console.log("Starting conversation with userId:", userId);
        const res = await axios.post("http://localhost:5000/api/chat/chat", {
          message: "Hello, I want to start my profile registration",
          userId: userId,
        });
        
        setMessages([
          { role: "assistant", content: res.data.reply }
        ]);

        // Show updated fields notification
        if (
          Array.isArray(res.data.updatedFields) &&
          res.data.updatedFields.length > 0 &&
          (!Array.isArray(res.data.validationErrors) || res.data.validationErrors.length === 0)
        ) {
          toast.success(`Updated: ${res.data.updatedFields.join(', ')}`);
        }
      } catch (error) {
        console.error("Failed to start conversation:", error);
        toast.error(`Failed to start conversation: ${error.response?.data?.error || error.message}`);
      }
    };

    if (userId) {
      startConversation();
    }
  }, [userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() && !resumeFile) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    // Add user message to chat
    if (userMessage) {
      setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    }

    try {
      let res;
      
      if (resumeFile) {
        // Handle resume upload
        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("userId", userId);
        
        res = await axios.post(
          "http://localhost:5000/api/chat/upload-resume",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            }
          }
        );
        
        setMessages(prev => [...prev, { role: "user", content: "📄 Resume uploaded" }]);
        setResumeFile(null);
        setShowResumeUpload(false);
      } else {
        // Regular chat message
        res = await axios.post("http://localhost:5000/api/chat/chat", {
          message: userMessage,
          userId: userId,
        });
      }

      const assistantReply = res.data.reply;
      setMessages(prev => [...prev, { role: "assistant", content: assistantReply }]);

      if (Array.isArray(res.data.validationErrors) && res.data.validationErrors.length > 0) {
        toast.error(res.data.validationErrors[0].message || "Please enter correct details");
      }

      // Check if profile is complete
      if (res.data.profileComplete) {
        toast.success("Profile completed successfully!");
        setTimeout(() => navigate("/"), 2000);
      }

      // Show updated fields notification
      if (
        Array.isArray(res.data.updatedFields) &&
        res.data.updatedFields.length > 0 &&
        (!Array.isArray(res.data.validationErrors) || res.data.validationErrors.length === 0)
      ) {
        toast.success(`Updated: ${res.data.updatedFields.join(', ')}`);
      }

      // Check if resume upload is requested
      if (assistantReply.toLowerCase().includes("resume") || assistantReply.toLowerCase().includes("upload")) {
        setShowResumeUpload(true);
      }
      
      // Check if format examples are mentioned and show them in UI
      if (assistantReply.includes("24cseaiml043") || assistantReply.includes("2500935001")) {
        // Format guidance is already in the message
      }

    } catch (error) {
      const backendErrors = error?.response?.data?.validationErrors;
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        toast.error(backendErrors[0].message || "Please enter correct details");
      } else {
        toast.error("Failed to send message");
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "application/pdf" && !file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
        toast.error("Please upload PDF or Word document");
        return;
      }
      setResumeFile(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-bold">MMIL Recruitment Assistant</h2>
              <p className="text-sm opacity-90">I'll help you complete your profile step by step</p>
            </div>
            
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            <div className="border-t p-4">
              {showResumeUpload && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">Please upload your resume:</p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded text-sm"
                  />
                  {resumeFile && (
                    <p className="text-sm text-green-600 mt-2">Selected: {resumeFile.name}</p>
                  )}
                </div>
              )}
              
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || (!inputMessage.trim() && !resumeFile)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
