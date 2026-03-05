// // src/hooks/useVideoCall.js
// import { useEffect, useRef, useState, useCallback } from 'react';
// import * as signalR from '@microsoft/signalr';

// const HUB_URL = 'http://localhost:5151/hubs/videocall';

// // Google STUN serverləri — pulsuz, public
// const ICE_SERVERS = {
//     iceServers: [
//         { urls: 'stun:stun.l.google.com:19302' },
//         { urls: 'stun:stun1.l.google.com:19302' },
//     ],
// };

// export const useVideoCall = (appointmentId, token) =>
// {
//     const [connectionState, setConnectionState] = useState('disconnected'); // disconnected | connected | error
//     const [callState, setCallState] = useState('idle'); // idle | calling | incoming | active | ended
//     const [isMuted, setIsMuted] = useState(false);
//     const [isCameraOff, setIsCameraOff] = useState(false);
//     const [incomingCallerName, setIncomingCallerName] = useState('');

//     const hubRef = useRef(null);
//     const pcRef = useRef(null);       // RTCPeerConnection
//     const localStreamRef = useRef(null);
//     const localVideoRef = useRef(null);
//     const remoteVideoRef = useRef(null);

//     // ─────────────────────────────────────────────────────
//     // 1) SignalR bağlantısı
//     // ─────────────────────────────────────────────────────
//     useEffect(() =>
//     {
//         if (!appointmentId || !token) return;

//         const hub = new signalR.HubConnectionBuilder()
//             .withUrl(HUB_URL, {
//                 accessTokenFactory: () => (token || "").replace("Bearer ", "").trim(),
//             })
//             .withAutomaticReconnect()
//             .configureLogging(signalR.LogLevel.Information)
//             .build();

//         hubRef.current = hub;

//         // ── Server → Client eventlər ──
//         hub.on('IncomingCall', (callerName) =>
//         {
//             setIncomingCallerName(callerName);
//             setCallState('incoming');
//         });

//         hub.on('CallAccepted', () =>
//         {
//             // Qarşı tərəf qəbul etdi → biz offer göndəririk
//             createAndSendOffer();
//         });

//         hub.on('CallRejected', () =>
//         {
//             setCallState('idle');
//             stopLocalStream();
//         });

//         hub.on('CallEnded', () =>
//         {
//             setCallState('ended');
//             cleanup();
//         });

//         hub.on('ReceiveOffer', async (offerStr) =>
//         {
//             await handleOffer(offerStr);
//         });

//         hub.on('ReceiveAnswer', async (answerStr) =>
//         {
//             if (pcRef.current)
//             {
//                 await pcRef.current.setRemoteDescription(
//                     new RTCSessionDescription(JSON.parse(answerStr))
//                 );
//             }
//         });

//         hub.on('ReceiveIceCandidate', async (candidateStr) =>
//         {
//             if (pcRef.current)
//             {
//                 try
//                 {
//                     await pcRef.current.addIceCandidate(
//                         new RTCIceCandidate(JSON.parse(candidateStr))
//                     );
//                 } catch (_) { }
//             }
//         });

//         // ── Bağlan ──
//         hub.start()
//             .then(async () =>
//             {
//                 setConnectionState("connected");
//                 await hub.invoke("JoinRoom", String(appointmentId));
//             })
//             .catch((err) =>
//             {
//                 console.error("SignalR start error:", err);
//                 setConnectionState("error");
//             });

//         hub.onreconnected(() =>
//         {
//             setConnectionState('connected');
//             hub.invoke('JoinRoom', String(appointmentId));
//         });

//         hub.onclose(() => setConnectionState('disconnected'));

//         return () =>
//         {
//             hub.invoke('LeaveRoom', String(appointmentId)).catch(() => { });
//             hub.stop();
//             cleanup();
//         };
//     }, [appointmentId, token]);

