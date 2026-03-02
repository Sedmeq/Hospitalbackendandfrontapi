import axiosInstance from "./axiosConfig";

export const blogApi = {
  // blogs
  getAllBlogs: () => axiosInstance.get("/Blog/GetAllBlogs"),
  getBlogById: (id) => axiosInstance.get(`/Blog/GetBlogById/${id}`),
  getBlogsByCategory: (category) =>
    axiosInstance.get(`/Blog/GetBlogsByCategory/${encodeURIComponent(category)}`),
  searchBlogs: (searchTerm) =>
    axiosInstance.get("/Blog/SearchBlogs", { params: { searchTerm } }),

  createBlog: (formData) =>
    axiosInstance.post("/Blog/CreateBlog", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateBlog: (id, formData) =>
    axiosInstance.put(`/Blog/UpdateBlog/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteBlog: (id) => axiosInstance.delete(`/Blog/DeleteBlog/${id}`),

  // comments
  addComment: (payload) => axiosInstance.post("/Blog/AddComment", payload), // JSON
  deleteComment: (commentId) =>
    axiosInstance.delete(`/Blog/DeleteComment/${commentId}`),
};
