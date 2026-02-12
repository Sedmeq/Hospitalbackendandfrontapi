import axiosInstance from './axiosConfig';

export const prescriptionApi = {
    createPrescription: (prescriptionData) =>
        axiosInstance.post('/prescription/Create-Prescription', prescriptionData),

    getPrescriptionById: (id) =>
        axiosInstance.get(`/prescription/GetById/${id}`),

    dispensePrescription: (dispenseData) =>
        axiosInstance.post('/prescription/prescriptions/dispense', dispenseData),
};
