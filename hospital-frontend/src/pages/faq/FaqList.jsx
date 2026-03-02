import React, { useEffect, useState } from "react";
import { faqApi } from "../../api/faqApi";
import { useToast } from "../../components/common/Toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Modal from "../../components/common/Modal";

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { showToast, ToastComponent } = useToast();

  const [formState, setFormState] = useState({
    Question: "",
    Answer: "",
    IsActive: true,
    Order: 0,
  });

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const res = await faqApi.getAllFaqs();
      setFaqs(res.data ?? []);
    } catch {
      showToast("Error loading FAQs", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormState({
      Question: "",
      Answer: "",
      IsActive: true,
      Order: 0,
    });
    setEditingItem(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        Question: formState.Question,
        Answer: formState.Answer,
        IsActive: !!formState.IsActive,
        Order: Number(formState.Order) || 0,
      };

      if (editingItem) {
        await faqApi.updateFaq(editingItem.id, payload);
        showToast("Updated successfully", "success");
      } else {
        // CreateFaqCommand-də Id yoxdursa problem deyil (backend ignore edəcək)
        await faqApi.createFaq(payload);
        showToast("Created successfully", "success");
      }

      setShowModal(false);
      resetForm();
      loadFaqs();
    } catch (error) {
      const msg =
        error?.response?.data ||
        error?.response?.data?.message ||
        "Operation failed";
      showToast(msg, "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this FAQ?")) return;

    try {
      await faqApi.deleteFaq(id);
      showToast("Deleted successfully", "success");
      loadFaqs();
    } catch {
      showToast("Error deleting", "error");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormState({
      Question: item.question ?? item.Question ?? "",
      Answer: item.answer ?? item.Answer ?? "",
      IsActive: item.isActive ?? item.IsActive ?? true,
      Order: item.order ?? item.Order ?? 0,
    });
    setShowModal(true);
  };

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div>
      {ToastComponent}

      <div className="flex justify-between items-center mb-xl">
        <h2>FAQ Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        >
          + Add FAQ
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: 90 }}>Order</th>
                <th style={{ width: 110 }}>Active</th>
                <th>Question</th>
                <th>Answer</th>
                <th style={{ width: 180 }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {faqs.map((f) => {
                const id = f.id ?? f.Id;
                const question = f.question ?? f.Question;
                const answer = f.answer ?? f.Answer;
                const isActive = f.isActive ?? f.IsActive;
                const order = f.order ?? f.Order;

                return (
                  <tr key={id}>
                    <td>{order}</td>
                    <td>
                      <span className={`badge ${isActive ? "badge-success" : "badge-danger"}`}>
                        {isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td style={{ maxWidth: 350 }}>
                      {question?.length > 80 ? question.slice(0, 80) + "..." : question}
                    </td>
                    <td style={{ maxWidth: 450 }}>
                      {answer?.length > 100 ? answer.slice(0, 100) + "..." : answer}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm me-2"
                        onClick={() => handleEdit(f)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {faqs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center text-muted">
                    FAQ yoxdur.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingItem ? "Edit FAQ" : "Add FAQ"}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Question</label>
            <input
              type="text"
              className="form-input"
              value={formState.Question}
              onChange={(e) => setFormState({ ...formState, Question: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Answer</label>
            <textarea
              className="form-input"
              rows={5}
              value={formState.Answer}
              onChange={(e) => setFormState({ ...formState, Answer: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Order</label>
            <input
              type="number"
              className="form-input"
              value={formState.Order}
              onChange={(e) => setFormState({ ...formState, Order: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Is Active</label>
            <div className="flex items-center gap-md">
              <input
                type="checkbox"
                checked={!!formState.IsActive}
                onChange={(e) => setFormState({ ...formState, IsActive: e.target.checked })}
              />
              <span>{formState.IsActive ? "Active" : "Inactive"}</span>
            </div>
          </div>

          <div className="flex gap-md justify-between mt-lg">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
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

export default FaqList;