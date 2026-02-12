import axiosInstance from './axiosConfig';

export const medicineApi = {
    getAllMedicines: () => axiosInstance.get('/medicine/GetAll'),

    getMedicineById: (id) => axiosInstance.get(`/medicine/Get-By-Id${id}`),

    getMedicineHistory: (id) => axiosInstance.get(`/medicine/${id}/history`),

    searchMedicinesByName: (name) =>
        axiosInstance.get('/medicine/search-By-Name', { params: { name } }),

    getLowStockMedicines: (threshold = 20) =>
        axiosInstance.get('/medicine/Get-low-stock', { params: { threshold } }),

    getExpiredMedicines: () => axiosInstance.get('/medicine/Get-Expired'),

    addMedicineToInventory: (medicineData) =>
        axiosInstance.post('/medicine/add-stock', medicineData),

    dispenseMedicine: (dispenseData) =>
        axiosInstance.post('/medicine/dispense', dispenseData),

    updateMedicineStock: (id, stockData) =>
        axiosInstance.put(`/medicine/update-stock/${id}`, stockData),

    deleteMedicineFromInventory: (deleteData) =>
        axiosInstance.delete('/medicine/remove-from-stock', { data: deleteData }),

    getMedicineQrCode: (id) =>
        axiosInstance.get(`/medicine/${id}/Getqrcode`, { responseType: 'blob' }),

    getMedicineByQrCode: (qrData) =>
        axiosInstance.get('/medicine/qr-scan', { params: { qrData } }),
};
