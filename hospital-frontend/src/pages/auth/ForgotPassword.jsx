import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../../components/common/Toast";
import { authApi } from "../../api/authApi";
import "./Auth.css";

const ForgotPassword = () => {
  const { showToast, ToastComponent } = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      showToast("Əgər bu email mövcuddursa, reset linki göndərildi.", "success");
    } catch {
      showToast("Sorğu zamanı xəta baş verdi.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {ToastComponent}
      <div className="auth-card card-glass">
        <div className="auth-header">
          <h1>🔐 Forgot Password</h1>
          <p>Emailini yaz, reset linki göndərək.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <button
            className="btn btn-primary btn-lg"
            disabled={loading}
            style={{ width: "100%" }}
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <div className="auth-footer">
          <p><Link to="/login">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;