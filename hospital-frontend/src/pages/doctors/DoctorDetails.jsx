import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import { useToast } from "../../components/common/Toast";
import Modal from "../../components/common/Modal";

import { doctorApi } from "../../api/doctorApi";
import { doctorScheduleApi } from "../../api/doctorScheduleApi";
import { doctorSkillApi } from "../../api/doctorSkillApi";
import { doctorEducationApi } from "../../api/doctorEducationApi";

const API_BASE = "http://localhost:5151";
const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/")) return `${API_BASE}${path}`;
  return `${API_BASE}/${path}`;
};

const DoctorDetails = () => {
  const { id } = useParams();
  const doctorId = Number(id);

  const navigate = useNavigate();
  const { showToast, ToastComponent } = useToast();

  const [loading, setLoading] = useState(true);

  const [doctor, setDoctor] = useState(null);
  const [educations, setEducations] = useState([]);
  const [skills, setSkills] = useState([]);
  const [schedules, setSchedules] = useState([]);

  // ===== Skills =====
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [savingSkill, setSavingSkill] = useState(false);
  const [skillForm, setSkillForm] = useState({ skillName: "", category: "" });

  // ===== Educations =====
  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState(null);
  const [savingEdu, setSavingEdu] = useState(false);
  const [eduForm, setEduForm] = useState({
    year: "",
    degree: "",
    institution: "",
    description: "",
  });

  // ===== Schedules =====
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "17:00",
    slotDurationMinutes: 30,
  });

  useEffect(() => {
    if (!doctorId) return;
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const loadSkills = async () => {
    const res = await doctorSkillApi.getSkillsByDoctorId(doctorId);
    setSkills(res.data || []);
  };

  const loadEducations = async () => {
    const res = await doctorEducationApi.getEducationsByDoctorId(doctorId);
    setEducations(res.data || []);
  };

  const loadSchedules = async () => {
    const res = await doctorScheduleApi.getSchedules(doctorId);
    setSchedules(res.data || []);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const doctorRes = await doctorApi.getDoctorWithDetails(doctorId);
      setDoctor(doctorRes.data);

      // ən stabil: hamısını ayrı endpoint-lərdən yığ
      await Promise.all([loadEducations(), loadSkills(), loadSchedules()]);
    } catch (e) {
      console.error("loadAll error:", e?.response?.status, e?.config?.url, e?.response?.data);
      showToast("Failed to load doctor details", "error");
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  // ===================== SKILL HANDLERS =====================
  const handleAddSkill = async (e) => {
    e.preventDefault();

    const name = skillForm.skillName.trim();
    if (!name) {
      showToast("Skill name is required", "error");
      return;
    }

    setSavingSkill(true);
    try {
      await doctorSkillApi.addSkill({
        DoctorId: doctorId,
        SkillName: name,
        Category: (skillForm.category || "").trim(),
      });

      showToast("Skill added", "success");
      setShowSkillModal(false);
      setSkillForm({ skillName: "", category: "" });
      await loadSkills();
    } catch (err) {
      console.error("add skill error:", err?.response?.data);
      showToast(err?.response?.data?.message || "Failed to add skill", "error");
    } finally {
      setSavingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Delete this skill?")) return;

    try {
      await doctorSkillApi.deleteSkill(skillId);
      showToast("Skill deleted", "success");
      await loadSkills();
    } catch (err) {
      console.error("delete skill error:", err?.response?.data);
      showToast("Failed to delete skill", "error");
    }
  };

  // ===================== EDUCATION HANDLERS =====================
  const openAddEducation = () => {
    setEditingEdu(null);
    setEduForm({ year: "", degree: "", institution: "", description: "" });
    setShowEduModal(true);
  };

  const openEditEducation = (edu) => {
    setEditingEdu(edu);
    setEduForm({
      year: edu.year || "",
      degree: edu.degree || "",
      institution: edu.institution || "",
      description: edu.description || "",
    });
    setShowEduModal(true);
  };

  const handleSaveEducation = async (e) => {
    e.preventDefault();

    if (!eduForm.year.trim() || !eduForm.degree.trim() || !eduForm.institution.trim()) {
      showToast("Year, Degree, Institution are required", "error");
      return;
    }

    setSavingEdu(true);
    try {
      if (editingEdu) {
        await doctorEducationApi.updateEducation(editingEdu.id, {
          Id: editingEdu.id,
          DoctorId: doctorId,
          Year: eduForm.year.trim(),
          Degree: eduForm.degree.trim(),
          Institution: eduForm.institution.trim(),
          Description: eduForm.description || "",
        });
        showToast("Education updated", "success");
      } else {
        await doctorEducationApi.addEducation({
          DoctorId: doctorId,
          Year: eduForm.year.trim(),
          Degree: eduForm.degree.trim(),
          Institution: eduForm.institution.trim(),
          Description: eduForm.description || "",
        });
        showToast("Education added", "success");
      }

      setShowEduModal(false);
      setEditingEdu(null);
      setEduForm({ year: "", degree: "", institution: "", description: "" });
      await loadEducations();
    } catch (err) {
      console.error("save education error:", err?.response?.data);
      showToast(err?.response?.data?.message || "Failed to save education", "error");
    } finally {
      setSavingEdu(false);
    }
  };

  const handleDeleteEducation = async (eduId) => {
    if (!window.confirm("Delete this education?")) return;

    try {
      await doctorEducationApi.deleteEducation(eduId);
      showToast("Education deleted", "success");
      await loadEducations();
    } catch (err) {
      console.error("delete education error:", err?.response?.data);
      showToast("Failed to delete education", "error");
    }
  };

  // ===================== SCHEDULE HANDLERS =====================
  const openAddSchedule = () => {
    setScheduleForm({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      slotDurationMinutes: 30,
    });
    setShowScheduleModal(true);
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();

    if (!scheduleForm.startTime || !scheduleForm.endTime) {
      showToast("Start/End time required", "error");
      return;
    }

    setSavingSchedule(true);
    try {
      await doctorScheduleApi.createSchedule({
        DoctorId: doctorId,
        DayOfWeek: Number(scheduleForm.dayOfWeek), // 0-6
        StartTime: scheduleForm.startTime,
        EndTime: scheduleForm.endTime,
        SlotDurationMinutes: Number(scheduleForm.slotDurationMinutes) || 30,
      });

      showToast("Schedule created", "success");
      setShowScheduleModal(false);
      await loadSchedules();
    } catch (err) {
      console.error("create schedule error:", err?.response?.data);
      showToast(err?.response?.data?.message || "Failed to create schedule", "error");
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    if (!window.confirm("Delete this schedule?")) return;

    try {
      await doctorScheduleApi.deleteSchedule(scheduleId);
      showToast("Schedule deleted", "success");
      await loadSchedules();
    } catch (err) {
      console.error("delete schedule error:", err?.response?.data);
      showToast("Failed to delete schedule", "error");
    }
  };

  // ===================== RENDER =====================
  if (loading) return <LoadingSpinner fullScreen />;

  if (!doctor) {
    return (
      <div>
        {ToastComponent}
        <p>Doctor not found.</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  const fullName = doctor.fullName || `${doctor.firstName || ""} ${doctor.lastName || ""}`.trim();

  return (
    <div>
      {ToastComponent}

      <div className="flex justify-between items-center mb-xl">
        <h2>Doctor Details</h2>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {/* Doctor main card */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <div>
            {doctor.imagePath ? (
              <img
                src={getImageUrl(doctor.imagePath)}
                alt={fullName}
                style={{
                  width: 160,
                  height: 160,
                  objectFit: "cover",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                }}
              />
            ) : (
              <div
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 12,
                  border: "1px dashed #ccc",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0.7,
                }}
              >
                No Image
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ marginTop: 0 }}>{fullName}</h3>

            <p>
              <b>Email:</b> {doctor.email || "-"}
            </p>
            <p>
              <b>Phone:</b> {doctor.phone || "-"}
            </p>
            <p>
              <b>Specialty:</b> {doctor.specialty || "-"}
            </p>
            <p>
              <b>DepartmentId:</b> {doctor.departmentId ?? "-"}
            </p>
            <p>
              <b>Biography:</b> {doctor.biography || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Educations */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="flex justify-between items-center mb-md">
          <h3 style={{ margin: 0 }}>Educations</h3>

          <button className="btn btn-primary btn-sm" onClick={openAddEducation}>
            + Add Education
          </button>
        </div>

        {educations.length === 0 ? (
          <p style={{ opacity: 0.75, margin: 0 }}>No education records.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Degree</th>
                  <th>Institution</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {educations.map((e) => (
                  <tr key={e.id}>
                    <td>{e.year || "-"}</td>
                    <td>{e.degree || "-"}</td>
                    <td>{e.institution || "-"}</td>
                    <td style={{ maxWidth: 520, whiteSpace: "pre-wrap" }}>{e.description || "-"}</td>
                    <td>
                      <div className="flex gap-sm">
                        <button className="btn btn-secondary btn-sm" onClick={() => openEditEducation(e)}>
                          Edit
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEducation(e.id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Education Modal */}
      <Modal
        isOpen={showEduModal}
        onClose={() => {
          setShowEduModal(false);
          setEditingEdu(null);
          setEduForm({ year: "", degree: "", institution: "", description: "" });
        }}
        title={editingEdu ? "Edit Education" : "Add Education"}
      >
        <form onSubmit={handleSaveEducation}>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Year</label>
              <input
                type="text"
                className="form-input"
                value={eduForm.year}
                onChange={(e) => setEduForm((p) => ({ ...p, year: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Degree</label>
              <input
                type="text"
                className="form-input"
                value={eduForm.degree}
                onChange={(e) => setEduForm((p) => ({ ...p, degree: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Institution</label>
            <input
              type="text"
              className="form-input"
              value={eduForm.institution}
              onChange={(e) => setEduForm((p) => ({ ...p, institution: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-textarea"
              rows="4"
              value={eduForm.description}
              onChange={(e) => setEduForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>

          <div className="flex gap-md justify-between mt-lg">
            <button type="button" className="btn btn-secondary" onClick={() => setShowEduModal(false)}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" disabled={savingEdu}>
              {savingEdu ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Skills */}
      <div className="card" style={{ padding: 16, marginBottom: 16 }}>
        <div className="flex justify-between items-center mb-md">
          <h3 style={{ margin: 0 }}>Skills</h3>

          <button className="btn btn-primary btn-sm" onClick={() => setShowSkillModal(true)}>
            + Add Skill
          </button>
        </div>

        {skills.length === 0 ? (
          <p style={{ opacity: 0.75, margin: 0 }}>No skills found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((s) => (
                  <tr key={s.id}>
                    <td>{s.skillName}</td>
                    <td>{s.category || "-"}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSkill(s.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Skill Modal */}
      <Modal
        isOpen={showSkillModal}
        onClose={() => {
          setShowSkillModal(false);
          setSkillForm({ skillName: "", category: "" });
        }}
        title="Add Skill"
      >
        <form onSubmit={handleAddSkill}>
          <div className="form-group">
            <label className="form-label">Skill Name</label>
            <input
              type="text"
              className="form-input"
              value={skillForm.skillName}
              onChange={(e) => setSkillForm((p) => ({ ...p, skillName: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <input
              type="text"
              className="form-input"
              value={skillForm.category}
              onChange={(e) => setSkillForm((p) => ({ ...p, category: e.target.value }))}
            />
          </div>

          <div className="flex gap-md justify-between mt-lg">
            <button type="button" className="btn btn-secondary" onClick={() => setShowSkillModal(false)}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" disabled={savingSkill}>
              {savingSkill ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Schedules */}
      <div className="card" style={{ padding: 16 }}>
        <div className="flex justify-between items-center mb-md">
          <h3 style={{ margin: 0 }}>Schedules</h3>

          <button className="btn btn-primary btn-sm" onClick={openAddSchedule}>
            + Add Schedule
          </button>
        </div>

        {schedules.length === 0 ? (
          <p style={{ opacity: 0.75, margin: 0 }}>No schedules found.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Slot</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s) => (
                  <tr key={s.id}>
                    <td>{s.dayName || String(s.dayOfWeek ?? "-")}</td>
                    <td>{s.startTime || "-"}</td>
                    <td>{s.endTime || "-"}</td>
                    <td>{s.slotDurationMinutes != null ? `${s.slotDurationMinutes} min` : "-"}</td>
                    <td>{s.isActive ? "✅" : "❌"}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteSchedule(s.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      <Modal isOpen={showScheduleModal} onClose={() => setShowScheduleModal(false)} title="Add Schedule">
        <form onSubmit={handleCreateSchedule}>
          <div className="form-group">
            <label className="form-label">Day of Week</label>
            <select
              className="form-select"
              value={scheduleForm.dayOfWeek}
              onChange={(e) => setScheduleForm((p) => ({ ...p, dayOfWeek: Number(e.target.value) }))}
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
            </select>
          </div>

          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                className="form-input"
                value={scheduleForm.startTime}
                onChange={(e) => setScheduleForm((p) => ({ ...p, startTime: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                className="form-input"
                value={scheduleForm.endTime}
                onChange={(e) => setScheduleForm((p) => ({ ...p, endTime: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Slot Duration (minutes)</label>
            <input
              type="number"
              className="form-input"
              min={5}
              step={5}
              value={scheduleForm.slotDurationMinutes}
              onChange={(e) =>
                setScheduleForm((p) => ({ ...p, slotDurationMinutes: Number(e.target.value) }))
              }
            />
          </div>

          <div className="flex gap-md justify-between mt-lg">
            <button type="button" className="btn btn-secondary" onClick={() => setShowScheduleModal(false)}>
              Cancel
            </button>

            <button type="submit" className="btn btn-primary" disabled={savingSchedule}>
              {savingSchedule ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DoctorDetails;