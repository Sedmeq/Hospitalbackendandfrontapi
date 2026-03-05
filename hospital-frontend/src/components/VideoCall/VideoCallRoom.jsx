// // src/components/VideoCall/VideoCallRoom.jsx
// import React from 'react';
// import { useVideoCall } from '../../hooks/useVideoCall';
// import { useAuth } from "../../context/AuthContext";

// const VideoCallRoom = ({ appointmentId, currentUserName, onClose }) =>
// {
//     const token = localStorage.getItem('authToken');

//     const { hasRole } = useAuth();
//     const isDoctor = hasRole("Doctor");

//     const {
//         connectionState,
//         callState,
//         isMuted,
//         isCameraOff,
//         incomingCallerName,
//         localVideoRef,
//         remoteVideoRef,
//         startCall,
//         acceptCall,
//         rejectCall,
//         endCall,
//         toggleMute,
//         toggleCamera,
//     } = useVideoCall(appointmentId, token);

//     // ── Handlers ──
//     const handleStartCall = () => startCall(currentUserName);

//     const handleEnd = async () =>
//     {
//         await endCall();
//         setTimeout(() => onClose?.(), 1200);
//     };

//     // ── Status label ──
//     const statusMap = {
//         idle: { text: '● Ready', color: '#68d391' },
//         calling: { text: '📞 Calling...', color: '#fbd38d' },
//         incoming: { text: '📲 Incoming call', color: '#76e4f7' },
//         active: { text: '🟢 Connected', color: '#68d391' },
//         ended: { text: '📵 Call ended', color: '#fc8181' },
//     };
//     const status = statusMap[callState] ?? statusMap.idle;

//     return (
//         <>
//             {/* ══════════════ INCOMING CALL BANNER ══════════════ */}
//             {callState === 'incoming' && (
//                 <div style={styles.incomingBanner}>
//                     <div style={styles.incomingAvatar}>📹</div>
//                     <div style={{ flex: 1 }}>
//                         <div style={{ fontWeight: 700, fontSize: 15 }}>Incoming video call</div>
//                         <div style={{ opacity: 0.7, fontSize: 13 }}>{incomingCallerName}</div>
//                     </div>
//                     <button onClick={acceptCall} style={{ ...styles.ctrlBtn, background: '#38a169', minWidth: 80 }}>
//                         ✅ Accept
//                     </button>
//                     <button onClick={rejectCall} style={{ ...styles.ctrlBtn, background: '#e53e3e', minWidth: 80 }}>
//                         ❌ Decline
//                     </button>
//                 </div>
//             )}

//             {/* ══════════════ FULL-SCREEN CALL ROOM ══════════════ */}
//             <div style={styles.room}>
//                 {/* Top bar */}
//                 <div style={styles.topBar}>
//                     <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>
//                         🏥 Video Consultation — Appointment #{appointmentId}
//                     </span>
//                     <span style={{ color: status.color, fontWeight: 600, fontSize: 13 }}>
//                         {status.text}
//                     </span>
//                 </div>

//                 {/* ── Remote video (full area) ── */}
//                 <div style={styles.videoArea}>
//                     <video
//                         ref={remoteVideoRef}
//                         autoPlay
//                         playsInline
//                         style={styles.remoteVideo}
//                     />

//                     {/* Placeholder when no remote stream */}
//                     {callState !== 'active' && (
//                         <div style={styles.placeholder}>
//                             <span style={{ fontSize: 64 }}>
//                                 {callState === 'calling' ? '📞' : callState === 'ended' ? '📵' : '🎥'}
//                             </span>
//                             <span style={{ marginTop: 12, fontSize: 18, opacity: 0.7 }}>
//                                 {callState === 'calling'
//                                     ? 'Waiting for the other party...'
//                                     : callState === 'ended'
//                                         ? 'Call has ended'
//                                         : connectionState === 'connected'
//                                             ? (isDoctor ? 'Press "Start Call" to begin' : 'Waiting for doctor to start...')
//                                             : 'Connecting to server...'}
//                             </span>
//                         </div>
//                     )}

