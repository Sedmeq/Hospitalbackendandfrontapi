import axiosInstance from "./axiosConfig";

export const doctorSkillApi = {
  getSkillsByDoctorId: (doctorId) =>
    axiosInstance.get(`/DoctorSkill/GetSkillsByDoctorId/${doctorId}`),

  addSkill: (payload) =>
    axiosInstance.post(`/DoctorSkill/AddSkill`, payload),

  deleteSkill: (id) =>
    axiosInstance.delete(`/DoctorSkill/DeleteSkill/${id}`),
};