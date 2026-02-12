import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import { useToast } from '../../components/common/Toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        loadUsers();
        loadRoles();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await adminApi.getAllUsers();
            setUsers(response.data);
        } catch (error) {
            showToast('Error loading users', 'error');
        } finally {
            setLoading(false);
        }
    };

    const loadRoles = async () => {
        try {
            const response = await adminApi.getAllRoles();
            setRoles(response.data);
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    };

    const handleLockUser = async (userId) => {
        try {
            await adminApi.lockUser(userId);
            showToast('User locked successfully', 'success');
            loadUsers();
        } catch (error) {
            showToast('Error locking user', 'error');
        }
    };

    const handleUnlockUser = async (userId) => {
        try {
            await adminApi.unlockUser(userId);
            showToast('User unlocked successfully', 'success');
            loadUsers();
        } catch (error) {
            showToast('Error unlocking user', 'error');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await adminApi.hardDeleteUser(userId);
            showToast('User deleted successfully', 'success');
            loadUsers();
        } catch (error) {
            showToast('Error deleting user', 'error');
        }
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}
            <h2 className="mb-xl">User Management</h2>
            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Roles</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.fullName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        {user.roles?.map((role, idx) => (
                                            <span key={idx} className="badge badge-primary" style={{ marginRight: '0.25rem' }}>
                                                {role}
                                            </span>
                                        ))}
                                    </td>
                                    <td>
                                        <span className={`badge ${user.isLocked ? 'badge-danger' : 'badge-success'}`}>
                                            {user.isLocked ? 'Locked' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-sm">
                                            {user.isLocked ? (
                                                <button className="btn btn-success btn-sm" onClick={() => handleUnlockUser(user.id)}>
                                                    Unlock
                                                </button>
                                            ) : (
                                                <button className="btn btn-warning btn-sm" onClick={() => handleLockUser(user.id)}>
                                                    Lock
                                                </button>
                                            )}
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteUser(user.id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
