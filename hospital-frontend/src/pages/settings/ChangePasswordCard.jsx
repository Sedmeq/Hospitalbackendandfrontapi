import React, { useMemo, useState } from "react";
import { authApi } from "../../api/authApi";
import { useToast } from "../../components/common/Toast";

export default function ChangePasswordCard() {
  const { showToast, ToastComponent } = useToast();

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const mismatch = useMemo(() => {
    return (
      form.newPassword &&
      form.confirmNewPassword &&
      form.newPassword !== form.confirmNewPassword
    );
  }, [form.newPassword, form.confirmNewPassword]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const validate = () => {
    if (!form.oldPassword.trim()) return "Old password is required";
    if (!form.newPassword.trim()) return "New password is required";
    if (form.newPassword.length < 6) return "New password must be at least 6 characters";
    if (form.newPassword !== form.confirmNewPassword) return "New passwords do not match";
    if (form.oldPassword === form.newPassword) return "New password must be different from old password";
    return null;
  };

  const extractErrorMessage = (error) => {
    const data = error?.response?.data;
    if (!data) return error?.message || "Change password failed";
    if (typeof data === "string") return data;
    if (data.message && typeof data.message === "string") return data.message;

    if (data.errors && typeof data.errors === "object") {
      const lines = Object.entries(data.errors).flatMap(([field, msgs]) =>
        (Array.isArray(msgs) ? msgs : [String(msgs)]).map((m) => `${field}: ${m}`)
      );
      return lines.join("\n");
    }

    try {
      return JSON.stringify(data);
    } catch {
      return "Change password failed";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      showToast(err, "error");
      return;
    }

    try {
      setLoading(true);

      const res = await authApi.changePassword({
        OldPassword: form.oldPassword,
        NewPassword: form.newPassword,
      });

      if (res.data === true) {
        showToast("Password changed successfully", "success");
        setForm({ oldPassword: "", newPassword: "", confirmNewPassword: "" });
      } else {
        showToast("Old password is incorrect", "error");
      }
    } catch (error) {
      showToast(extractErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      {ToastComponent}
      <h3 style={{ marginTop: 0 }}>Change Password</h3>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label className="form-label">Old Password</label>
          <input
            type="password"
            name="oldPassword"
            className="form-input"
            value={form.oldPassword}
            onChange={onChange}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">New Password</label>
          <input
            type="password"
            name="newPassword"
            className="form-input"
            value={form.newPassword}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Confirm New Password</label>
          <input
            type="password"
            name="confirmNewPassword"
            className="form-input"
            value={form.confirmNewPassword}
            onChange={onChange}
            autoComplete="new-password"
            required
          />
          {mismatch && <small style={{ color: "red" }}>New passwords do not match</small>}
        </div>

        <div className="flex gap-md justify-between mt-lg">
          <button type="submit" className="btn btn-primary" disabled={loading || mismatch}>
            {loading ? "Saving..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}