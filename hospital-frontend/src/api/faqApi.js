import axiosInstance from "./axiosConfig";

export const faqApi = {
    getAllFaqs: () => axiosInstance.get("/Faq"),

    createFaq: (payload) => axiosInstance.post("/Faq", payload),

    updateFaq: (id, payload) =>
        axiosInstance.put(`/Faq/${id}`, { ...payload, Id: id }),

    deleteFaq: (id) => axiosInstance.delete(`/Faq/${id}`),
};