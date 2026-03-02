import axiosInstance from "./axiosConfig";

export const aboutSectionApi = {
    getAllAboutSections: () => axiosInstance.get("/AboutSection/GetAllAboutSections"),
    getAboutSectionById: (id) => axiosInstance.get(`/AboutSection/GetAboutSectionById/${id}`),

    createAboutSection: (formData) =>
        axiosInstance.post("/AboutSection/CreateAboutSection", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    updateAboutSection: (id, formData) =>
        axiosInstance.put(`/AboutSection/UpdateAboutSection/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),

    deleteAboutSection: (id) => axiosInstance.delete(`/AboutSection/DeleteAboutSection/${id}`),
};
    