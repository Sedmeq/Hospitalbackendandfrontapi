import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import './Auth.css';

import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "../../api/authApi";

const Register = () =>
{
    const navigate = useNavigate();
    const { register } = useAuth();
    const { showToast, ToastComponent } = useToast();
    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
    {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ✅ GOOGLE REGISTER / SIGN-IN
    const handleGoogleSuccess = async (credentialResponse) =>
    {
        try
        {
            const idToken = credentialResponse?.credential;
            if (!idToken)
            {
                showToast("Google token alınmadı.", "error");
                return;
            }

            const res = await authApi.googleSignIn(idToken);
            const result = res.data;

            if (!result?.token)
            {
                showToast("Google ilə qeydiyyat/login alınmadı.", "error");
                return;
            }

            const token = result.token;
            const fullName = result.fullName || "";
            const roles = JSON.stringify(result.roles || []);

            // template-ə qayıtmaq istəyirsənsə returnUrl saxla
            const returnUrl =
                searchParams.get("returnUrl") || "http://127.0.0.1:5500/index.html";

            const url =
                returnUrl +
                `#token=${encodeURIComponent(token)}` +
                `&name=${encodeURIComponent(fullName)}` +
                `&roles=${encodeURIComponent(roles)}`;

            window.location.href = url;
        } catch (err)
        {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Google qeydiyyatı zamanı xəta baş verdi";
            showToast(msg, "error");
        }
    };

    const handleGoogleError = () =>
    {
        showToast("Google login alınmadı.", "error");
    };

    // NORMAL REGISTER
    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword)
        {
            showToast('Passwords do not match', 'error');
            return;
        }

        setLoading(true);

        try
        {
            const { confirmPassword, ...registerData } = formData;
            const result = await register(registerData);

            if (result.success)
            {
                showToast('Registration successful! Please check your email to confirm.', 'success');
                setTimeout(() => navigate('/login'), 2000);
            } else
            {
                showToast(result.error || 'Registration failed', 'error');
            }
        } finally
        {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            {ToastComponent}
            <div className="auth-card card-glass">
                <div className="auth-header">
                    <h1>🏥 Hospital Management</h1>
                    <h2>Create Account</h2>
                    <p>Register as a new patient</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-input"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            className="form-input"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            required
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                {/* ✅ GOOGLE BUTTON */}
                <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                    </div>
                </div>

                <div className="auth-footer">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;