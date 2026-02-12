import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast toast-${type}`}>
            {message}
        </div>
    );
};

export const useToast = () => {
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'info', duration = 3000) => {
        setToast({ message, type, duration });
    };

    const ToastComponent = toast ? (
        <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => setToast(null)}
        />
    ) : null;

    return { showToast, ToastComponent };
};

export default Toast;
