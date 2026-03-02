import axios from 'axios';

const API_BASE_URL = 'http://localhost:5151/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
    (config) =>
    {
        //const token = localStorage.getItem('token');
        const token = localStorage.getItem('authToken');

        if (token)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) =>
    {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
    {
        if (error.response?.status === 401)
        {
            // Token expired or invalid
            // localStorage.removeItem('token');
            // localStorage.removeItem('user');
            // window.location.href = '/login';

            localStorage.removeItem('authToken');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRoles');

            window.location.href = 'http://localhost:5173/login';

        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
