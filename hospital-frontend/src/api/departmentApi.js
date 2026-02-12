import axiosInstance from './axiosConfig';

export const departmentApi = {
    getAllDepartments: () => axiosInstance.get('/department/GetAllDepartments'),

    getDepartmentById: (id) => axiosInstance.get(`/department/GetDepatmentByID/${id}`),

    createDepartment: (departmentData) =>
        axiosInstance.post('/department/CreateDepartment', departmentData),

    updateDepartment: (id, departmentData) =>
        axiosInstance.put(`/department/UpdateDepartment/${id}`, departmentData),

    deleteDepartment: (id) =>
        axiosInstance.delete(`/department/DeleteDepartment/${id}`),

    getDoctorsInDepartment: (departmentId) =>
        axiosInstance.get(`/department/GetAllDoctorsInSpecificDepartment/${departmentId}`),
};
