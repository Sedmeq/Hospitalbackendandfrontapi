import axiosInstance from "./axiosConfig";

export const serviceApi = {
  getAllServices: () => axiosInstance.get("/Service/GetAllServices"),
  getServiceById: (id) => axiosInstance.get(`/Service/GetServiceById/${id}`),

  createService: (formData) =>
    axiosInstance.post("/Service/CreateService", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateService: (id, formData) =>
    axiosInstance.put(`/Service/UpdateService/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteService: (id) => axiosInstance.delete(`/Service/DeleteService/${id}`),
};
