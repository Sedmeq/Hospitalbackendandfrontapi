import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () =>
{
    const { user, hasRole } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // useEffect(() =>
    // {
    //     if (hasRole('Admin'))
    //     {
    //         loadDashboardStats();
    //     } else
    //     {
    //         setLoading(false);
    //     }
    // }, []);
    useEffect(() =>
    {
        // user hələ yüklənməyibsə, çıx (spinner qalsın)
        if (!user) return;

        if (hasRole('Admin'))
        {
            loadDashboardStats();
        } else
        {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);
    
    const loadDashboardStats = async () =>
    {
        try
        {
            const response = await adminApi.getDashboardStats();
            setStats(response.data);
        } catch (error)
        {
            console.error('Error loading dashboard stats:', error);
        } finally
        {
            setLoading(false);
        }
    };

    if (loading)
    {
        return <LoadingSpinner fullScreen />;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h2>Welcome back, {user?.fullName}! 👋</h2>
                <p className="text-muted">Here's what's happening in your hospital today</p>
            </div>

            {hasRole('Admin') && stats && (
                <div className="stats-grid grid grid-4">
                    <div className="stat-card card-glass">
                        <div className="stat-icon" style={{ background: 'var(--primary)' }}>👨‍⚕️</div>
                        <div className="stat-info">
                            <h3>{stats.totalDoctors || 0}</h3>
                            <p>Total Doctors</p>
                        </div>
                    </div>

                    <div className="stat-card card-glass">
                        <div className="stat-icon" style={{ background: 'var(--success)' }}>🏥</div>
                        <div className="stat-info">
                            <h3>{stats.totalPatients || 0}</h3>
                            <p>Total Patients</p>
                        </div>
                    </div>

                    <div className="stat-card card-glass">
                        <div className="stat-icon" style={{ background: 'var(--warning)' }}>📅</div>
                        <div className="stat-info">
                            <h3>{stats.totalAppointments || 0}</h3>
                            <p>Appointments</p>
                        </div>
                    </div>

                    <div className="stat-card card-glass">
                        <div className="stat-icon" style={{ background: 'var(--info)' }}>🏢</div>
                        <div className="stat-info">
                            <h3>{stats.totalDepartments || 0}</h3>
                            <p>Departments</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="dashboard-content grid grid-2">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Quick Actions</h3>
                    </div>
                    <div className="quick-actions">
                        {hasRole('Admin') && (
                            <>
                                <a href="/doctors" className="action-btn">
                                    <span>👨‍⚕️</span>
                                    <span>Manage Doctors</span>
                                </a>
                                <a href="/patients" className="action-btn">
                                    <span>🏥</span>
                                    <span>Manage Patients</span>
                                </a>
                                <a href="/departments" className="action-btn">
                                    <span>🏢</span>
                                    <span>Manage Departments</span>
                                </a>
                                <a href="/medicine" className="action-btn">
                                    <span>💊</span>
                                    <span>Medicine Inventory</span>
                                </a>
                            </>
                        )}
                        {hasRole('Doctor') && (
                            <>
                                <a href="/appointments" className="action-btn">
                                    <span>📅</span>
                                    <span>My Appointments</span>
                                </a>
                                <a href="/patients" className="action-btn">
                                    <span>🏥</span>
                                    <span>My Patients</span>
                                </a>
                                <a href="/prescriptions" className="action-btn">
                                    <span>📋</span>
                                    <span>Prescriptions</span>
                                </a>
                            </>
                        )}
                        {hasRole('Patient') && (
                            <>
                                <a href="/appointments" className="action-btn">
                                    <span>📅</span>
                                    <span>Book Appointment</span>
                                </a>
                                <a href="/chat" className="action-btn">
                                    <span>🤖</span>
                                    <span>AI Health Assistant</span>
                                </a>
                            </>
                        )}
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">System Information</h3>
                    </div>
                    <div className="system-info">
                        <div className="info-item">
                            <span className="info-label">User Role:</span>
                            <span className="badge badge-primary">{user?.roles?.[0]}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Username:</span>
                            <span>{user?.fullName}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Status:</span>
                            <span className="badge badge-success">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
