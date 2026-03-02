import React, { useEffect, useMemo, useState } from "react";
import { contactApi } from "../../api/ContactApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";

const ContactList = () =>
{
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [viewItem, setViewItem] = useState(null);

    const { showToast, ToastComponent } = useToast();

    useEffect(() =>
    {
        loadContacts();
    }, []);

    const loadContacts = async () =>
    {
        try
        {
            const res = await contactApi.getAllContacts();
            setContacts(res.data ?? []);
        } catch (e)
        {
            showToast("Error loading contacts", "error");
        } finally
        {
            setLoading(false);
        }
    };

    const handleDelete = async (id) =>
    {
        if (!window.confirm("Delete this contact?")) return;

        try
        {
            await contactApi.deleteContact(id);
            showToast("Deleted successfully", "success");
            setShowModal(false);
            setViewItem(null);
            loadContacts();
        } catch
        {
            showToast("Error deleting", "error");
        }
    };

    const openView = (item) =>
    {
        setViewItem(item);
        setShowModal(true);
    };

    const closeView = () =>
    {
        setShowModal(false);
        setViewItem(null);
    };

    const formatDate = (value) =>
    {
        if (!value) return "-";
        const d = new Date(value);
        if (Number.isNaN(d.getTime())) return value;
        return d.toLocaleString();
    };

    const truncate = (text, len = 60) =>
    {
        if (!text) return "";
        return text.length > len ? text.slice(0, len) + "..." : text;
    };

    const sortedContacts = useMemo(() =>
    {
        // createdAt-a görə sonuncular üstə (əgər date parse olursa)
        return [...contacts].sort((a, b) =>
        {
            const da = new Date(a.createdAt).getTime();
            const db = new Date(b.createdAt).getTime();
            if (Number.isNaN(da) || Number.isNaN(db)) return 0;
            return db - da;
        });
    }, [contacts]);

    if (loading) return <LoadingSpinner fullScreen />;

    return (
        <div>
            {ToastComponent}

            <div className="flex justify-between items-center mb-xl">
                <h2>Contact Messages</h2>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: 70 }}>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Subject</th>
                                <th>Phone</th>
                                <th>Message</th>
                                <th style={{ width: 180 }}>Date</th>
                                <th style={{ width: 170 }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedContacts.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.id}</td>
                                    <td>{c.name}</td>
                                    <td>{c.email}</td>
                                    <td>{c.subject}</td>
                                    <td>{c.phone}</td>
                                    <td style={{ maxWidth: 320 }}>
                                        {truncate(c.message, 25)}
                                    </td>
                                    <td>{formatDate(c.createdAt)}</td>
                                    <td>
                                        <button
                                            className="btn btn-secondary btn-sm me-2"
                                            onClick={() => openView(c)}
                                        >
                                            View
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(c.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {sortedContacts.length === 0 && (
                                <tr>
                                    <td colSpan={8} style={{ padding: 16, textAlign: "center" }}>
                                        No contact messages found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={showModal}
                onClose={closeView}
                title={viewItem ? `Contact #${viewItem.id}` : "Contact Details"}
            >
                {!viewItem ? (
                    <div>Loading...</div>
                ) : (
                    <div style={{ display: "grid", gap: 12 }}>
                        <div className="card" style={{ padding: 12 }}>
                            <div style={{ display: "grid", gap: 6 }}>
                                <div><b>Name:</b> {viewItem.name}</div>
                                <div><b>Email:</b> {viewItem.email}</div>
                                <div><b>Subject:</b> {viewItem.subject}</div>
                                <div><b>Phone:</b> {viewItem.phone}</div>
                                <div><b>Date:</b> {formatDate(viewItem.createdAt)}</div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 12 }}>
                            <div style={{ marginBottom: 6 }}><b>Message</b></div>
                            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                                {viewItem.message}
                            </div>
                        </div>

                        <div className="flex gap-md justify-between mt-lg">
                            <button type="button" className="btn btn-secondary" onClick={closeView}>
                                Close
                            </button>

                            <button
                                type="button"
                                className="btn btn-danger"
                                onClick={() => handleDelete(viewItem.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ContactList;
