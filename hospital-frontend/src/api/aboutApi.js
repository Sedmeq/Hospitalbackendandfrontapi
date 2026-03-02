import axiosInstance from "./axiosConfig";

export const aboutApi = {
  getAllAbouts: () => axiosInstance.get("/About/GetAllAbouts"),
  getAboutById: (id) => axiosInstance.get(`/About/GetAboutById/${id}`),
  getActiveAbout: () => axiosInstance.get("/About/GetActiveAbout"),

  createAbout: (formData) =>
    axiosInstance.post("/About/CreateAbout", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateAbout: (id, formData) =>
    axiosInstance.put(`/About/UpdateAbout/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteAbout: (id) => axiosInstance.delete(`/About/DeleteAbout/${id}`),
};