//                     {/* ── Local video (PiP) ── */}
//                     <div style={styles.localWrapper}>
//                         <video
//                             ref={localVideoRef}
//                             autoPlay
//                             playsInline
//                             muted
//                             style={styles.localVideo}
//                         />
//                         {isCameraOff && (
//                             <div style={styles.camOffOverlay}>📷</div>
//                         )}
//                         <div style={styles.youLabel}>You</div>
//                     </div>
//                 </div>

//                 {/* ── Controls ── */}
//                 <div style={styles.controls}>
//                     {/* Mute */}
//                     <Btn
//                         icon={isMuted ? '🔇' : '🎙️'}
//                         label={isMuted ? 'Unmute' : 'Mute'}
//                         color={isMuted ? '#e53e3e' : '#2d3748'}
//                         onClick={toggleMute}
//                         disabled={callState !== 'active'}
//                     />

//                     {/* Camera */}
//                     <Btn
//                         icon={isCameraOff ? '🚫' : '📹'}
//                         label={isCameraOff ? 'Cam On' : 'Cam Off'}
//                         color={isCameraOff ? '#e53e3e' : '#2d3748'}
//                         onClick={toggleCamera}
//                         disabled={callState !== 'active'}
//                     />

//                     {/* Start / End */}
//                     {/* {callState === 'idle' || callState === 'ended' ? (
//                         <Btn
//                             icon="📞"
//                             label="Start Call"
//                             color="#38a169"
//                             onClick={handleStartCall}
//                             disabled={connectionState !== 'connected'}
//                             large
//                         />
//                     ) : callState === 'calling' || callState === 'active' ? (
//                         <Btn
//                             icon="📵"
//                             label="End Call"
//                             color="#e53e3e"
//                             onClick={handleEnd}
//                             large
//                         />
//                     ) : null} */}


//                     {/* Start / End */}
//                     {isDoctor && (callState === 'idle' || callState === 'ended') ? (
//                         <Btn
//                             icon="📞"
//                             label="Start Call"
//                             color="#38a169"
//                             onClick={handleStartCall}
//                             disabled={connectionState !== 'connected'}
//                             large
//                         />
//                     ) : null}

//                     {(callState === 'calling' || callState === 'active') ? (
//                         <Btn
//                             icon="📵"
//                             label="End Call"
//                             color="#e53e3e"
//                             onClick={handleEnd}
//                             large
//                         />
//                     ) : null}

//                     {/* Close room */}
//                     <Btn
//                         icon="✖"
//                         label="Close"
//                         color="#4a5568"
//                         onClick={onClose}
//                     />
//                 </div>
//             </div>

//             <style>{`
//                 @keyframes fadeSlideIn {
//                     from { opacity: 0; transform: translateY(-16px); }
//                     to   { opacity: 1; transform: translateY(0); }
//                 }
//                 @keyframes ring {
//                     0%, 100% { transform: rotate(0deg); }
//                     20%      { transform: rotate(-15deg); }
//                     40%      { transform: rotate(15deg); }
//                 }
//             `}</style>
//         </>
//     );
// };

// // ── Küçük düymə komponenti ──
// const Btn = ({ icon, label, color, onClick, disabled, large }) => (
//     <button
//         onClick={onClick}
//         disabled={disabled}
//         style={{
//             display: 'flex', flexDirection: 'column',
//             alignItems: 'center', justifyContent: 'center', gap: 5,
//             padding: large ? '14px 32px' : '11px 18px',
//             minWidth: large ? 110 : 72,
//             background: disabled ? '#2d3748' : color,
//             opacity: disabled ? 0.45 : 1,
//             border: 'none', borderRadius: 14,
//             color: '#fff', cursor: disabled ? 'not-allowed' : 'pointer',
//             fontSize: large ? 26 : 20,
//             transition: 'background 0.2s, transform 0.1s',
//             boxShadow: disabled ? 'none' : '0 2px 10px rgba(0,0,0,0.35)',
//         }}
//         onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.95)')}
//         onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
//     >
//         <span>{icon}</span>
//         <span style={{ fontSize: 11 }}>{label}</span>
//     </button>
// );

