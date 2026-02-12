import axiosInstance from './axiosConfig';

export const authApi = {
    login: (credentials) => axiosInstance.post('/account/login', credentials),

    register: (userData) => axiosInstance.post('/account/register', userData),

    confirmEmail: (userId, token) =>
        axiosInstance.get('/account/confirm-email', { params: { userId, token } }),

    changePassword: (passwordData) =>
        axiosInstance.post('/account/change-password', passwordData),

    logout: () => axiosInstance.post('/account/logout'),
};
