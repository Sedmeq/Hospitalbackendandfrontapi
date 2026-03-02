// import axiosInstance from './axiosConfig';

// export const authApi = {
//     login: (credentials) => axiosInstance.post('/Account/login', credentials),

//     register: (userData) => axiosInstance.post('/Account/register', userData),

//     confirmEmail: (userId, token) =>
//         axiosInstance.get('/Account/confirm-email', { params: { userId, token } }),

//     changePassword: (passwordData) =>
//         axiosInstance.post('/Account/change-password', passwordData),

//     logout: () => axiosInstance.post('/Account/logout'),
// };

import axiosInstance from './axiosConfig';

export const authApi = {
  login: (credentials) => axiosInstance.post('/Account/login', credentials),

  register: (userData) => axiosInstance.post('/Account/register', userData),

  confirmEmail: (userId, token) =>
    axiosInstance.get('/Account/confirm-email', { params: { userId, token } }),

  changePassword: (passwordData) =>
    axiosInstance.post('/Account/change-password', passwordData),

  logout: () => axiosInstance.post('/Account/logout'),

  //google
  googleSignIn: (idToken) =>
  axiosInstance.post("/Account/google-signin",  { IdToken: idToken }),

  // ✅ NEW
  forgotPassword: (email) =>
    axiosInstance.post('/Account/forgot-password', { Email: email }),

  // ✅ NEW
  resetPassword: ({ userId, token, newPassword, confirmPassword }) =>
    axiosInstance.post('/Account/reset-password', {
      UserId: userId,
      Token: token,
      NewPassword: newPassword,
      ConfirmPassword: confirmPassword,
    }),
};