// // ── Stillər ──
// const styles = {
//     // room: {
//     //     display: 'flex', flexDirection: 'column',
//     //     background: '#0d1117',
//     //     borderRadius: 20, overflow: 'hidden',
//     //     boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
//     //     minHeight: 540, width: '100%',
//     // },
//     room: {
//         display: 'flex',
//         flexDirection: 'column',
//         background: '#0d1117',
//         borderRadius: 20,
//         overflow: 'hidden',
//         boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
//         width: '100%',
//         height: '85vh',   // 👈 əsas budur
//     },
//     topBar: {
//         display: 'flex', justifyContent: 'space-between',
//         alignItems: 'center', padding: '12px 20px',
//         background: 'rgba(255,255,255,0.06)',
//         borderBottom: '1px solid rgba(255,255,255,0.07)',
//     },
//     // videoArea: {
//     //     position: 'relative', flex: 1, minHeight: 380,
//     //     background: '#111827', display: 'flex',
//     //     alignItems: 'center', justifyContent: 'center',
//     // },
//     videoArea: {
//         position: 'relative',
//         flex: 1,
//         background: '#111827',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     remoteVideo: {
//         width: '100%', height: '100%', objectFit: 'cover',
//         position: 'absolute', inset: 0,
//     },
//     placeholder: {
//         display: 'flex', flexDirection: 'column',
//         alignItems: 'center', justifyContent: 'center',
//         color: '#fff', position: 'relative', zIndex: 1,
//         pointerEvents: 'none',
//     },
//     localWrapper: {
//         position: 'absolute', bottom: 16, right: 16,
//         width: 170, height: 115, borderRadius: 12,
//         overflow: 'hidden', zIndex: 10,
//         border: '2px solid rgba(255,255,255,0.18)',
//         boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
//         background: '#1a1a2e',
//     },
//     localVideo: { width: '100%', height: '100%', objectFit: 'cover' },
//     camOffOverlay: {
//         position: 'absolute', inset: 0, display: 'flex',
//         alignItems: 'center', justifyContent: 'center',
//         background: '#1a1a2e', fontSize: 32, color: '#fff',
//     },
//     youLabel: {
//         position: 'absolute', bottom: 5, left: 0, right: 0,
//         textAlign: 'center', color: '#fff', fontSize: 11,
//         opacity: 0.8, pointerEvents: 'none',
//     },
//     controls: {
//         display: 'flex', justifyContent: 'center',
//         gap: 14, padding: '18px 24px',
//         background: 'rgba(255,255,255,0.05)',
//         borderTop: '1px solid rgba(255,255,255,0.07)',
//         flexWrap: 'wrap',
//     },
//     incomingBanner: {
//         position: 'fixed', top: 20, right: 20, zIndex: 9999,
//         background: '#1a202c', color: '#fff',
//         borderRadius: 16, padding: '16px 20px',
//         display: 'flex', alignItems: 'center', gap: 14,
//         boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
//         animation: 'fadeSlideIn 0.3s ease',
//         minWidth: 320,
//     },
//     incomingAvatar: {
//         width: 46, height: 46, borderRadius: '50%',
//         background: 'linear-gradient(135deg,#4facfe,#00f2fe)',
//         display: 'flex', alignItems: 'center', justifyContent: 'center',
//         fontSize: 22, animation: 'ring 0.8s infinite',
//     },
//     ctrlBtn: {
//         padding: '8px 16px', border: 'none',
//         borderRadius: 10, color: '#fff',
//         fontWeight: 700, cursor: 'pointer',
//         fontSize: 13,
//     },
// };

// export default VideoCallRoom;

















// src/components/VideoCall/VideoCallRoom.jsx
import React from 'react';
import { useVideoCall } from '../../hooks/useVideoCall';
import { useAuth } from '../../context/AuthContext';

