// import axiosInstance from './axiosConfig';

// export const departmentApi = {
//     getAllDepartments: () => axiosInstance.get('/department/GetAllDepartments'),

//     getDepartmentById: (id) => axiosInstance.get(`/department/GetDepatmentByID/${id}`),

//     createDepartment: (departmentData) =>
//         axiosInstance.post('/department/CreateDepartment', departmentData),

//     updateDepartment: (id, departmentData) =>
//         axiosInstance.put(`/department/UpdateDepartment/${id}`, departmentData),

//     deleteDepartment: (id) =>
//         axiosInstance.delete(`/department/DeleteDepartment/${id}`),

//     getDoctorsInDepartment: (departmentId) =>
//         axiosInstance.get(`/department/GetAllDoctorsInSpecificDepartment/${departmentId}`),
// };
import axiosInstance from './axiosConfig';

export const departmentApi = {
  getAllDepartments: () => axiosInstance.get('/department/GetAllDepartments'),

  getDepartmentById: (id) => axiosInstance.get(`/department/GetDepatmentByID/${id}`),

  createDepartment: (formData) =>
    axiosInstance.post('/department/CreateDepartment', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateDepartment: (id, formData) =>
    axiosInstance.put(`/department/UpdateDepartment/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteDepartment: (id) => axiosInstance.delete(`/department/DeleteDepartment/${id}`),

  getDoctorsInDepartment: (departmentId) =>
    axiosInstance.get(`/department/GetAllDoctorsInSpecificDepartment/${departmentId}`),
};
