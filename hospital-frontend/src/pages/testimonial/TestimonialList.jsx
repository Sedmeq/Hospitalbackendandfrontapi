import React, { useEffect, useState } from "react";
import { testimonialApi } from "../../api/testimonialApi";
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

const TestimonialList = () =>
{
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { showToast, ToastComponent } = useToast();

    const [formState, setFormState] = useState({
        fullName: "",
        title: "",
        comment: "",
        imageFile: null,
    });

    useEffect(() =>
    {
        loadTestimonials();
    }, []);

    const loadTestimonials = async () =>
    {
        try
        {
            const res = await testimonialApi.getAllTestimonials();
            setTestimonials(res.data ?? []);
        } catch (e)
        {
            showToast("Error loading testimonials", "error");
        } finally
        {
            setLoading(false);
        }
    };

    const resetForm = () =>
    {
        setFormState({
            fullName: "",
            title: "",
            comment: "",
            imageFile: null,
        });
        setEditingItem(null);
    };

    const buildFormData = (id) =>
    {
        const fd = new FormData();
        if (id) fd.append("Id", id);

        fd.append("FullName", formState.fullName);
        fd.append("Title", formState.title);
        fd.append("Comment", formState.comment);

        if (formState.imageFile)
        {
            fd.append("ImageUrl", formState.imageFile);
        }

        return fd;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        try
        {
            if (editingItem)
            {
                const fd = buildFormData(editingItem.id);
                await testimonialApi.updateTestimonial(editingItem.id, fd);
                showToast("Updated successfully", "success");
            } else
            {
                const fd = buildFormData(null);
                await testimonialApi.createTestimonial(fd);
                showToast("Created successfully", "success");
            }

            setShowModal(false);
            resetForm();
            loadTestimonials();
        } catch (error)
        {
            const msg =
                error?.response?.data ||
                error?.response?.data?.message ||
                "Operation failed";
            showToast(msg, "error");
        }
    };

    const handleDelete = async (id) =>
    {
        if (!window.confirm("Delete this testimonial?")) return;

        try
        {
            await testimonialApi.deleteTestimonial(id);
            showToast("Deleted successfully", "success");
            loadTestimonials();
        } catch
        {
            showToast("Error deleting", "error");
        }
    };

    const handleEdit = (item) =>
    {
        setEditingItem(item);
        setFormState({
            fullName: item.fullName,
            title: item.title,
            comment: item.comment,
            imageFile: null,
        });
        setShowModal(true);
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>Testimonial Management</h2>
                <button className="btn btn-primary" onClick={() =>
                {
                    resetForm();
                    setShowModal(true);
                }}>
                    + Add Testimonial
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Title</th>
                                <th>Comment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {testimonials.map((t) => (
                                <tr key={t.id}>
                                    <td>
                                        {t.imageUrl ? (
                                            <img
                                                src={buildImgUrl(t.imageUrl)}
                                                alt={t.fullName}
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "50%",
                                                }}
                                            />
                                        ) : (
                                            "No Image"
                                        )}
                                    </td>
                                    <td>{t.fullName}</td>
                                    <td>{t.title}</td>
                                    <td style={{ maxWidth: 300 }}>
                                        {t.comment?.length > 80
                                            ? t.comment.slice(0, 80) + "..."
                                            : t.comment}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm me-2"
                                            onClick={() => handleEdit(t)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(t.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
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
                title={editingItem ? "Edit Testimonial" : "Add Testimonial"}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-input"
                            value={formState.fullName}
                            onChange={(e) =>
                                setFormState({ ...formState, fullName: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            value={formState.title}
                            onChange={(e) =>
                                setFormState({ ...formState, title: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Comment</label>
                        <textarea
                            name="comment"
                            className="form-input"
                            rows={5}
                            value={formState.comment}
                            onChange={(e) =>
                                setFormState({ ...formState, comment: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Image (optional){editingItem ? " — seçməsən köhnə şəkil qalacaq" : ""}
                        </label>
                        <input type="file" onChange={(e) =>
                            setFormState({ ...formState, imageFile: e.target.files?.[0] ?? null })
                        } />
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
                            {editingItem ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

        </div>
    );
};

export default TestimonialList;
