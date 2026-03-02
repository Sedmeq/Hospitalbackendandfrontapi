// import axiosInstance from "./axiosConfig";

// export const doctorApi = {
//     getAllDoctors: () => axiosInstance.get("/Doctors/GetAllDoctors"),


//     getDoctorById: (id) => axiosInstance.get(`/Doctors/GetDoctorById/${id}`),

//     createDoctor: (fd) =>
//         axiosInstance.post("/Doctors/CreateDoctor", fd, {
//             headers: { "Content-Type": "multipart/form-data" },
//         }),

//     getDoctorWithDetails: (id) =>
//         axiosInstance.get(`/Doctors/GetDoctorWithDetails/${id}`),

//     updateDoctor: (id, fd) =>
//         axiosInstance.put(`/Doctors/UpdateDoctor/${id}`, fd, {
//             headers: { "Content-Type": "multipart/form-data" },
//         }),

//     deleteDoctor: (id) => axiosInstance.delete(`/Doctors/DeleteDoctor/${id}`),
// };


import axiosInstance from "./axiosConfig";

export const doctorApi = {
    getAllDoctors: () => axiosInstance.get("/Doctors/GetAllDoctors"),
    getDoctorById: (id) => axiosInstance.get(`/Doctors/GetDoctorById/${id}`),
    getDoctorWithDetails: (id) => axiosInstance.get(`/Doctors/GetDoctorWithDetails/${id}`),
    myPatients: () => axiosInstance.get("/Doctors/MyPatients"),
    createDoctor: (fd) =>
        axiosInstance.post("/Doctors/CreateDoctor", fd, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    updateDoctor: (id, fd) =>
        axiosInstance.put(`/Doctors/UpdateDoctor/${id}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    deleteDoctor: (id) => axiosInstance.delete(`/Doctors/DeleteDoctor/${id}`),

    // ✅ NEW: doctor öz profilini görür
    getMyProfile: () => axiosInstance.get("/Doctors/MyProfile"),

    // ✅ NEW: doctor öz profilini update edir
    updateMyProfile: (formData) =>
        axiosInstance.put("/Doctors/UpdateMyProfile", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
};