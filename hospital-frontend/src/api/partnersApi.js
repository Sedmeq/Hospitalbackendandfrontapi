import axiosInstance from "./axiosConfig";

export const partnersApi = {
  getAllPartners: () => axiosInstance.get("/Partners/GetAllPartners"),
  getPartnerById: (id) => axiosInstance.get(`/Partners/GetPartnerById/${id}`),

  createPartner: (formData) =>
    axiosInstance.post("/Partners/CreatePartner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updatePartner: (id, formData) =>
    axiosInstance.put(`/Partners/UpdatePartner/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deletePartner: (id) => axiosInstance.delete(`/Partners/DeletePartners/${id}`),
};
