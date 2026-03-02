import React, { useEffect, useState } from "react";
import { aboutSectionApi } from "../../api/aboutSectionApi";
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

const AboutList = () =>
{
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const { showToast, ToastComponent } = useToast();

    const [formState, setFormState] = useState({
        title: "",
        description: "",
        image1File: null,
        image2File: null,
        image3File: null,
    });

    useEffect(() =>
    {
        loadItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadItems = async () =>
    {
        try
        {
            setLoading(true);
            const res = await aboutSectionApi.getAllAboutSections();
            setItems(res.data ?? []);
        } catch (e)
        {
            showToast("Error loading about sections", "error");
        } finally
        {
            setLoading(false);
        }
    };

    const extractErrorMessage = (error) =>
    {
        const data = error?.response?.data;

        if (!data) return error?.message || "Operation failed";

        // stringdirsə
        if (typeof data === "string") return data;

        // { message: "..." }
        if (data.message && typeof data.message === "string") return data.message;

        // ASP.NET validation: { errors: { Field: ["msg1","msg2"] } }
        if (data.errors && typeof data.errors === "object")
        {
            const lines = Object.entries(data.errors).flatMap(([field, msgs]) =>
                (Array.isArray(msgs) ? msgs : [String(msgs)]).map((m) => `${field}: ${m}`)
            );
            return lines.join("\n");
        }

        // fallback
        try
        {
            return JSON.stringify(data);
        } catch
        {
            return "Operation failed";
        }
    };


    const resetForm = () =>
    {
        setFormState({
            title: "",
            description: "",
            image1File: null,
            image2File: null,
            image3File: null,
        });
        setEditingItem(null);
    };

    // ✅ BACKEND COMMAND FIELD ADLARI İLƏ EYNİ: Title, Description, Image1, Image2, Image3
    const buildFormData = (id) =>
    {
        const fd = new FormData();
        if (id) fd.append("Id", id);

        fd.append("Title", formState.title);
        fd.append("Description", formState.description);

        if (formState.image1File) fd.append("Image1", formState.image1File);
        if (formState.image2File) fd.append("Image2", formState.image2File);
        if (formState.image3File) fd.append("Image3", formState.image3File);

        return fd;
    };

    const handleSubmit = async (e) =>
    {
        e.preventDefault();

        // sadə validation
        if (!formState.title.trim())
        {
            showToast("Title is required", "error");
            return;
        }
        if (!formState.description.trim())
        {
            showToast("Description is required", "error");
            return;
        }

        try
        {
            if (editingItem)
            {
                const fd = buildFormData(editingItem.id);
                await aboutSectionApi.updateAboutSection(editingItem.id, fd);
                showToast("Updated successfully", "success");
            } else
            {
                const fd = buildFormData(null);
                await aboutSectionApi.createAboutSection(fd);
                showToast("Created successfully", "success");
            }

            setShowModal(false);
            resetForm();
            loadItems();
            // } catch (error)
            // {
            //     const msg =
            //         error?.response?.data ||
            //         error?.response?.data?.message ||
            //         "Operation failed";
            //     showToast(msg, "error");
            // }
        } catch (error)
        {
            showToast(extractErrorMessage(error), "error");
        }

    };

    const handleDelete = async (id) =>
    {
        if (!window.confirm("Delete this about section?")) return;

        try
        {
            await aboutSectionApi.deleteAboutSection(id);
            showToast("Deleted successfully", "success");
            loadItems();
        } catch
        {
            showToast("Error deleting", "error");
        }
    };

    const handleEdit = (item) =>
    {
        setEditingItem(item);
        setFormState({
            title: item.title ?? "",
            description: item.description ?? "",
            image1File: null,
            image2File: null,
            image3File: null,
        });
        setShowModal(true);
    };

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>About Section Management</h2>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                    {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    + Add About Section
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Image 1</th>
                                <th>Image 2</th>
                                <th>Image 3</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th style={{ width: 160 }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((x) => (
                                <tr key={x.id}>
                                    <td>
                                        {x.image1 ? (
                                            <img
                                                src={buildImgUrl(x.image1)}
                                                alt="img1"
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                }}
                                            />
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    <td>
                                        {x.image2 ? (
                                            <img
                                                src={buildImgUrl(x.image2)}
                                                alt="img2"
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                }}
                                            />
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    <td>
                                        {x.image3 ? (
                                            <img
                                                src={buildImgUrl(x.image3)}
                                                alt="img3"
                                                style={{
                                                    width: 60,
                                                    height: 60,
                                                    objectFit: "cover",
                                                    borderRadius: 8,
                                                }}
                                            />
                                        ) : (
                                            "—"
                                        )}
                                    </td>

                                    <td>{x.title}</td>

                                    <td style={{ maxWidth: 360 }}>
                                        {x.description?.length > 90
                                            ? x.description.slice(0, 90) + "..."
                                            : x.description}
                                    </td>

                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm me-2"
                                            onClick={() => handleEdit(x)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(x.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {items.length === 0 && (
                                <tr>
                                    <td colSpan={6}>No data</td>
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
                title={editingItem ? "Edit About Section" : "Add About Section"}
            >
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formState.title}
                            onChange={(e) =>
                                setFormState({ ...formState, title: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="form-input"
                            rows={6}
                            value={formState.description}
                            onChange={(e) =>
                                setFormState({ ...formState, description: e.target.value })
                            }
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Image 1 (optional){editingItem ? " — seçməsən köhnə şəkil qalacaq" : ""}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFormState({
                                    ...formState,
                                    image1File: e.target.files?.[0] ?? null,
                                })
                            }
                        />
                        {editingItem?.image1 && (
                            <div style={{ marginTop: 8 }}>
                                <small>Current:</small>
                                <div>
                                    <img
                                        src={buildImgUrl(editingItem.image1)}
                                        alt="current img1"
                                        style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 8 }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Image 2 (optional){editingItem ? " — seçməsən köhnə şəkil qalacaq" : ""}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFormState({
                                    ...formState,
                                    image2File: e.target.files?.[0] ?? null,
                                })
                            }
                        />
                        {editingItem?.image2 && (
                            <div style={{ marginTop: 8 }}>
                                <small>Current:</small>
                                <div>
                                    <img
                                        src={buildImgUrl(editingItem.image2)}
                                        alt="current img2"
                                        style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 8 }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Image 3 (optional){editingItem ? " — seçməsən köhnə şəkil qalacaq" : ""}
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setFormState({
                                    ...formState,
                                    image3File: e.target.files?.[0] ?? null,
                                })
                            }
                        />
                        {editingItem?.image3 && (
                            <div style={{ marginTop: 8 }}>
                                <small>Current:</small>
                                <div>
                                    <img
                                        src={buildImgUrl(editingItem.image3)}
                                        alt="current img3"
                                        style={{ width: 90, height: 60, objectFit: "cover", borderRadius: 8 }}
                                    />
                                </div>
                            </div>
                        )}
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

export default AboutList;
