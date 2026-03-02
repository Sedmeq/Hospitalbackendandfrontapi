// src/api/prescriptionApi.js
import axiosInstance from "./axiosConfig"; // <-- səndə hansı addadırsa onu düzəlt

export const prescriptionApi = {
    create: (payload) => axiosInstance.post("/Prescription/Create", payload),

    getByAppointment: (appointmentId) =>
        axiosInstance.get(`/Prescription/ByAppointment/${appointmentId}`),

    downloadPdf: async (prescriptionId) =>
    {
        const res = await axiosInstance.get(`/Prescription/Download/${prescriptionId}`, {
            responseType: "blob",
        });

        const blob = new Blob([res.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `prescription_${prescriptionId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    },
};