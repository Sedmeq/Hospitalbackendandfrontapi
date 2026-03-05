import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAuth } from "./AuthContext";

const VideoCallContext = createContext(null);

export const useVideoCallContext = () => useContext(VideoCallContext);

export const VideoCallProvider = ({ children }) =>
{
    const { user, isAuthenticated } = useAuth();
    const [incomingCall, setIncomingCall] = useState(null);
    // { appointmentId, callerName }
    const [activeCall, setActiveCall] = useState(null);
    // { appointmentId } — zəng qəbul edilib, VideoCallRoom göstər
    const connectionRef = useRef(null);
    const joinedRoomsRef = useRef(new Set());

    // Patient olduqda confirmed video appointments-lərə qoşul
    const joinAppointmentRoom = async (appointmentId) =>
    {
        if (!connectionRef.current) return;
        if (joinedRoomsRef.current.has(appointmentId)) return;
        try
        {
            await connectionRef.current.invoke("JoinRoom", String(appointmentId));
            joinedRoomsRef.current.add(appointmentId);
        } catch (e)
        {
            console.error("JoinRoom failed:", e);
        }
    };

    useEffect(() =>
    {
        if (!isAuthenticated || !user) return;
        // Yalnız Patient üçün global listener lazımdır
        // Doctor öz VideoCallRoom-unda connect edir
        const isPatient = user?.roles?.includes("Patient");
        if (!isPatient) return;

        const token = localStorage.getItem("authToken");
        const conn = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5151/hubs/videocall", {
                accessTokenFactory: () => token,
            })
            .withAutomaticReconnect()
            .build();

        conn.on("IncomingCall", (callerName) =>
        {
            // Hansı room-dan gəldi? joinedRooms-dan birincisini götür
            // Daha yaxşısı: server callerName ilə appointmentId də göndərsin
            // Amma hələlik joinedRooms-dan götürürük
            const appointmentId = [...joinedRoomsRef.current][0];
            setIncomingCall({ appointmentId, callerName });
        });

        conn.on("CallEnded", () =>
        {
            setIncomingCall(null);
            setActiveCall(null);
        });

        conn.start().then(() =>
        {
            connectionRef.current = conn;
            // Confirmed video appointments-ları fetch et və qoşul
            fetchAndJoinRooms(token);
        });

        return () =>
        {
            conn.stop();
            connectionRef.current = null;
            joinedRoomsRef.current.clear();
        };
    }, [isAuthenticated, user]);

    const fetchAndJoinRooms = async (token) =>
    {
        try
        {
            const res = await fetch("https://localhost:7175/api/appointments", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            const confirmed = (data.items || data || []).filter(
                (a) => a.isVideoCall && a.status === "Confirmed"
            );
            for (const appt of confirmed)
            {
                await joinAppointmentRoom(appt.id);
            }
        } catch (e)
        {
            console.error("fetchAndJoinRooms failed:", e);
        }
    };

    const acceptCall = async () =>
    {
        if (!incomingCall) return;
        try
        {
            await connectionRef.current?.invoke("AcceptCall", String(incomingCall.appointmentId));
        } catch (e) { }
        setActiveCall({ appointmentId: incomingCall.appointmentId });
        setIncomingCall(null);
    };

    const rejectCall = async () =>
    {
        if (!incomingCall) return;
        try
        {
            await connectionRef.current?.invoke("RejectCall", String(incomingCall.appointmentId));
        } catch (e) { }
        setIncomingCall(null);
    };

    const endCall = () =>
    {
        setActiveCall(null);
    };

    return (
        <VideoCallContext.Provider value={{ incomingCall, activeCall, acceptCall, rejectCall, endCall, joinAppointmentRoom }}>
            {children}
        </VideoCallContext.Provider>
    );
};