//     // ─────────────────────────────────────────────────────
//     // 2) WebRTC yardımçı funksiyalar
//     // ─────────────────────────────────────────────────────
//     const getLocalStream = async () =>
//     {
//         const stream = await navigator.mediaDevices.getUserMedia({
//             video: true,
//             audio: true,
//         });
//         localStreamRef.current = stream;
//         if (localVideoRef.current) localVideoRef.current.srcObject = stream;
//         return stream;
//     };

//     const buildPeerConnection = () =>
//     {
//         const pc = new RTCPeerConnection(ICE_SERVERS);
//         pcRef.current = pc;

//         // Local track-ları əlavə et
//         localStreamRef.current?.getTracks().forEach((t) =>
//             pc.addTrack(t, localStreamRef.current)
//         );

//         // Remote stream gəldi → remote video-ya ver
//         pc.ontrack = (e) =>
//         {
//             if (remoteVideoRef.current)
//                 remoteVideoRef.current.srcObject = e.streams[0];
//         };

//         // ICE candidate hazır → qarşı tərəfə göndər
//         pc.onicecandidate = (e) =>
//         {
//             if (e.candidate && hubRef.current)
//             {
//                 hubRef.current.invoke(
//                     'SendIceCandidate',
//                     String(appointmentId),
//                     JSON.stringify(e.candidate)
//                 );
//             }
//         };

//         pc.onconnectionstatechange = () =>
//         {
//             if (pc.connectionState === 'connected') setCallState('active');
//             if (['disconnected', 'failed', 'closed'].includes(pc.connectionState))
//             {
//                 setCallState('ended');
//                 cleanup();
//             }
//         };

//         return pc;
//     };

//     const createAndSendOffer = async () =>
//     {
//         const pc = buildPeerConnection();
//         const offer = await pc.createOffer();
//         await pc.setLocalDescription(offer);
//         await hubRef.current.invoke(
//             'SendOffer',
//             String(appointmentId),
//             JSON.stringify(offer)
//         );
//     };

//     const handleOffer = async (offerStr) =>
//     {
//         // Qarşı tərəfdən offer gəldi → answer göndər
//         await getLocalStream();
//         const pc = buildPeerConnection();
//         await pc.setRemoteDescription(
//             new RTCSessionDescription(JSON.parse(offerStr))
//         );
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//         await hubRef.current.invoke(
//             'SendAnswer',
//             String(appointmentId),
//             JSON.stringify(answer)
//         );
//         setCallState('active');
//     };

//     const stopLocalStream = () =>
//     {
//         localStreamRef.current?.getTracks().forEach((t) => t.stop());
//         localStreamRef.current = null;
//     };

//     const cleanup = () =>
//     {
//         stopLocalStream();
//         pcRef.current?.close();
//         pcRef.current = null;
//         if (localVideoRef.current) localVideoRef.current.srcObject = null;
//         if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
//         setIncomingCallerName('');
//     };

//     // ─────────────────────────────────────────────────────
//     // 3) Public metodlar (komponentdə istifadə üçün)
//     // ─────────────────────────────────────────────────────
//     const startCall = useCallback(async (callerName) =>
//     {
//         try
//         {
//             await getLocalStream();
//             setCallState('calling');
//             await hubRef.current.invoke('CallUser', String(appointmentId), callerName);
//         } catch
//         {
//             setCallState('idle');
//         }
//     }, [appointmentId]);

//     const acceptCall = useCallback(async () =>
//     {
//         try
//         {
//             await getLocalStream();
//             setCallState('active');
//             await hubRef.current.invoke('AcceptCall', String(appointmentId));
//         } catch
//         {
//             setCallState('idle');
//         }
//     }, [appointmentId]);

//     const rejectCall = useCallback(async () =>
//     {
//         setCallState('idle');
//         await hubRef.current.invoke('RejectCall', String(appointmentId));
//     }, [appointmentId]);

//     const endCall = useCallback(async () =>
//     {
//         await hubRef.current.invoke('EndCall', String(appointmentId));
//         cleanup();
//         setCallState('ended');
//     }, [appointmentId]);

