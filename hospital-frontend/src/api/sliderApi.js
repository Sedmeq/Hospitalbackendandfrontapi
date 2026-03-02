import axiosInstance from "./axiosConfig";

export const sliderApi = {
  getAllSliders: () => axiosInstance.get("/Slider/GetAllSliders"),
  getSliderById: (id) => axiosInstance.get(`/Slider/GetSliderById/${id}`),

  createSlider: (formData) =>
    axiosInstance.post("/Slider/CreateSlider", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateSlider: (id, formData) =>
    axiosInstance.put(`/Slider/UpdateSlider/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteSlider: (id) => axiosInstance.delete(`/Slider/DeleteSlider/${id}`),
};
