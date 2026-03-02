// src/hooks/useVideoCall.js
import { useEffect, useRef, useState, useCallback } from 'react';
import * as signalR from '@microsoft/signalr';

const HUB_URL = 'http://localhost:5151/hubs/videocall';

// Google STUN serverləri — pulsuz, public
const ICE_SERVERS = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ],
};

export const useVideoCall = (appointmentId, token) =>
{
    const [connectionState, setConnectionState] = useState('disconnected'); // disconnected | connected | error
    const [callState, setCallState] = useState('idle'); // idle | calling | incoming | active | ended
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [incomingCallerName, setIncomingCallerName] = useState('');

    const hubRef = useRef(null);
    const pcRef = useRef(null);       // RTCPeerConnection
    const localStreamRef = useRef(null);
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    // ─────────────────────────────────────────────────────
    // 1) SignalR bağlantısı
    // ─────────────────────────────────────────────────────
    useEffect(() =>
    {
        if (!appointmentId || !token) return;

        const hub = new signalR.HubConnectionBuilder()
            .withUrl(HUB_URL, {
                accessTokenFactory: () => (token || "").replace("Bearer ", "").trim(),
            })
            .withAutomaticReconnect()
            .configureLogging(signalR.LogLevel.Information)
            .build();

        hubRef.current = hub;

        // ── Server → Client eventlər ──
        hub.on('IncomingCall', (callerName) =>
        {
            setIncomingCallerName(callerName);
            setCallState('incoming');
        });

        hub.on('CallAccepted', () =>
        {
            // Qarşı tərəf qəbul etdi → biz offer göndəririk
            createAndSendOffer();
        });

        hub.on('CallRejected', () =>
        {
            setCallState('idle');
            stopLocalStream();
        });

        hub.on('CallEnded', () =>
        {
            setCallState('ended');
            cleanup();
        });

        hub.on('ReceiveOffer', async (offerStr) =>
        {
            await handleOffer(offerStr);
        });

        hub.on('ReceiveAnswer', async (answerStr) =>
        {
            if (pcRef.current)
            {
                await pcRef.current.setRemoteDescription(
                    new RTCSessionDescription(JSON.parse(answerStr))
                );
            }
        });

        hub.on('ReceiveIceCandidate', async (candidateStr) =>
        {
            if (pcRef.current)
            {
                try
                {
                    await pcRef.current.addIceCandidate(
                        new RTCIceCandidate(JSON.parse(candidateStr))
                    );
                } catch (_) { }
            }
        });

        // ── Bağlan ──
        hub.start()
            .then(async () =>
            {
                setConnectionState("connected");
                await hub.invoke("JoinRoom", String(appointmentId));
            })
            .catch((err) =>
            {
                console.error("SignalR start error:", err);
                setConnectionState("error");
            });

        hub.onreconnected(() =>
        {
            setConnectionState('connected');
            hub.invoke('JoinRoom', String(appointmentId));
        });

        hub.onclose(() => setConnectionState('disconnected'));

        return () =>
        {
            hub.invoke('LeaveRoom', String(appointmentId)).catch(() => { });
            hub.stop();
            cleanup();
        };
    }, [appointmentId, token]);

    // ─────────────────────────────────────────────────────
    // 2) WebRTC yardımçı funksiyalar
    // ─────────────────────────────────────────────────────
    const getLocalStream = async () =>
    {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        return stream;
    };

    const buildPeerConnection = () =>
    {
        const pc = new RTCPeerConnection(ICE_SERVERS);
        pcRef.current = pc;

        // Local track-ları əlavə et
        localStreamRef.current?.getTracks().forEach((t) =>
            pc.addTrack(t, localStreamRef.current)
        );

        // Remote stream gəldi → remote video-ya ver
        pc.ontrack = (e) =>
        {
            if (remoteVideoRef.current)
                remoteVideoRef.current.srcObject = e.streams[0];
        };

        // ICE candidate hazır → qarşı tərəfə göndər
        pc.onicecandidate = (e) =>
        {
            if (e.candidate && hubRef.current)
            {
                hubRef.current.invoke(
                    'SendIceCandidate',
                    String(appointmentId),
                    JSON.stringify(e.candidate)
                );
            }
        };

        pc.onconnectionstatechange = () =>
        {
            if (pc.connectionState === 'connected') setCallState('active');
            if (['disconnected', 'failed', 'closed'].includes(pc.connectionState))
            {
                setCallState('ended');
                cleanup();
            }
        };

        return pc;
    };

    const createAndSendOffer = async () =>
    {
        const pc = buildPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        await hubRef.current.invoke(
            'SendOffer',
            String(appointmentId),
            JSON.stringify(offer)
        );
    };

    const handleOffer = async (offerStr) =>
    {
        // Qarşı tərəfdən offer gəldi → answer göndər
        await getLocalStream();
        const pc = buildPeerConnection();
        await pc.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(offerStr))
        );
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        await hubRef.current.invoke(
            'SendAnswer',
            String(appointmentId),
            JSON.stringify(answer)
        );
        setCallState('active');
    };

    const stopLocalStream = () =>
    {
        localStreamRef.current?.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
    };

    const cleanup = () =>
    {
        stopLocalStream();
        pcRef.current?.close();
        pcRef.current = null;
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        setIncomingCallerName('');
    };

    // ─────────────────────────────────────────────────────
    // 3) Public metodlar (komponentdə istifadə üçün)
    // ─────────────────────────────────────────────────────
    const startCall = useCallback(async (callerName) =>
    {
        try
        {
            await getLocalStream();
            setCallState('calling');
            await hubRef.current.invoke('CallUser', String(appointmentId), callerName);
        } catch
        {
            setCallState('idle');
        }
    }, [appointmentId]);

    const acceptCall = useCallback(async () =>
    {
        try
        {
            await getLocalStream();
            setCallState('active');
            await hubRef.current.invoke('AcceptCall', String(appointmentId));
        } catch
        {
            setCallState('idle');
        }
    }, [appointmentId]);

    const rejectCall = useCallback(async () =>
    {
        setCallState('idle');
        await hubRef.current.invoke('RejectCall', String(appointmentId));
    }, [appointmentId]);

    const endCall = useCallback(async () =>
    {
        await hubRef.current.invoke('EndCall', String(appointmentId));
        cleanup();
        setCallState('ended');
    }, [appointmentId]);

    const toggleMute = useCallback(() =>
    {
        localStreamRef.current?.getAudioTracks().forEach((t) =>
        {
            t.enabled = !t.enabled;
        });
        setIsMuted((p) => !p);
    }, []);

    const toggleCamera = useCallback(() =>
    {
        localStreamRef.current?.getVideoTracks().forEach((t) =>
        {
            t.enabled = !t.enabled;
        });
        setIsCameraOff((p) => !p);
    }, []);

    return {
        // state
        connectionState,
        callState,
        isMuted,
        isCameraOff,
        incomingCallerName,
        // ref-lər → <video ref={localVideoRef} /> kimi istifadə et
        localVideoRef,
        remoteVideoRef,
        // metodlar
        startCall,
        acceptCall,
        rejectCall,
        endCall,
        toggleMute,
        toggleCamera,
    };
};