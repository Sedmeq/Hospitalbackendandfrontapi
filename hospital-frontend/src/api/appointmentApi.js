import axiosInstance from './axiosConfig';

export const appointmentApi = {
    bookAppointment: (appointmentData) =>
        axiosInstance.post('/appointment/BookAppointment', appointmentData),

    cancelAppointment: (id) =>
        axiosInstance.delete(`/appointment/CancelAppointment${id}`),

    getAllAppointments: () =>
        axiosInstance.get('/appointment/GetAllAppointments'),

    getAppointmentsForPatient: (id) =>
        axiosInstance.get(`/appointment/GetAppointmentsForPatitent${id}`),

    getAppointmentById: (id) =>
        axiosInstance.get(`/appointment/GetAppointmentById${id}`),

    getPatientsForDoctor: (id) =>
        axiosInstance.get(`/appointment/GetAllpatientsforsepasificDoctor`, { params: { id } }),
};
