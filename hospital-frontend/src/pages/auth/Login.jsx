// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useToast } from '../../components/common/Toast';
// import './Auth.css';


// const Login = () =>
// {
//     const navigate = useNavigate();
//     const { login } = useAuth();
//     const { showToast, ToastComponent } = useToast();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     const [loading, setLoading] = useState(false);

//     const handleChange = (e) =>
//     {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     // const handleSubmit = async (e) =>
//     // {
//     //     e.preventDefault();
//     //     setLoading(true);

//     //     const result = await login(formData);

//     //     // if (result.success)
//     //     // {   //evvelki
//     //     //     // showToast('Login successful!', 'success');
//     //     //     // setTimeout(() => navigate('/dashboard'), 1000);

//     //     //     //yeni

//     //     //     //localStorage.setItem('token', result.token);
//     //     //     localStorage.setItem('authToken', result.token);
//     //     //     if (result.fullName) localStorage.setItem("userName", result.fullName);
//     //     //     if (result.roles) localStorage.setItem("userRoles", JSON.stringify(result.roles));


//     //     //     // Template page-ə redirect
//     //     //     setTimeout(() =>
//     //     //     {
//     //     //         window.location.href = 'http://127.0.0.1:5500/index.html'; // template home page
//     //     //     }, 500);

//     //     //     //end

//     //     // } 
//     //     if (result.success)
//     //     {
//     //         const token = result.token;
//     //         const fullName = result.fullName || "";
//     //         const roles = JSON.stringify(result.roles || []);

//     //         // Tokeni HASH ilə ötür (query yox, hash daha yaxşıdır)
//     //         const url =
//     //             "http://127.0.0.1:5500/index.html" +
//     //             `#token=${encodeURIComponent(token)}` +
//     //             `&name=${encodeURIComponent(fullName)}` +
//     //             `&roles=${encodeURIComponent(roles)}`;

//     //         window.location.href = url;
//     //     }


//     //     setLoading(false);
//     // };

//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();
//         setLoading(true);

//         try
//         {
//             const result = await login(formData);

//             if (!result?.success)
//             {
//                 showToast(result?.message || "Email və ya şifrə yanlışdır", "error");
//                 return;
//             }

//             const token = result.token;
//             const fullName = result.fullName || "";
//             const roles = JSON.stringify(result.roles || []);

//             const url =
//                 "http://127.0.0.1:5500/index.html" +
//                 `#token=${encodeURIComponent(token)}` +
//                 `&name=${encodeURIComponent(fullName)}` +
//                 `&roles=${encodeURIComponent(roles)}`;

//             window.location.href = url;
//         } catch (err)
//         {
//             // Backend-in göndərdiyi mesajı tutmağa çalış
//             const msg =
//                 err?.response?.data?.message ||
//                 err?.response?.data ||
//                 err?.message ||
//                 "Login zamanı xəta baş verdi";

//             showToast(msg, "error");
//         } finally
//         {
//             setLoading(false);
//         }
//     };


//     return (
//         <div className="auth-container">
//             {ToastComponent}
//             <div className="auth-card card-glass">
//                 <div className="auth-header">
//                     <h1>🏥 Hospital Management</h1>
//                     <h2>Welcome Back</h2>
//                     <p>Sign in to your account</p>
//                 </div>

//                 <form onSubmit={handleSubmit} className="auth-form">
//                     <div className="form-group">
//                         <label className="form-label">Email</label>
//                         <input
//                             type="email"
//                             name="email"
//                             className="form-input"
//                             value={formData.email}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter your email"
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Password</label>
//                         <input
//                             type="password"
//                             name="password"
//                             className="form-input"
//                             value={formData.password}
//                             onChange={handleChange}
//                             required
//                             placeholder="Enter your password"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="btn btn-primary btn-lg"
//                         disabled={loading}
//                         style={{ width: '100%' }}
//                     >
//                         {loading ? 'Signing in...' : 'Sign In'}
//                     </button>
//                 </form>

//                 <div className="auth-footer">
//                     <p>
//                         Don't have an account?{' '}
//                         <Link to="/register">Create one</Link>
//                     </p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Login;












import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
// import React, { useEffect, useState } from 'react';
// import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import './Auth.css';

import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "../../api/authApi";

