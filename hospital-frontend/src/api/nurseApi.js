import axiosInstance from './axiosConfig';

export const nurseApi = {
    getAllNurses: () => axiosInstance.get('/nurse/GetAllNurses'),

    getNurseById: (id) => axiosInstance.get(`/nurse/GetNurseByID/${id}`),

    createNurse: (nurseData) => axiosInstance.post('/nurse/CreateNurse', nurseData),

    updateNurse: (id, nurseData) =>
        axiosInstance.put(`/nurse/UpdateNurse/${id}`, nurseData),

    deleteNurse: (id) => axiosInstance.delete(`/nurse/DeleteNurse/${id}`),
};
