// src/api/labResultApi.js
import axios from "axios";

const API_ORIGIN = "http://localhost:5151";
const BASE = `${API_ORIGIN}/api/LabResult`;

const client = axios.create({
  baseURL: BASE,
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const labResultApi = {
  // Patient
  getMy: () => client.get("/My"),

  // Doctor
  getMyDoctor: () => client.get("/MyDoctor"),

  // Admin
  getAll: () => client.get(""),

  // Shared
  getById: (id) => client.get(`/${id}`),

  // Doctor
  create: (payload) => client.post("/Create", payload),

  // Doctor/Admin
  delete: (id) => client.delete(`/${id}`),

  // Auth lazım olduğu üçün blob ilə açırıq
  downloadPdf: (id) =>
    client.get(`/Download/${id}`, {
      responseType: "blob",
    }),
};

// import axios from "axios";

// const API_ORIGIN = "http://localhost:5151";

// const client = axios.create({ baseURL: `${API_ORIGIN}/api` });

// client.interceptors.request.use((config) =>
// {
//     const token = localStorage.getItem("authToken");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });

// export const labResultApi = {
//     getMy: () => client.get("/LabResult/My"),
//     getMyDoctor: () => client.get("/LabResult/MyDoctor"),
//     getAll: () => client.get("/LabResult"),
//     getById: (id) => client.get(`/LabResult/${id}`),
//     create: (payload) => client.post("/LabResult/Create", payload),
//     delete: (id) => client.delete(`/LabResult/${id}`),
//     downloadPdf: (id) =>
//         client.get(`/LabResult/Download/${id}`, { responseType: "blob" }),
// };

// // Doktorun öz patientlərini çəkir  →  GET /api/Patient/MyPatients
// export const patientApi = {
//     getMyPatients: () => client.get("/Patient/MyPatients"),
// };

// // Doktorun appointmentlərini çəkir →  GET /api/Appointment/MyDoctor
// export const appointmentApi = {
//     getMyDoctor: () => client.get("/Appointment/MyDoctor"),
// };