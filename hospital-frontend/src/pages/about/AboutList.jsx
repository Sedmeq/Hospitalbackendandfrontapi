import React, { useEffect, useState } from "react";
import { aboutApi } from "../../api/aboutApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";

const API_ORIGIN = "http://localhost:5151"; // backend origin (api olmayan hissə)

const buildImgUrl = (path) =>
{
    if (!path) return "";
    // əgər artıq tam URL-dirsə toxunma
    if (path.startsWith("http")) return path;
    // "images/.." gəlirsə -> "/images/.."
    const fixed = path.startsWith("/") ? path : `/${path}`;
    return `${API_ORIGIN}${fixed}`;
};


const AboutList = () =>
{
    const [abouts, setAbouts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingAbout, setEditingAbout] = useState(null);

    const { showToast, ToastComponent } = useToast();

    // UI state (serverə göndərməzdən əvvəl)
    const [formState, setFormState] = useState({
        title: "",
        description: "",
        imageFile: null, // file
    });

    useEffect(() =>
    {
        loadAbouts();
    }, []);

    const loadAbouts = async () =>
    {
        try
        {
            const res = await aboutApi.getAllAbouts();
            // backend array qaytarırsa
            setAbouts(res.data ?? []);
        } catch (e)
        {
            showToast("Error loading abouts", "error");
        } finally
        {
            setLoading(false);
        }
    };

    const resetForm = () =>
    {
        setFormState({
            title: "",
            description: "",
            imageFile: null,
        });
        setEditingAbout(null);
    };

    const openCreate = () =>
    {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (about) =>
    {
        setEditingAbout(about);

        setFormState({
            title: about?.title ?? "",
            description: about?.description ?? "",
            imageFile: null, // edit edəndə file seçməsə, köhnə qalmalıdır (backend logic-dən asılı)
        });

        setShowModal(true);
    };

    // React state -> multipart FormData
    const buildFormData = (id) =>
    {
        const fd = new FormData();

        // backend property adları: Title, Description, ImageUrl
        if (id != null) fd.append("Id", String(id)); // Update üçün MÜTLƏQ
        fd.append("Title", formState.title ?? "");
        fd.append("Description", formState.description ?? "");

        if (formState.imageFile)
        {
            fd.append("ImageUrl", formState.imageFile); // CreateAboutCommand.ImageUrl
        }

        return fd;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        try
        {
            if (editingAbout)
            {
                const fd = buildFormData(editingAbout.id);
                await aboutApi.updateAbout(editingAbout.id, fd);
                showToast("About updated successfully", "success");
            } else
            {
                const fd = buildFormData(null);
                await aboutApi.createAbout(fd);
                showToast("About created successfully", "success");
            }

            setShowModal(false);
            resetForm();
            loadAbouts();
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
        if (!window.confirm("Are you sure you want to delete this about?")) return;

        try
        {
            await aboutApi.deleteAbout(id);
            showToast("About deleted successfully", "success");
            loadAbouts();
        } catch (e)
        {
            showToast("Error deleting about", "error");
        }
    };

    const handleChange = (e) =>
    {
        setFormState((p) => ({
            ...p,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = (e) =>
    {
        const file = e.target.files?.[0] ?? null;
        setFormState((p) => ({ ...p, imageFile: file }));
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>About Management</h2>
                <button className="btn btn-primary" onClick={openCreate}>
                    + Add About
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Image</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(abouts ?? []).map((a) => (
                                <tr key={a.id}>
                                    <td>{a.title}</td>

                                    <td style={{ maxWidth: 420 }}>
                                        {/* çox uzundursa qısalt */}
                                        {a.description?.length > 120
                                            ? a.description.slice(0, 120) + "..."
                                            : a.description}
                                    </td>

                                    <td>
                                        {a.imageUrl ? (
                                            <img
                                                src={buildImgUrl(a.imageUrl)}
                                                alt={a.title}
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    objectFit: "cover",
                                                    borderRadius: "6px",
                                                }}
                                                onError={(e) =>
                                                {
                                                    e.currentTarget.style.display = "none";
                                                }}
                                            />
                                        ) : (
                                            <span className="badge badge-secondary">No image</span>
                                        )}
                                    </td>


                                    <td>
                                        <div className="flex gap-sm">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => openEdit(a)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(a.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!abouts || abouts.length === 0) && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                                        No about records found
                                    </td>
                                </tr>
                            )}
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
                title={editingAbout ? "Edit About" : "Add New About"}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            name="title"
                            className="form-input"
                            value={formState.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            name="description"
                            className="form-input"
                            rows={5}
                            value={formState.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Image (optional)
                            {editingAbout ? " — seçməsən köhnə şəkil qalacaq" : ""}
                        </label>
                        <input type="file" onChange={handleFileChange} />
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
                            {editingAbout ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};



export default AboutList;
