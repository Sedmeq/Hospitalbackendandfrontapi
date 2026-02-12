import axiosInstance from './axiosConfig';

export const patientApi = {
    getAllPatients: () => axiosInstance.get('/patient/GetAllPatients'),

    getPatientById: (id) => axiosInstance.get(`/patient/GetPatientById/${id}`),

    getPatientByName: (name) => axiosInstance.get(`/patient/GetPatientByName/${name}`),

    createPatient: (patientData) => axiosInstance.post('/patient/CreatePatient', patientData),

    updatePatient: (id, patientData) =>
        axiosInstance.put(`/patient/UpdatePatient/${id}`, patientData),

    deletePatient: (id) => axiosInstance.delete(`/patient/DeletePatient/${id}`),

    getPatientHistory: (id) => axiosInstance.get(`/patient/Patient-History/${id}`),
};
