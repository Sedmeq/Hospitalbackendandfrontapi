// src/components/VideoCall/VideoCallRoom.jsx
import React from 'react';
import { useVideoCall } from '../../hooks/useVideoCall';
import { useAuth } from "../../context/AuthContext";

const VideoCallRoom = ({ appointmentId, currentUserName, onClose }) =>
{
    const token = localStorage.getItem('authToken');

    const { hasRole } = useAuth();
    const isDoctor = hasRole("Doctor");

    const {
        connectionState,
        callState,
        isMuted,
        isCameraOff,
        incomingCallerName,
        localVideoRef,
        remoteVideoRef,
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleCamera,
    } = useVideoCall(appointmentId, token);

    // ── Handlers ──
    const handleStartCall = () => startCall(currentUserName);

    const handleEnd = async () =>
    {
        await endCall();
        setTimeout(() => onClose?.(), 1200);
    };

    // ── Status label ──
    const statusMap = {
        idle: { text: '● Ready', color: '#68d391' },
        calling: { text: '📞 Calling...', color: '#fbd38d' },
        incoming: { text: '📲 Incoming call', color: '#76e4f7' },
        active: { text: '🟢 Connected', color: '#68d391' },
        ended: { text: '📵 Call ended', color: '#fc8181' },
    };
    const status = statusMap[callState] ?? statusMap.idle;

    return (
        <>
            {/* ══════════════ INCOMING CALL BANNER ══════════════ */}
            {callState === 'incoming' && (
                <div style={styles.incomingBanner}>
                    <div style={styles.incomingAvatar}>📹</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15 }}>Incoming video call</div>
                        <div style={{ opacity: 0.7, fontSize: 13 }}>{incomingCallerName}</div>
                    </div>
                    <button onClick={acceptCall} style={{ ...styles.ctrlBtn, background: '#38a169', minWidth: 80 }}>
                        ✅ Accept
                    </button>
                    <button onClick={rejectCall} style={{ ...styles.ctrlBtn, background: '#e53e3e', minWidth: 80 }}>
                        ❌ Decline
                    </button>
                </div>
            )}

            {/* ══════════════ FULL-SCREEN CALL ROOM ══════════════ */}
            <div style={styles.room}>
                {/* Top bar */}
                <div style={styles.topBar}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
                        🏥 Video Consultation — Appointment #{appointmentId}
                    </span>
                    <span style={{ color: status.color, fontWeight: 600, fontSize: 13 }}>
                        {status.text}
                    </span>
                </div>

                {/* ── Remote video (full area) ── */}
                <div style={styles.videoArea}>
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        style={styles.remoteVideo}
                    />

                    {/* Placeholder when no remote stream */}
                    {callState !== 'active' && (
                        <div style={styles.placeholder}>
                            <span style={{ fontSize: 64 }}>
                                {callState === 'calling' ? '📞' : callState === 'ended' ? '📵' : '🎥'}
                            </span>
                            <span style={{ marginTop: 12, fontSize: 18, opacity: 0.7 }}>
                                {callState === 'calling'
                                    ? 'Waiting for the other party...'
                                    : callState === 'ended'
                                        ? 'Call has ended'
                                        : connectionState === 'connected'
                                            ? (isDoctor ? 'Press "Start Call" to begin' : 'Waiting for doctor to start...')
                                            : 'Connecting to server...'}
                            </span>
                        </div>
                    )}

                    {/* ── Local video (PiP) ── */}
                    <div style={styles.localWrapper}>
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            style={styles.localVideo}
                        />
                        {isCameraOff && (
                            <div style={styles.camOffOverlay}>📷</div>
                        )}
                        <div style={styles.youLabel}>You</div>
                    </div>
                </div>

                {/* ── Controls ── */}
                <div style={styles.controls}>
                    {/* Mute */}
                    <Btn
                        icon={isMuted ? '🔇' : '🎙️'}
                        label={isMuted ? 'Unmute' : 'Mute'}
                        color={isMuted ? '#e53e3e' : '#2d3748'}
                        onClick={toggleMute}
                        disabled={callState !== 'active'}
                    />

                    {/* Camera */}
                    <Btn
                        icon={isCameraOff ? '🚫' : '📹'}
                        label={isCameraOff ? 'Cam On' : 'Cam Off'}
                        color={isCameraOff ? '#e53e3e' : '#2d3748'}
                        onClick={toggleCamera}
                        disabled={callState !== 'active'}
                    />

                    {/* Start / End */}
                    {/* {callState === 'idle' || callState === 'ended' ? (
                        <Btn
                            icon="📞"
                            label="Start Call"
                            color="#38a169"
                            onClick={handleStartCall}
                            disabled={connectionState !== 'connected'}
                            large
                        />
                    ) : callState === 'calling' || callState === 'active' ? (
                        <Btn
                            icon="📵"
                            label="End Call"
                            color="#e53e3e"
                            onClick={handleEnd}
                            large
                        />
                    ) : null} */}


                    {/* Start / End */}
                    {isDoctor && (callState === 'idle' || callState === 'ended') ? (
                        <Btn
                            icon="📞"
                            label="Start Call"
                            color="#38a169"
                            onClick={handleStartCall}
                            disabled={connectionState !== 'connected'}
                            large
                        />
                    ) : null}

                    {(callState === 'calling' || callState === 'active') ? (
                        <Btn
                            icon="📵"
                            label="End Call"
                            color="#e53e3e"
                            onClick={handleEnd}
                            large
                        />
                    ) : null}

                    {/* Close room */}
                    <Btn
                        icon="✖"
                        label="Close"
                        color="#4a5568"
                        onClick={onClose}
                    />
                </div>
            </div>

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes ring {
                    0%, 100% { transform: rotate(0deg); }
                    20%      { transform: rotate(-15deg); }
                    40%      { transform: rotate(15deg); }
                }
            `}</style>
        </>
    );
};

// ── Küçük düymə komponenti ──
const Btn = ({ icon, label, color, onClick, disabled, large }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: large ? '14px 32px' : '11px 18px',
            minWidth: large ? 110 : 72,
            background: disabled ? '#2d3748' : color,
            opacity: disabled ? 0.45 : 1,
            border: 'none', borderRadius: 14,
            color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: large ? 26 : 20,
            transition: 'background 0.2s, transform 0.1s',
            boxShadow: disabled ? 'none' : '0 2px 10px rgba(0,0,0,0.35)',
        }}
        onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.95)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
        <span>{icon}</span>
        <span style={{ fontSize: 11 }}>{label}</span>
    </button>
);

// ── Stillər ──
const styles = {
    // room: {
    //     display: 'flex', flexDirection: 'column',
    //     background: '#0d1117',
    //     borderRadius: 20, overflow: 'hidden',
    //     boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
    //     minHeight: 540, width: '100%',
    // },
    room: {
        display: 'flex',
        flexDirection: 'column',
        background: '#0d1117',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        width: '100%',
        height: '85vh',   // 👈 əsas budur
    },
    topBar: {
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '12px 20px',
        background: 'rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
    },
    // videoArea: {
    //     position: 'relative', flex: 1, minHeight: 380,
    //     background: '#111827', display: 'flex',
    //     alignItems: 'center', justifyContent: 'center',
    // },
    videoArea: {
        position: 'relative',
        flex: 1,
        background: '#111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    remoteVideo: {
        width: '100%', height: '100%', objectFit: 'cover',
        position: 'absolute', inset: 0,
    },
    placeholder: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        color: '#fff', position: 'relative', zIndex: 1,
        pointerEvents: 'none',
    },
    localWrapper: {
        position: 'absolute', bottom: 16, right: 16,
        width: 170, height: 115, borderRadius: 12,
        overflow: 'hidden', zIndex: 10,
        border: '2px solid rgba(255,255,255,0.18)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        background: '#1a1a2e',
    },
    localVideo: { width: '100%', height: '100%', objectFit: 'cover' },
    camOffOverlay: {
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: '#1a1a2e', fontSize: 32, color: '#fff',
    },
    youLabel: {
        position: 'absolute', bottom: 5, left: 0, right: 0,
        textAlign: 'center', color: '#fff', fontSize: 11,
        opacity: 0.8, pointerEvents: 'none',
    },
    controls: {
        display: 'flex', justifyContent: 'center',
        gap: 14, padding: '18px 24px',
        background: 'rgba(255,255,255,0.05)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        flexWrap: 'wrap',
    },
    incomingBanner: {
        position: 'fixed', top: 20, right: 20, zIndex: 9999,
        background: '#1a202c', color: '#fff',
        borderRadius: 16, padding: '16px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        animation: 'fadeSlideIn 0.3s ease',
        minWidth: 320,
    },
    incomingAvatar: {
        width: 46, height: 46, borderRadius: '50%',
        background: 'linear-gradient(135deg,#4facfe,#00f2fe)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, animation: 'ring 0.8s infinite',
    },
    ctrlBtn: {
        padding: '8px 16px', border: 'none',
        borderRadius: 10, color: '#fff',
        fontWeight: 700, cursor: 'pointer',
        fontSize: 13,
    },
};

export default VideoCallRoom;