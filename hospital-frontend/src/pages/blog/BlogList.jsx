import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { blogApi } from "../../api/blogApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";

const API_ORIGIN = "http://localhost:5151";
const buildImgUrl = (path) =>
{
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const fixed = path.startsWith("/") ? path : `/${path}`;
    return `${API_ORIGIN}${fixed}`;
};

const BlogList = () =>
{
    const navigate = useNavigate();
    const { showToast, ToastComponent } = useToast();

    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);

    const [formState, setFormState] = useState({
        title: "",
        content: "",
        author: "",
        category: "",
        imageFile: null,
    });

    const resetForm = () =>
    {
        setFormState({
            title: "",
            content: "",
            author: "",
            category: "",
            imageFile: null,
        });
        setEditingBlog(null);
    };

    const openCreate = () =>
    {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (b) =>
    {
        setEditingBlog(b);
        setFormState({
            title: b.title ?? "",
            content: b.content ?? "",
            author: b.author ?? "",
            category: b.category ?? "",
            imageFile: null,
        });
        setShowModal(true);
    };

    const buildFormData = (id) =>
    {
        const fd = new FormData();
        if (id != null) fd.append("Id", String(id)); // UpdateBlogCommand.Id varsa

        fd.append("Title", formState.title);
        fd.append("Content", formState.content);
        fd.append("Author", formState.author);
        fd.append("Category", formState.category);

        // CreateBlogCommand file adı: ImagePath
        if (formState.imageFile) fd.append("ImagePath", formState.imageFile);

        return fd;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        try
        {
            if (editingBlog)
            {
                const fd = buildFormData(editingBlog.id);
                await blogApi.updateBlog(editingBlog.id, fd);
                showToast("Blog updated successfully", "success");
            } else
            {
                const fd = buildFormData(null);
                await blogApi.createBlog(fd);
                showToast("Blog created successfully", "success");
            }
            setShowModal(false);
            resetForm();
            loadBlogs();
        } catch (error)
        {
            const msg =
                error?.response?.data?.message ||
                (typeof error?.response?.data === "string" ? error.response.data : null) ||
                error?.message ||
                "Operation failed";
            showToast(msg, "error");
        }
    };

    const handleDelete = async (id) =>
    {
        if (!window.confirm("Delete this blog?")) return;
        try
        {
            await blogApi.deleteBlog(id);
            showToast("Blog deleted successfully", "success");
            loadBlogs();
        } catch
        {
            showToast("Error deleting blog", "error");
        }
    };

    useEffect(() =>
    {
        loadBlogs();
    }, []);

    const loadBlogs = async () =>
    {
        try
        {
            const res = await blogApi.getAllBlogs();
            setBlogs(res.data ?? []);
        } catch
        {
            showToast("Error loading blogs", "error");
        } finally
        {
            setLoading(false);
        }
    };

    const shortText = (t, n = 100) =>
    {
        if (!t) return "";
        return t.length > n ? t.slice(0, n) + "..." : t;
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>Blogs</h2>

                <button className="btn btn-primary" onClick={openCreate}>
                    + Add Blog
                </button>

            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Preview</th>
                                <th>Comments</th>
                                <th style={{ width: 100 }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {blogs.map((b) =>
                            {
                                const imgPath = b.imagePath ?? b.imageUrl;

                                return (
                                    <tr key={b.id}>
                                        <td>
                                            {imgPath ? (
                                                <img
                                                    src={buildImgUrl(imgPath)}
                                                    alt={b.title}
                                                    style={{
                                                        width: "70px",
                                                        height: "45px",
                                                        objectFit: "cover",
                                                        borderRadius: "6px",
                                                    }}
                                                />
                                            ) : (
                                                "No image"
                                            )}
                                        </td>

                                        <td>{b.title}</td>
                                        <td>{b.author}</td>
                                        <td>{b.category}</td>

                                        <td style={{ maxWidth: 300 }}>
                                            {shortText(b.content, 20)}
                                        </td>

                                        <td>{b.commentCount}</td>

                                        <td>
                                            <div className="flex gap-sm">
                                                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/blogs/${b.id}`)}>
                                                    View
                                                </button>
                                                <button className="btn btn-secondary btn-sm" onClick={() => openEdit(b)}>
                                                    Edit
                                                </button>
                                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(b.id)}>
                                                    Delete
                                                </button>
                                            </div>

                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </div>
            <Modal
                isOpen={showModal}
                onClose={() =>
                {
                    setShowModal(false);
                    resetForm();
                }}
                title={editingBlog ? "Edit Blog" : "Add New Blog"}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            className="form-input"
                            value={formState.title}
                            onChange={(e) => setFormState((p) => ({ ...p, title: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Author</label>
                        <input
                            className="form-input"
                            value={formState.author}
                            onChange={(e) => setFormState((p) => ({ ...p, author: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Category</label>
                        <input
                            className="form-input"
                            value={formState.category}
                            onChange={(e) => setFormState((p) => ({ ...p, category: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content</label>
                        <textarea
                            className="form-input"
                            rows={6}
                            value={formState.content}
                            onChange={(e) => setFormState((p) => ({ ...p, content: e.target.value }))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Image (optional){editingBlog ? " — seçməsən köhnə şəkil qalacaq" : ""}
                        </label>
                        <input
                            type="file"
                            onChange={(e) =>
                                setFormState((p) => ({ ...p, imageFile: e.target.files?.[0] ?? null }))
                            }
                        />
                    </div>

                    <div className="flex gap-md justify-between mt-lg">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() =>
                            {
                                setShowModal(false);
                                resetForm();
                            }}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {editingBlog ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default BlogList;



// import React, { useEffect, useState } from "react";
// import { blogApi } from "../../api/blogApi";
// import { useToast } from "../../components/common/Toast";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import Modal from "../../components/common/Modal";

// const API_ORIGIN = "http://localhost:5151";

// const buildImgUrl = (path) =>
// {
//     if (!path) return "";
//     if (path.startsWith("http")) return path;
//     const fixed = path.startsWith("/") ? path : `/${path}`;
//     return `${API_ORIGIN}${fixed}`;
// };

// const BlogList = () =>
// {
//     const { showToast, ToastComponent } = useToast();

//     const [blogs, setBlogs] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showModal, setShowModal] = useState(false);
//     const [editingItem, setEditingItem] = useState(null);

//     const [formState, setFormState] = useState({
//         title: "",
//         content: "",
//         author: "",
//         category: "",
//         imageFile: null,
//     });

//     useEffect(() =>
//     {
//         loadBlogs();
//     }, []);

//     const loadBlogs = async () =>
//     {
//         try
//         {
//             const res = await blogApi.getAllBlogs();
//             setBlogs(res.data ?? []);
//         } catch
//         {
//             showToast("Error loading blogs", "error");
//         } finally
//         {
//             setLoading(false);
//         }
//     };

//     const resetForm = () =>
//     {
//         setFormState({
//             title: "",
//             content: "",
//             author: "",
//             category: "",
//             imageFile: null,
//         });
//         setEditingItem(null);
//     };

//     const openCreate = () =>
//     {
//         resetForm();
//         setShowModal(true);
//     };

//     const openEdit = (blog) =>
//     {
//         setEditingItem(blog);
//         setFormState({
//             title: blog.title ?? "",
//             content: blog.content ?? "",
//             author: blog.author ?? "",
//             category: blog.category ?? "",
//             imageFile: null,
//         });
//         setShowModal(true);
//     };

//     const buildFormData = (id) =>
//     {
//         const fd = new FormData();

//         if (id != null) fd.append("Id", String(id));

//         fd.append("Title", formState.title);
//         fd.append("Content", formState.content);
//         fd.append("Author", formState.author);
//         fd.append("Category", formState.category);

//         if (formState.imageFile)
//         {
//             fd.append("ImagePath", formState.imageFile); // backend-də property adı nədirsə o olmalıdır
//         }

//         return fd;
//     };

//     const handleSubmit = async (e) =>
//     {
//         e.preventDefault();

//         try
//         {
//             if (editingItem)
//             {
//                 const fd = buildFormData(editingItem.id);
//                 await blogApi.updateBlog(editingItem.id, fd);
//                 showToast("Blog updated successfully", "success");
//             } else
//             {
//                 const fd = buildFormData(null);
//                 await blogApi.createBlog(fd);
//                 showToast("Blog created successfully", "success");
//             }

//             setShowModal(false);
//             resetForm();
//             loadBlogs();
//         } catch (error)
//         {
//             const msg =
//                 error?.response?.data?.message ||
//                 (typeof error?.response?.data === "string" ? error.response.data : null) ||
//                 error?.message ||
//                 "Operation failed";

//             showToast(msg, "error");
//         }
//     };

//     const handleDelete = async (id) =>
//     {
//         if (!window.confirm("Delete this blog?")) return;

//         try
//         {
//             await blogApi.deleteBlog(id);
//             showToast("Deleted successfully", "success");
//             loadBlogs();
//         } catch
//         {
//             showToast("Error deleting blog", "error");
//         }
//     };

//     const shortText = (text, n = 80) =>
//     {
//         if (!text) return "";
//         return text.length > n ? text.slice(0, n) + "..." : text;
//     };

//     if (loading) return <LoadingSpinner fullScreen />;

//     return (
//         <div>
//             {ToastComponent}

//             <div className="flex justify-between items-center mb-xl">
//                 <h2>Blog Management</h2>
//                 <button className="btn btn-primary" onClick={openCreate}>
//                     + Add Blog
//                 </button>
//             </div>

//             <div className="card">
//                 <div className="table-container">
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>Image</th>
//                                 <th>Title</th>
//                                 <th>Author</th>
//                                 <th>Category</th>
//                                 <th>Preview</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>

//                         <tbody>
//                             {blogs.map((b) => (
//                                 <tr key={b.id}>
//                                     <td>
//                                         {b.imagePath ? (
//                                             <img
//                                                 src={buildImgUrl(b.imagePath)}
//                                                 alt={b.title}
//                                                 style={{
//                                                     width: "70px",
//                                                     height: "45px",
//                                                     objectFit: "cover",
//                                                     borderRadius: "6px",
//                                                 }}
//                                             />
//                                         ) : (
//                                             "No Image"
//                                         )}
//                                     </td>

//                                     <td>{b.title}</td>
//                                     <td>{b.author}</td>
//                                     <td>{b.category}</td>

//                                     <td style={{ maxWidth: 300 }}>
//                                         {shortText(b.content)}
//                                     </td>

//                                     <td>
//                                         <div className="flex gap-sm">
//                                             <button
//                                                 className="btn btn-secondary btn-sm"
//                                                 onClick={() => openEdit(b)}
//                                             >
//                                                 Edit
//                                             </button>

//                                             <button
//                                                 className="btn btn-danger btn-sm"
//                                                 onClick={() => handleDelete(b.id)}
//                                             >
//                                                 Delete
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>

//                     </table>
//                 </div>
//             </div>

//             <Modal
//                 isOpen={showModal}
//                 onClose={() =>
//                 {
//                     setShowModal(false);
//                     resetForm();
//                 }}
//                 title={editingItem ? "Edit Blog" : "Add Blog"}
//             >
//                 <form onSubmit={handleSubmit}>
//                     <div className="form-group">
//                         <label className="form-label">Title</label>
//                         <input
//                             className="form-input"
//                             value={formState.title}
//                             onChange={(e) =>
//                                 setFormState({ ...formState, title: e.target.value })
//                             }
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Author</label>
//                         <input
//                             className="form-input"
//                             value={formState.author}
//                             onChange={(e) =>
//                                 setFormState({ ...formState, author: e.target.value })
//                             }
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Category</label>
//                         <input
//                             className="form-input"
//                             value={formState.category}
//                             onChange={(e) =>
//                                 setFormState({ ...formState, category: e.target.value })
//                             }
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">Content</label>
//                         <textarea
//                             className="form-input"
//                             rows={6}
//                             value={formState.content}
//                             onChange={(e) =>
//                                 setFormState({ ...formState, content: e.target.value })
//                             }
//                             required
//                         />
//                     </div>

//                     <div className="form-group">
//                         <label className="form-label">
//                             Image (optional){editingItem ? " — seçməsən köhnə şəkil qalacaq" : ""}
//                         </label>
//                         <input
//                             type="file"
//                             onChange={(e) =>
//                                 setFormState({
//                                     ...formState,
//                                     imageFile: e.target.files?.[0] ?? null,
//                                 })
//                             }
//                         />
//                     </div>

//                     <div className="flex gap-md justify-between mt-lg">
//                         <button
//                             type="button"
//                             className="btn btn-secondary"
//                             onClick={() =>
//                             {
//                                 setShowModal(false);
//                                 resetForm();
//                             }}
//                         >
//                             Cancel
//                         </button>

//                         <button type="submit" className="btn btn-primary">
//                             {editingItem ? "Update" : "Create"}
//                         </button>
//                     </div>
//                 </form>
//             </Modal>
//         </div>
//     );
// };

// export default BlogList;
