// import axiosInstance from "./axiosConfig";

// export const doctorScheduleApi = {
//   getSchedules: (doctorId) =>
//     axiosInstance.get(`/DoctorSchedule/GetSchedules/${doctorId}`),

//   create: (payload) => axiosInstance.post(`/DoctorSchedule/CreateSchedule`, payload),

//   getAvailableSlots: (doctorId, date) =>
//     axiosInstance.get(`/DoctorSchedule/GetAvailableSlots`, {
//       params: { doctorId, date },
//     }),
// };

import axiosInstance from "./axiosConfig";

export const doctorScheduleApi = {
  getSchedules: (doctorId) =>
    axiosInstance.get(`/DoctorSchedule/GetSchedules/${doctorId}`),

  createSchedule: (payload) =>
    axiosInstance.post(`/DoctorSchedule/CreateSchedule`, payload),

  deleteSchedule: (id) =>
    axiosInstance.delete(`/DoctorSchedule/DeleteSchedule/${id}`),

  getAvailableSlots: (doctorId, date) =>
    axiosInstance.get(`/DoctorSchedule/GetAvailableSlots`, {
      params: { doctorId, date },
    }),
};