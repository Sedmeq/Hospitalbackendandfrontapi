import React from "react";
import { useAuth } from "../../context/AuthContext";
import ProfileForm from "./ProfileForm";
import ChangePasswordCard from "./ChangePasswordCard";
import { patientApi } from "../../api/patientApi";
import { doctorApi } from "../../api/doctorApi";

export default function Settings() {
  const { hasRole } = useAuth();

  const isDoctor = hasRole?.("Doctor");
  const isPatient = hasRole?.("Patient");

  const mode = isDoctor ? "doctor" : "patient";
  const api = isDoctor
    ? { getMyProfile: doctorApi.getMyProfile, updateMyProfile: doctorApi.updateMyProfile }
    : { getMyProfile: patientApi.getMyProfile, updateMyProfile: patientApi.updateMyProfile };

  return (
    <div style={{ maxWidth: 900 }}>
      <div className="flex justify-between items-center mb-xl">
        <h2>Settings</h2>
      </div>

      {/* Profile */}
      <ProfileForm title="My Profile" mode={mode} api={api} />

      {/* Password */}
      {(isDoctor || isPatient) && <ChangePasswordCard />}
    </div>
  );
}