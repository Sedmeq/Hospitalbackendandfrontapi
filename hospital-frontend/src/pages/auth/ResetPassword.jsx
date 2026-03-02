import React, { useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../components/common/Toast";
import { authApi } from "../../api/authApi";
import "./Auth.css";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const userId = searchParams.get("userId") || "";
  const token = searchParams.get("token") || "";
  const hasParams = useMemo(() => Boolean(userId && token), [userId, token]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasParams) return showToast("Link səhvdir (token/userId yoxdur).", "error");
    if (newPassword !== confirmPassword) return showToast("Şifrələr uyğun deyil.", "error");

    setLoading(true);
    try {
      const ok = await authApi.resetPassword({ userId, token, newPassword, confirmPassword });

      // backend bool qaytarırsa:
      // ok.data true/false ola bilər
      if (ok?.data === false) {
        showToast("Token etibarsızdır və ya müddəti bitib.", "error");
        return;
      }

      showToast("✅ Şifrə yeniləndi. İndi login ola bilərsən.", "success");
      navigate("/login");
    } catch (err) {
      const msg = err?.response?.data || "Reset zamanı xəta baş verdi";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {ToastComponent}
      <div className="auth-card card-glass">
        <div className="auth-header">
          <h1>🔁 Reset Password</h1>
          <p>{hasParams ? "Yeni şifrəni yaz." : "Reset link düzgün deyil."}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">New password</label>
            <input
              type="password"
              className="form-input"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="New password"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input
              type="password"
              className="form-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
            />
          </div>

          <button
            className="btn btn-primary btn-lg"
            disabled={loading || !hasParams}
            style={{ width: "100%" }}
          >
            {loading ? "Saving..." : "Reset password"}
          </button>
        </form>

        <div className="auth-footer">
          <p><Link to="/login">Back to login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;