const VideoCallRoom = ({ appointmentId, currentUserName, onClose }) =>
{
    const token = localStorage.getItem('authToken');
    const { hasRole } = useAuth();
    const isDoctor = hasRole('Doctor');

    const {
        connectionState, callState, isMuted, isCameraOff,
        incomingCallerName, error,
        localVideoRef, remoteVideoRef,
        startCall, acceptCall, rejectCall, endCall,
        toggleMute, toggleCamera, clearError,
    } = useVideoCall(appointmentId, token);

    const handleEnd = async () =>
    {
        await endCall();
        setTimeout(() => onClose?.(), 1000);
    };

    const isCallActive = callState === 'active';
    const canStart = isDoctor && (callState === 'idle' || callState === 'ended');
    const canEnd = callState === 'calling' || callState === 'active';

    return (
        <div style={s.shell}>
            {/* ── Incoming call overlay ── */}
            {callState === 'incoming' && (
                <div style={s.incomingOverlay}>
                    <div style={s.incomingCard}>
                        <div style={s.pulseRing} />
                        <div style={s.callerAvatar}>
                            <PhoneIcon size={28} color="#fff" />
                        </div>
                        <div style={s.callerInfo}>
                            <span style={s.callerLabel}>Incoming video call</span>
                            <span style={s.callerName}>{incomingCallerName}</span>
                        </div>
                        <div style={s.incomingActions}>
                            <ActionButton
                                label="Accept"
                                color="#22c55e"
                                icon={<PhoneIcon size={20} color="#fff" />}
                                onClick={acceptCall}
                            />
                            <ActionButton
                                label="Decline"
                                color="#ef4444"
                                icon={<PhoneOffIcon size={20} color="#fff" />}
                                onClick={rejectCall}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* ── Error toast ── */}
            {error && (
                <div style={s.errorToast}>
                    <span>{error}</span>
                    <button onClick={clearError} style={s.errorClose}>✕</button>
                </div>
            )}

            {/* ── Header ── */}
            <header style={s.header}>
                <div style={s.headerLeft}>
                    <div style={s.headerIcon}>🏥</div>
                    <div>
                        <div style={s.headerTitle}>Video Consultation</div>
                        <div style={s.headerSub}>Appointment #{appointmentId}</div>
                    </div>
                </div>
                <ConnectionBadge state={connectionState} callState={callState} />
            </header>

            {/* ── Video area ── */}
            <div style={s.videoArea}>
                {/* Remote video */}
                <video ref={remoteVideoRef} autoPlay playsInline style={s.remoteVideo} />

                {/* Placeholder */}
                {!isCallActive && (
                    <div style={s.placeholder}>
                        <PlaceholderContent callState={callState} connectionState={connectionState} isDoctor={isDoctor} />
                    </div>
                )}

                {/* Local PiP */}
                <div style={s.pip}>
                    <video ref={localVideoRef} autoPlay playsInline muted style={s.pipVideo} />
                    {isCameraOff && (
                        <div style={s.pipMuted}>
                            <VideoOffIcon size={22} color="#94a3b8" />
                        </div>
                    )}
                    <span style={s.pipLabel}>You</span>
                </div>
            </div>

            {/* ── Controls ── */}
            <div style={s.controls}>
                <ControlBtn
                    icon={isMuted ? <MicOffIcon size={20} /> : <MicIcon size={20} />}
                    label={isMuted ? 'Unmute' : 'Mute'}
                    active={isMuted}
                    activeColor="#ef4444"
                    disabled={!isCallActive}
                    onClick={toggleMute}
                />
                <ControlBtn
                    icon={isCameraOff ? <VideoOffIcon size={20} /> : <VideoIcon size={20} />}
                    label={isCameraOff ? 'Cam On' : 'Cam Off'}
                    active={isCameraOff}
                    activeColor="#ef4444"
                    disabled={!isCallActive}
                    onClick={toggleCamera}
                />

                {canStart && (
                    <ControlBtn
                        icon={<PhoneIcon size={22} />}
                        label="Start Call"
                        color="#22c55e"
                        disabled={connectionState !== 'connected'}
                        onClick={() => startCall(currentUserName)}
                        large
                    />
                )}
                {canEnd && (
                    <ControlBtn
                        icon={<PhoneOffIcon size={22} />}
                        label="End Call"
                        color="#ef4444"
                        onClick={handleEnd}
                        large
                    />
                )}

                <ControlBtn
                    icon={<CloseIcon size={18} />}
                    label="Close"
                    color="#475569"
                    onClick={onClose}
                />
            </div>
        </div>
    );
};

// ── Sub-components ────────────────────────────────────────

const ConnectionBadge = ({ state, callState }) =>
{
    const map = {
        connected: { dot: '#22c55e', text: callState === 'active' ? 'Live' : 'Ready' },
        disconnected: { dot: '#f59e0b', text: 'Reconnecting...' },
        error: { dot: '#ef4444', text: 'Connection error' },
    };
    const { dot, text } = map[state] ?? map.disconnected;
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <div style={{
                width: 8, height: 8, borderRadius: '50%', background: dot,
                boxShadow: `0 0 6px ${dot}`
            }} />
            <span style={{ color: '#94a3b8', fontSize: 13 }}>{text}</span>
        </div>
    );
};

