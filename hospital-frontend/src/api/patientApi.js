// import axiosInstance from './axiosConfig';

// export const patientApi = {
//     getAllPatients: () => axiosInstance.get('/Patient/GetAllPatients'),

//     getPatientById: (id) => axiosInstance.get(`/Patient/GetPatientById/${id}`),

//     getPatientByName: (name) => axiosInstance.get(`/Patient/GetPatientByName/${name}`),

//     createPatient: (patientData) => axiosInstance.post('/Patient/CreatePatient', patientData),

//     updatePatient: (id, patientData) =>
//         axiosInstance.put(`/Patient/UpdatePatient/${id}`, patientData),

//     deletePatient: (id) => axiosInstance.delete(`/Patient/DeletePatient/${id}`),

//     getPatientHistory: (id) => axiosInstance.get(`/Patient/Patient-History/${id}`),
// };
import axiosInstance from './axiosConfig';

export const patientApi = {
    getAllPatients: () => axiosInstance.get('/Patient/GetAllPatients'),

    getPatientById: (id) => axiosInstance.get(`/Patient/GetPatientById/${id}`),

    getPatientByName: (name) => axiosInstance.get(`/Patient/GetPatientByName/${name}`),

    // FormData göndərmək üçün Content-Type-ı SİLMƏ — axios özü multipart qoyur
    createPatient: (formData) =>
        axiosInstance.post('/Patient/CreatePatient', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    updatePatient: (id, formData) =>
        axiosInstance.put(`/Patient/UpdatePatient/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    deletePatient: (id) => axiosInstance.delete(`/Patient/DeletePatient/${id}`),

    getPatientHistory: (id) => axiosInstance.get(`/Patient/Patient-History/${id}`),


    // ✅ NEW: patient öz profilini görür
    getMyProfile: () => axiosInstance.get('/Patient/MyProfile'),

    // ✅ NEW: patient öz profilini update edir (FromForm)
    updateMyProfile: (formData) =>
        axiosInstance.put('/Patient/UpdateMyProfile', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
};