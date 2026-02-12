import axiosInstance from './axiosConfig';

export const doctorApi = {
    getAllDoctors: () => axiosInstance.get('/doctors/GetAllDoctors'),

    getDoctorById: (id) => axiosInstance.get(`/doctors/GetDoctorById/${id}`),

    createDoctor: (doctorData) => axiosInstance.post('/doctors/CreateDoctor', doctorData),

    updateDoctor: (id, doctorData) =>
        axiosInstance.put(`/doctors/UpdateDoctor/${id}`, doctorData),

    deleteDoctor: (id) => axiosInstance.delete(`/doctors/DeleteDoctor/${id}`),
};
