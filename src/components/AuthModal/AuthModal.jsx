// This is the AuthModal component. It shows the login and signup popup.
// We import React and some hooks to manage state and context.
import React, { useState, useContext } from "react";
// Import the CSS for styling the modal.
import "./AuthModal.css";
// Import the Context to use authentication and chat functions.
import { Context } from "../../context/context";

// The main AuthModal function. It takes isOpen (show/hide) and onClose (close modal) as props.
const AuthModal = ({ isOpen, onClose }) => {
  // State for switching between login and signup
  const [isLogin, setIsLogin] = useState(true);
  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  // State for loading spinner
  const [loading, setLoading] = useState(false);
  // State for error messages
  const [error, setError] = useState("");
  // State for success messages
  const [success, setSuccess] = useState("");

  // API base URL for backend requests
  const API_BASE_URL = "http://localhost:5001/api";
  // Get authentication and chat history functions from context
  const { setIsAuthenticated, loadChatHistory } = useContext(Context);

  // This function updates the form fields as the user types.
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // This function handles the form submission for login or signup.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Choose endpoint and payload based on login/signup
      const endpoint = isLogin ? "/auth/login" : "/auth/signup";
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
          };

      // Send request to backend
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      // If response is not ok, show error
      if (!response.ok) {
        if (data.errors && data.errors.length > 0) {
          // Show specific validation errors
          const errorMessages = data.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ");
          throw new Error(errorMessages);
        } else {
          throw new Error(data.message || "Something went wrong");
        }
      }

      // Store token and user info in localStorage
      localStorage.setItem("authToken", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      // Update authentication state
      setIsAuthenticated(true);

      // Show success message
      setSuccess(
        isLogin ? "Login successful!" : "Account created successfully!"
      );

      // Close modal after a short delay and load chat history
      setTimeout(() => {
        onClose();
        loadChatHistory();
      }, 1500);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // This function switches between login and signup mode.
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    });
    setError("");
    setSuccess("");
  };

  // If modal is not open, don't show anything
  if (!isOpen) return null;

  // Render the modal UI
  return (
    // Overlay covers the whole screen
    <div className="auth-modal-overlay" onClick={onClose}>
      {/* Modal box. Clicking inside doesn't close it. */}
      <div
        className={`auth-modal${!isLogin ? " signup-mode" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button (X) */}
        <button className="auth-modal-close" onClick={onClose}>
          7
        </button>

        {/* Header with title and subtitle */}
        <div className="auth-modal-header">
          <h2>{isLogin ? "Welcome Back!" : "Join Astra"}</h2>
          <p>
            {isLogin
              ? "Sign in to continue your journey"
              : "Create your account to get started"}
          </p>
        </div>

        {/* Show error message if any */}
        {error && <div className="auth-error">{error}</div>}

        {/* Show success message if any */}
        {success && <div className="auth-success">{success}</div>}

        {/* The login/signup form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name field for signup only */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          {/* Email field */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {/* Password field */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          {/* Confirm password for signup only */}
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                required={!isLogin}
                disabled={loading}
              />
            </div>
          )}

          {/* Submit button */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="loading-spinner">Loading...</span>
            ) : isLogin ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Switch between login and signup */}
        <div className="auth-modal-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="auth-toggle-btn"
              disabled={loading}
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        {/* Divider line with 'or' */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Google login button (not functional) */}
        <div className="social-auth">
          <button className="social-btn google-btn" disabled={loading}>
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the AuthModal component
export default AuthModal;
