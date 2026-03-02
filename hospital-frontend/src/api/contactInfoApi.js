import axios from "axios";

const API_BASE = "http://localhost:5151";

const client = axios.create({
  baseURL: `${API_BASE}/api/ContactInfo`,
});

// Əgər endpoint-lər auth tələb edirsə (401/403 alırsansa), bunu aç:
// client.interceptors.request.use((config) => {
//   const token = localStorage.getItem("authToken");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export const contactInfoApi = {
  getAll: () => client.get("/GetAllContactInfos"),
  getById: (id) => client.get(`/GetContactInfoById/${id}`),
  getActive: () => client.get("/GetActiveContactInfo"),

  create: (formData) => client.post("/CreateAbout", formData),
  update: (id, formData) => client.put(`/UpdateContactInfo/${id}`, formData),
  remove: (id) => client.delete(`/DeleteContactInfo/${id}`),
};