const PlaceholderContent = ({ callState, connectionState, isDoctor }) =>
{
    const content = {
        calling: { icon: '📞', text: 'Waiting for the other party...' },
        ended: { icon: '📵', text: 'Call has ended' },
        incoming: { icon: '📲', text: 'Incoming call...' },
    };
    const fallback = connectionState === 'connected'
        ? { icon: '🎥', text: isDoctor ? 'Press "Start Call" to begin' : 'Waiting for doctor to start...' }
        : { icon: '🔄', text: 'Connecting to server...' };

    const { icon, text } = content[callState] ?? fallback;
    return (
        <>
            <span style={{ fontSize: 56 }}>{icon}</span>
            <span style={{ marginTop: 16, color: '#64748b', fontSize: 16, textAlign: 'center' }}>{text}</span>
        </>
    );
};

const ActionButton = ({ label, color, icon, onClick }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 22px', border: 'none', borderRadius: 12,
            background: color, color: '#fff', fontWeight: 600,
            fontSize: 14, cursor: 'pointer',
            boxShadow: `0 4px 16px ${color}55`,
            transition: 'transform 0.1s, opacity 0.1s',
        }}
        onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
        onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
        {icon}{label}
    </button>
);

const ControlBtn = ({ icon, label, color = '#1e293b', activeColor, active, disabled, onClick, large }) =>
{
    const bg = active ? activeColor : color;
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', gap: 5,
                padding: large ? '14px 28px' : '11px 18px',
                minWidth: large ? 110 : 68,
                background: disabled ? '#1e293b' : bg,
                opacity: disabled ? 0.35 : 1,
                border: `1px solid ${disabled ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14, color: '#fff',
                cursor: disabled ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s, transform 0.1s',
                boxShadow: disabled ? 'none' : '0 2px 12px rgba(0,0,0,0.3)',
            }}
            onMouseDown={(e) => !disabled && (e.currentTarget.style.transform = 'scale(0.94)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
            <span style={{ lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: 10, letterSpacing: 0.4 }}>{label}</span>
        </button>
    );
};

// ── Inline SVG Icons (Lucide-style, no dep needed) ──
const Svg = ({ size, children }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);
const PhoneIcon = ({ size }) => <Svg size={size}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 11 19.79 19.79 0 01.22 2.18a2 2 0 012-2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.13 6.13l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" /></Svg>;
const PhoneOffIcon = ({ size }) => <Svg size={size}><path d="M10.68 13.31a16 16 0 003.01 3.01L15.84 14a1.65 1.65 0 011.82-.37 12.38 12.38 0 003.12.77 1.65 1.65 0 011.44 1.64v3.12a1.65 1.65 0 01-1.8 1.65A19.79 19.79 0 013 5a1.65 1.65 0 011.65-1.8H7.8A1.65 1.65 0 019.44 4.64a12.38 12.38 0 00.77 3.12 1.65 1.65 0 01-.37 1.82L8.59 10.7" /><line x1="23" y1="1" x2="1" y2="23" /></Svg>;
const MicIcon = ({ size }) => <Svg size={size}><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></Svg>;
const MicOffIcon = ({ size }) => <Svg size={size}><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" /><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></Svg>;
const VideoIcon = ({ size }) => <Svg size={size}><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></Svg>;
const VideoOffIcon = ({ size }) => <Svg size={size}><path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10" /><line x1="1" y1="1" x2="23" y2="23" /></Svg>;
const CloseIcon = ({ size }) => <Svg size={size}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></Svg>;

// ── Styles ──
const s = {
    shell: {
        display: 'flex', flexDirection: 'column',
        background: '#0a0f1a', borderRadius: 20, overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
        width: '100%', height: '85vh',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    },
    header: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '14px 20px',
        background: 'rgba(255,255,255,0.04)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    headerLeft: { display: 'flex', alignItems: 'center', gap: 12 },
    headerIcon: {
        width: 38, height: 38, borderRadius: 10,
        background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
    },
    headerTitle: { color: '#f1f5f9', fontWeight: 700, fontSize: 15 },
    headerSub: { color: '#64748b', fontSize: 12, marginTop: 1 },
    videoArea: {
        position: 'relative', flex: 1,
        background: '#060b14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    remoteVideo: {
        width: '100%', height: '100%', objectFit: 'cover',
        position: 'absolute', inset: 0,
    },
    placeholder: {
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1,
    },
    pip: {
        position: 'absolute', bottom: 16, right: 16,
        width: 168, height: 112, borderRadius: 14,
        overflow: 'hidden', zIndex: 10,
        border: '2px solid rgba(255,255,255,0.12)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        background: '#0f172a',
    },
    pipVideo: { width: '100%', height: '100%', objectFit: 'cover' },
    pipMuted: {
        position: 'absolute', inset: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#0f172a',
    },
    pipLabel: {
        position: 'absolute', bottom: 5, left: 0, right: 0,
        textAlign: 'center', color: 'rgba(255,255,255,0.6)',
        fontSize: 10, letterSpacing: 0.5, pointerEvents: 'none',
    },
    controls: {
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        gap: 12, padding: '16px 24px',
        background: 'rgba(255,255,255,0.04)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexWrap: 'wrap',
    },
    incomingOverlay: {
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
    },
    incomingCard: {
        background: '#0f172a',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: '36px 40px',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16,
        boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        position: 'relative',
        animation: 'fadeIn 0.25s ease',
    },
    pulseRing: {
        position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
        width: 80, height: 80, borderRadius: '50%',
        border: '3px solid rgba(34,197,94,0.3)',
        animation: 'pulse 1.5s infinite',
    },
    callerAvatar: {
        width: 64, height: 64, borderRadius: '50%',
        background: 'linear-gradient(135deg, #22c55e, #16a34a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 0 4px rgba(34,197,94,0.2)',
    },
    callerInfo: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
    callerLabel: { color: '#64748b', fontSize: 13 },
    callerName: { color: '#f1f5f9', fontSize: 20, fontWeight: 700 },
    incomingActions: { display: 'flex', gap: 12, marginTop: 8 },
    errorToast: {
        position: 'fixed', bottom: 24, left: '50%',
        transform: 'translateX(-50%)', zIndex: 9998,
        background: '#7f1d1d', color: '#fca5a5',
        padding: '12px 20px', borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 12,
        fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    },
    errorClose: {
        background: 'none', border: 'none',
        color: '#fca5a5', cursor: 'pointer', fontSize: 16,
    },
};

export default VideoCallRoom;