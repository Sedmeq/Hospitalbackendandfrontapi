// import axiosInstance from "./axiosConfig";

// export const doctorEducationApi = {
//   getByDoctorId: (doctorId) =>
//     axiosInstance.get(`/DoctorEducation/GetEducationsByDoctorId/${doctorId}`),

//   add: (payload) => axiosInstance.post(`/DoctorEducation/AddEducation`, payload),
//   update: (id, payload) => axiosInstance.put(`/DoctorEducation/UpdateEducation/${id}`, payload),
//   delete: (id) => axiosInstance.delete(`/DoctorEducation/DeleteEducation/${id}`),
// };
import axiosInstance from "./axiosConfig";

export const doctorEducationApi = {
  getEducationsByDoctorId: (doctorId) =>
    axiosInstance.get(`/DoctorEducation/GetEducationsByDoctorId/${doctorId}`),

  addEducation: (payload) =>
    axiosInstance.post(`/DoctorEducation/AddEducation`, payload),

  updateEducation: (id, payload) =>
    axiosInstance.put(`/DoctorEducation/UpdateEducation/${id}`, payload),

  deleteEducation: (id) =>
    axiosInstance.delete(`/DoctorEducation/DeleteEducation/${id}`),
};