const Login = () =>
{
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast, ToastComponent } = useToast();

    const [searchParams] = useSearchParams();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);

    // useEffect(() =>
    // {
    //     const verified = searchParams.get("verified");

    //     if (verified === "true")
    //     {
    //         showToast("✅ Email təsdiqləndi. İndi daxil ola bilərsən.", "success");
    //         // istəsən query-ni təmizlə:
    //         window.history.replaceState({}, document.title, "/login");
    //     }
    //     else if (verified === "false")
    //     {
    //         showToast("❌ Email təsdiqlənmədi və ya linkin vaxtı bitib.", "error");
    //         window.history.replaceState({}, document.title, "/login");
    //     }
    // }, [searchParams, showToast]);

    //const [searchParams] = useSearchParams();
    const verified = searchParams.get("verified");
    const shownRef = useRef(false);

    useEffect(() =>
    {
        // artıq göstərilibsə, bir də göstərmə
        if (shownRef.current) return;

        if (verified === "true")
        {
            shownRef.current = true;
            showToast("✅ Email təsdiqləndi. İndi daxil ola bilərsən.", "success");

            // query-ni təmizlə ki refresh-də təkrar olmasın
            window.history.replaceState({}, document.title, "/login");
        }
        else if (verified === "false")
        {
            shownRef.current = true;
            showToast("❌ Email təsdiqlənmədi və ya linkin vaxtı bitib.", "error");
            window.history.replaceState({}, document.title, "/login");
        }
    }, [verified]); // ⚠️ burda showToast YOXdur!

    const handleChange = (e) =>
    {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    //google
    const handleGoogleSuccess = async (credentialResponse) =>
    {
        console.log("GOOGLE SUCCESS", credentialResponse);
        try
        {
            const idToken = credentialResponse?.credential; // ✅ IdToken burada gəlir
            if (!idToken)
            {
                showToast("Google token alınmadı.", "error");
                return;
            }

            const res = await authApi.googleSignIn(idToken);

            // backend LoginResponce qaytarır: token/fullName/roles/email
            const result = res.data;

            if (!result?.token)
            {
                showToast("Google login alınmadı.", "error");
                return;
            }

            const token = result.token;
            const fullName = result.fullName || "";
            const roles = JSON.stringify(result.roles || []);

            // Səndəki flow: index.html-ə token ötürürsən
            // const url =
            //     "http://127.0.0.1:5500/index.html" +
            //     `#token=${encodeURIComponent(token)}` +
            //     `&name=${encodeURIComponent(fullName)}` +
            //     `&roles=${encodeURIComponent(roles)}`;

            // window.location.href = url;




            //islemese bunu acc

            //asagidaki











            // const returnUrl = searchParams.get("returnUrl") || "http://127.0.0.1:5500/index.html";
            // const url =
            //     returnUrl +
            //     `#token=${encodeURIComponent(token)}` +
            //     `&name=${encodeURIComponent(fullName)}` +
            //     `&roles=${encodeURIComponent(roles)}`;
            // window.location.href = url;

            const returnUrl = searchParams.get("returnUrl") || "http://localhost:5173/dashboard";
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
                "Google login zamanı xəta baş verdi";
            showToast(msg, "error");
        }
    };

    const handleGoogleError = () =>
    {
        showToast("Google login alınmadı.", "error");
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        setLoading(true);

        try
        {
            const result = await login(formData);

            if (!result?.success)
            {
                showToast(result?.message || "Email və ya şifrə yanlışdır", "error");
                return;
            }

            const token = result.token;
            const fullName = result.fullName || "";
            const roles = JSON.stringify(result.roles || []);

            const url =
                "http://127.0.0.1:5500/index.html" +
                `#token=${encodeURIComponent(token)}` +
                `&name=${encodeURIComponent(fullName)}` +
                `&roles=${encodeURIComponent(roles)}`;

            window.location.href = url;
        }
        catch (err)
        {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Login zamanı xəta baş verdi";

            showToast(msg, "error");
        }
        finally
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
                    <h2>Welcome Back</h2>
                    <p>Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
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
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-input"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-lg"
                        disabled={loading}
                        style={{ width: '100%' }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div style={{ marginTop: 12 }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
                    </div>
                </div>

                <div className="auth-footer">
                    <p>
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>

                    <p style={{ marginTop: 8 }}>
                        <Link to="/forgot-password">Forgot password?</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;