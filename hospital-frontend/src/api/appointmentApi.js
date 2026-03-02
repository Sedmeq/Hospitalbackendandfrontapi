// import axiosInstance from './axiosConfig';

// export const appointmentApi = {
//     bookAppointment: (appointmentData) =>
//         axiosInstance.post('/appointment/BookAppointment', appointmentData),

//     cancelAppointment: (id) =>
//         axiosInstance.delete(`/appointment/CancelAppointment${id}`),

//     getAllAppointments: () =>
//         axiosInstance.get('/appointment/GetAllAppointments'),

//     getAppointmentsForPatient: (id) =>
//         axiosInstance.get(`/appointment/GetAppointmentsForPatitent${id}`),

//     getAppointmentById: (id) =>
//         axiosInstance.get(`/Appointment/GetAppointmentById/${id}`),

//     getMyAppointments: () => axiosInstance.get("/Appointment/GetMyAppointments"),

//     getMyDoctorAppointments: () =>
//         axiosInstance.get("/Appointment/GetMyDoctorAppointments"),


//     getPatientsForDoctor: (id) =>
//         axiosInstance.get(`/appointment/GetAllpatientsforsepasificDoctor`, { params: { id } }),
// };

// src/api/appointmentApi.js
// ✅ appointmentApi.js (tam)


import axiosInstance from "./axiosConfig";

export const appointmentApi = {
    getAllAppointments: () => axiosInstance.get("/Appointment/GetAllAppointments"),
    getMyAppointments: () => axiosInstance.get("/Appointment/GetMyAppointments"),
    getMyDoctorAppointments: () => axiosInstance.get("/Appointment/GetMyDoctorAppointments"),

    getAppointmentById: (id) => axiosInstance.get(`/Appointment/GetAppointmentById/${id}`),

    bookAppointment: (data) => axiosInstance.post("/Appointment/BookAppointment", data),
    cancelAppointment: (id) => axiosInstance.delete(`/Appointment/CancelAppointment/${id}`),

    // ✅ yeni: confirm
    confirmAppointment: (id) => axiosInstance.put(`/Appointment/ConfirmAppointment/${id}`),
};