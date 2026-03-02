import axios from "axios";

const API_BASE = "http://localhost:5151"; // səndə necədirsə elə saxla
const client = axios.create({
    baseURL: `${API_BASE}/api/Contact`,
});

// export const contactApi = {
//   getAll: async () => {
//     // Controller-də route: GetAllConact (typo var, elə çağırırıq)
//     const res = await client.get("/GetAllConact");
//     return res.data;
//   },

//   getById: async (id) => {
//     const res = await client.get(`/GetContactById/${id}`);
//     return res.data;
//   },

//   create: async (payload) => {
//     const res = await client.post("/CreateContact", payload);
//     // CreatedAtAction null body qaytarır, amma status 201 olacaq
//     return res;
//   },

//   remove: async (id) => {
//     const res = await client.delete(`/DeleteContact/${id}`);
//     return res.data; // "Contact 'X' was deleted successfully."
//   },
// };
export const contactApi = {
    getAllContacts: () => client.get("/GetAllConact"),
    getContactById: (id) => client.get(`/GetContactById/${id}`),
    createContact: (payload) => client.post("/CreateContact", payload),
    deleteContact: (id) => client.delete(`/DeleteContact/${id}`),
};
