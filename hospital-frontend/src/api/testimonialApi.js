import axiosInstance from "./axiosConfig";

export const testimonialApi = {
  getAllTestimonials: () =>
    axiosInstance.get("/Testimonial/GetAllTestimonial"),

  getTestimonialById: (id) =>
    axiosInstance.get(`/Testimonial/GetTestimonialById/${id}`),

  createTestimonial: (formData) =>
    axiosInstance.post("/Testimonial/CreateTestimonial", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateTestimonial: (id, formData) =>
    axiosInstance.put(`/Testimonial/UpdateTestimonial/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteTestimonial: (id) =>
    axiosInstance.delete(`/Testimonial/DeleteTestimonial/${id}`),
};
