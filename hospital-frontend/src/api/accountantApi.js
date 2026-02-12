import axiosInstance from './axiosConfig';

export const accountantApi = {
    getAllAccountants: () => axiosInstance.get('/accountant/GetAllAccountant'),

    getAccountantById: (id) => axiosInstance.get(`/accountant/GetAccountantByID/${id}`),

    createAccountant: (accountantData) =>
        axiosInstance.post('/accountant/CreateAccountant', accountantData),

    updateAccountant: (id, accountantData) =>
        axiosInstance.put(`/accountant/UpdateAccountant/${id}`, accountantData),

    deleteAccountant: (id) =>
        axiosInstance.delete(`/accountant/DeleteAccountant/${id}`),
};
