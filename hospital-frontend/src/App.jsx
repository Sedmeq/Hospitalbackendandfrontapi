import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/layout/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard
import Dashboard from './pages/dashboard/Dashboard';

// Entity Pages
import DoctorsList from './pages/doctors/DoctorsList';
import PatientsList from './pages/patients/PatientsList';
import AppointmentsList from './pages/appointments/AppointmentsList';
import DepartmentsList from './pages/departments/DepartmentsList';
import NursesList from './pages/nurses/NursesList';
import PharmacistsList from './pages/pharmacists/PharmacistsList';
import AccountantsList from './pages/accountants/AccountantsList';
import MedicineList from './pages/medicine/MedicineList';
// import PrescriptionsList from './pages/prescriptions/PrescriptionsList';
import UserManagement from './pages/admin/UserManagement';
import ChatInterface from './pages/chat/ChatInterface';

import SliderList from "./pages/slider/SliderList";
import ServiceList from "./pages/service/ServiceList";
import TestimonialList from "./pages/testimonial/TestimonialList";
import AboutList from './pages/about/AboutList';
import PartnersList from "./pages/partners/PartnersList";
import BlogList from "./pages/blog/BlogList";
import BlogDetails from "./pages/blog/BlogDetails";

import DoctorDetails from "./pages/doctors/DoctorDetails";
import ContactPage from "./pages/contact/ContactList";
import ContactInfoList from "./pages/contactInfo/ContactInfoList";
import AboutSectionList from "./pages/AboutSection/AboutSectionList";
//import ChangePassword from "./pages/settings/ChangePassword";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import FaqList from "./pages/faq/FaqList";
import Settings from "./pages/settings/Settings";


function HashTokenBridge()
{
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() =>
    {
        const hash = location.hash;
        if (!hash || !hash.includes("token=")) return;

        const params = new URLSearchParams(hash.slice(1));
        const token = params.get("token");
        const name = params.get("name") || "";
        const roles = params.get("roles") || "[]";

        if (token)
        {
            localStorage.setItem("authToken", token);
            localStorage.setItem("userName", decodeURIComponent(name));
            localStorage.setItem("userRoles", decodeURIComponent(roles));

            // hash silinsin
            window.history.replaceState({}, document.title, location.pathname + location.search);

            // /dashboard-da qal
            if (location.pathname !== "/dashboard")
            {
                navigate("/dashboard", { replace: true });
            }
        }
    }, [location.hash]);

    return null;
}

import './styles/index.css';

function App()
{
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />


                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    {/* Protected Routes */}
                    {/* <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Navigate to="/dashboard" replace />
                                </Layout>
                            </ProtectedRoute>
                        }
                    /> */}

                    <Route path="/doctor-details/:id" element={<DoctorDetails />} />

                    <Route
                        path="/contacts"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <ContactPage />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute roles={["Admin", "Doctor", "Patient"]}>
                                <Layout>
                                    <Settings />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* <Route
                        path="/settings/change-password"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <ChangePassword />
                                </Layout>
                            </ProtectedRoute>
                        }
                    /> */}


                    <Route path="/faqs" element={
                        <ProtectedRoute requiredRole="Admin">
                            <Layout>
                                <FaqList />
                            </Layout>
                        </ProtectedRoute>} />

                    <Route
                        path="/about-sections"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <AboutSectionList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/contact-info"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <ContactInfoList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Dashboard />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/about"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <AboutList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/partners"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <PartnersList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/blogs"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <BlogList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/blogs/:id"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <BlogDetails />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/sliders"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <SliderList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/services"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <ServiceList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/testimonials"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <TestimonialList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/doctors"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <DoctorsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/patients"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <PatientsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/appointments"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <AppointmentsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/departments"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <DepartmentsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/nurses"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <NursesList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/pharmacists"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <PharmacistsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/accountants"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <AccountantsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/medicine"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <MedicineList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* <Route
                        path="/prescriptions"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <PrescriptionsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    /> */}

                    <Route
                        path="/admin/users"
                        element={
                            <ProtectedRoute requiredRole="Admin">
                                <Layout>
                                    <UserManagement />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/chat"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <ChatInterface />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
