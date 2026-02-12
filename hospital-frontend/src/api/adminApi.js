import axiosInstance from './axiosConfig';

export const adminApi = {
    getAllUsers: () => axiosInstance.get('/admin/GetAllUsers'),

    hardDeleteUser: (userId) => axiosInstance.delete(`/admin/HardDeleteUser/${userId}`),

    getAllRoles: () => axiosInstance.get('/admin/GetAllRoles'),

    assignRole: (userId, roleName) =>
        axiosInstance.post(`/admin/AssignRole/${userId}`, JSON.stringify(roleName), {
            headers: { 'Content-Type': 'application/json' }
        }),

    removeRole: (userId, roleName) =>
        axiosInstance.delete(`/admin/RemoveRole/${userId}`, {
            data: JSON.stringify(roleName),
            headers: { 'Content-Type': 'application/json' }
        }),

    lockUser: (userId) => axiosInstance.put(`/admin/LockUser/${userId}`),

    unlockUser: (userId) => axiosInstance.put(`/admin/UnlockUser/${userId}`),

    getDashboardStats: () => axiosInstance.get('/admin/DachboardStat'),
};