//     const toggleMute = useCallback(() =>
//     {
//         localStreamRef.current?.getAudioTracks().forEach((t) =>
//         {
//             t.enabled = !t.enabled;
//         });
//         setIsMuted((p) => !p);
//     }, []);

//     const toggleCamera = useCallback(() =>
//     {
//         localStreamRef.current?.getVideoTracks().forEach((t) =>
//         {
//             t.enabled = !t.enabled;
//         });
//         setIsCameraOff((p) => !p);
//     }, []);

//     return {
//         // state
//         connectionState,
//         callState,
//         isMuted,
//         isCameraOff,
//         incomingCallerName,
//         // ref-lər → <video ref={localVideoRef} /> kimi istifadə et
//         localVideoRef,
//         remoteVideoRef,
//         // metodlar
//         startCall,
//         acceptCall,
//         rejectCall,
//         endCall,
//         toggleMute,
//         toggleCamera,
//     };
// };
















// src/hooks/useVideoCall.js
import { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://localhost:5151/hubs/videocall';

const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export const useVideoCall = (appointmentId, token) => {
    const [connectionState, setConnectionState] = useState('disconnected');
    const [callState, setCallState] = useState('idle');
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [incomingCallerName, setIncomingCallerName] = useState('');
    const [error, setError] = useState(null); // ✅ YENİ: error state

    const hubRef = useRef(null);
    const pcRef = useRef(null);
    const localStreamRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // ✅ useCallback ilə stable referanslar
    const stopLocalStream = useCallback(() => {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
    }, []);

    const cleanup = useCallback(() => {
        stopLocalStream();
        if (pcRef.current) {
            // ✅ Event listener-ləri təmizlə (memory leak qarşısı)
            pcRef.current.ontrack = null;
            pcRef.current.onicecandidate = null;
            pcRef.current.onconnectionstatechange = null;
            pcRef.current.close();
            pcRef.current = null;
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        setIncomingCallerName('');
        setIsMuted(false);
        setIsCameraOff(false);
    }, [stopLocalStream]);

    const getLocalStream = useCallback(async () => {
        if (localStreamRef.current) return localStreamRef.current; // ✅ cache
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = stream;
            if (localVideoRef.current) localVideoRef.current.srcObject = stream;
            return stream;
        } catch (err) {
            // ✅ Konkret error mesajı
            const msg = err.name === 'NotAllowedError'
                ? 'Kamera/mikrofon icazəsi rədd edildi.'
                : 'Kamera və ya mikrofona çıxış mümkün olmadı.';
            setError(msg);
            throw err;
        }
    }, []);

    const buildPeerConnection = useCallback((roomId) => {
        if (pcRef.current) { pcRef.current.close(); pcRef.current = null; } // ✅ köhnəni bağla

        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current));

        pc.ontrack = (e) => {
            if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
        };

        pc.onicecandidate = (e) => {
            // ✅ Hub connection state yoxlanır
            if (e.candidate && hubRef.current?.state === signalR.HubConnectionState.Connected) {
                hubRef.current.invoke('SendIceCandidate', roomId, JSON.stringify(e.candidate))
                    .catch(console.error);
            }
        };

        pc.onconnectionstatechange = () => {
            console.log('[WebRTC] state:', pc.connectionState);
            if (pc.connectionState === 'connected') setCallState('active');
            if (['disconnected', 'failed', 'closed'].includes(pc.connectionState)) {
                setCallState('ended');
                cleanup();
            }
        };

        return pc;
    }, [cleanup]);

    // ─────────────────────────────────────────────────────
    // SignalR setup
    // ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!appointmentId || !token) return;
        const roomId = String(appointmentId);

        const hub = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () => token.replace(/^Bearer\s+/i, '').trim(),
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Warning) // ✅ Info → Warning (az log)
            .build();

        hubRef.current = hub;

        // Offer/Answer funksiyaları useEffect içində — roomId closure düzgündür
        const createAndSendOffer = async () => {
            try {
                const pc = buildPeerConnection(roomId);
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);
                await hub.invoke('SendOffer', roomId, JSON.stringify(offer));
            } catch (err) {
                console.error('[WebRTC] offer failed:', err);
                setCallState('idle');
            }
        };

        const handleOffer = async (offerStr) => {
            try {
                await getLocalStream();
                const pc = buildPeerConnection(roomId);
                await pc.setRemoteDescription(new RTCSessionDescription(JSON.parse(offerStr)));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                await hub.invoke('SendAnswer', roomId, JSON.stringify(answer));
                setCallState('active');
            } catch (err) {
                console.error('[WebRTC] handleOffer failed:', err);
                setCallState('idle');
            }
        };

        hub.on('IncomingCall', (callerName) => { setIncomingCallerName(callerName); setCallState('incoming'); });
        hub.on('CallAccepted', createAndSendOffer);
        hub.on('CallRejected', () => { setCallState('idle'); stopLocalStream(); });
        hub.on('CallEnded', () => { setCallState('ended'); cleanup(); });
        hub.on('ReceiveOffer', handleOffer);
        hub.on('ReceiveAnswer', async (answerStr) => {
            if (!pcRef.current) return;
            try {
                await pcRef.current.setRemoteDescription(new RTCSessionDescription(JSON.parse(answerStr)));
            } catch (err) { console.error('[WebRTC] setRemoteDescription answer:', err); }
        });
        hub.on('ReceiveIceCandidate', async (candidateStr) => {
            if (!pcRef.current) return;
            try { await pcRef.current.addIceCandidate(new RTCIceCandidate(JSON.parse(candidateStr))); } catch (_) {}
        });

        hub.start()
            .then(async () => { setConnectionState('connected'); await hub.invoke('JoinRoom', roomId); })
            .catch((err) => {
                console.error('[SignalR] start error:', err);
                setConnectionState('error');
                setError('Zəng serverinə qoşulmaq alınmadı.');
            });

        hub.onreconnected(async () => { setConnectionState('connected'); await hub.invoke('JoinRoom', roomId); });
        hub.onclose(() => setConnectionState('disconnected'));

        return () => {
            hub.invoke('LeaveRoom', roomId).catch(() => {});
            hub.stop();
            cleanup();
        };
    }, [appointmentId, token, buildPeerConnection, getLocalStream, stopLocalStream, cleanup]);

    // ─────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────
    const startCall = useCallback(async (callerName) => {
        if (hubRef.current?.state !== signalR.HubConnectionState.Connected) {
            setError('Server bağlantısı yoxdur.');
            return;
        }
        try {
            setError(null);
            await getLocalStream();
            setCallState('calling');
            await hubRef.current.invoke('CallUser', String(appointmentId), callerName);
        } catch { setCallState('idle'); }
    }, [appointmentId, getLocalStream]);

    const acceptCall = useCallback(async () => {
        try {
            setError(null);
            await getLocalStream();
            setCallState('active');
            await hubRef.current.invoke('AcceptCall', String(appointmentId));
        } catch { setCallState('idle'); }
    }, [appointmentId, getLocalStream]);

    const rejectCall = useCallback(async () => {
        setCallState('idle');
        await hubRef.current?.invoke('RejectCall', String(appointmentId));
    }, [appointmentId]);

    const endCall = useCallback(async () => {
        await hubRef.current?.invoke('EndCall', String(appointmentId));
        cleanup();
        setCallState('ended');
    }, [appointmentId, cleanup]);

    const toggleMute = useCallback(() => {
        localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
        setIsMuted((p) => !p);
    }, []);

    const toggleCamera = useCallback(() => {
        localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; });
        setIsCameraOff((p) => !p);
    }, []);

    return {
        connectionState, callState, isMuted, isCameraOff, incomingCallerName, error,
        localVideoRef, remoteVideoRef,
        startCall, acceptCall, rejectCall, endCall, toggleMute, toggleCamera,
        clearError: () => setError(null),
    };
};