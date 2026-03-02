import React, { useEffect, useState } from "react";
import { serviceApi } from "../../api/serviceApi";
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

const ServiceList = () =>
{
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);

    const { showToast, ToastComponent } = useToast();

    const [formState, setFormState] = useState({
        title: "",
        description: "",
        imageFile: null,
    });

    useEffect(() =>
    {
        loadServices();
    }, []);

    const loadServices = async () =>
    {
        try
        {
            const res = await serviceApi.getAllServices();
            setServices(res.data ?? []);
        } catch (e)
        {
            showToast("Error loading services", "error");
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
        setEditingService(null);
    };

    const openCreate = () =>
    {
        resetForm();
        setShowModal(true);
    };

    const openEdit = (s) =>
    {
        setEditingService(s);
        setFormState({
            title: s?.title ?? "",
            description: s?.description ?? "",
            imageFile: null,
        });
        setShowModal(true);
    };

    const buildFormData = (id) =>
    {
        const fd = new FormData();

        // Update üçün Id MÜTLƏQ (UpdateServiceCommand-da Id var)
        if (id != null) fd.append("Id", String(id));

        fd.append("Title", formState.title ?? "");
        fd.append("Description", formState.description ?? "");

        // file property adı: Image
        if (formState.imageFile)
        {
            fd.append("Image", formState.imageFile);
        }

        return fd;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        try
        {
            if (editingService)
            {
                const fd = buildFormData(editingService.id);
                await serviceApi.updateService(editingService.id, fd);
                showToast("Service updated successfully", "success");
            } else
            {
                const fd = buildFormData(null);
                await serviceApi.createService(fd);
                showToast("Service created successfully", "success");
            }

            setShowModal(false);
            resetForm();
            loadServices();
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
        if (!window.confirm("Are you sure you want to delete this service?")) return;

        try
        {
            await serviceApi.deleteService(id);
            showToast("Service deleted successfully", "success");
            loadServices();
        } catch (e)
        {
            showToast("Error deleting service", "error");
        }
    };

    const handleChange = (e) =>
    {
        setFormState((p) => ({ ...p, [e.target.name]: e.target.value }));
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
                <h2>Service Management</h2>
                <button className="btn btn-primary" onClick={openCreate}>
                    + Add Service
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th style={{ width: 160 }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {(services ?? []).map((s) => (
                                <tr key={s.id}>
                                    <td>
                                        {s.imagePath ? (
                                            <img
                                                src={buildImgUrl(s.imagePath)}
                                                alt={s.title}
                                                style={{
                                                    width: "70px",
                                                    height: "50px",
                                                    objectFit: "cover",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                        ) : (
                                            <span className="badge badge-secondary">No image</span>
                                        )}
                                    </td>


                                    <td>{s.title}</td>

                                    <td style={{ maxWidth: 420 }}>
                                        {s.description?.length > 110
                                            ? s.description.slice(0, 110) + "..."
                                            : s.description}
                                    </td>

                                    <td>
                                        <div className="flex gap-sm">
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={() => openEdit(s)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(s.id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!services || services.length === 0) && (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "1rem" }}>
                                        No services found
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
                title={editingService ? "Edit Service" : "Add New Service"}
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
                            Image (optional){editingService ? " — seçməsən köhnə şəkil qalacaq" : ""}
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
                            {editingService ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ServiceList;
