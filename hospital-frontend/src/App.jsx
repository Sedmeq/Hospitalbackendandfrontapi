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
import PrescriptionsList from './pages/prescriptions/PrescriptionsList';
import UserManagement from './pages/admin/UserManagement';
import ChatInterface from './pages/chat/ChatInterface';

import './styles/index.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <Navigate to="/dashboard" replace />
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

                    <Route
                        path="/prescriptions"
                        element={
                            <ProtectedRoute>
                                <Layout>
                                    <PrescriptionsList />
                                </Layout>
                            </ProtectedRoute>
                        }
                    />

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
