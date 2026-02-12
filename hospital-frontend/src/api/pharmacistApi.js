import axiosInstance from './axiosConfig';

export const pharmacistApi = {
    getAllPharmacists: () => axiosInstance.get('/pharmacist/GetAllPharmacist'),

    getPharmacistById: (id) => axiosInstance.get(`/pharmacist/GetPharmacistByID/${id}`),

    createPharmacist: (pharmacistData) =>
        axiosInstance.post('/pharmacist/CreatePharmacist', pharmacistData),

    updatePharmacist: (id, pharmacistData) =>
        axiosInstance.put(`/pharmacist/UpdatePharmacist/${id}`, pharmacistData),

    deletePharmacist: (id) =>
        axiosInstance.delete(`/pharmacist/DeletePharmacist/${id}`),
};
