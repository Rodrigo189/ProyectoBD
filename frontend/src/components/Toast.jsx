import React, { useEffect, useState } from "react";
import "../styles/toast.css";

/**
 * Componente Toast para notificaciones del sistema
 * Props:
 * - message: string - Mensaje a mostrar
 * - type: "success" | "error" | "info" | "warning" - Tipo de notificación
 * - duration: number - Duración en ms (default: 3000)
 * - onClose: function - Callback al cerrar
 * - show: boolean - Controla visibilidad
 */
export default function Toast({ message, type = "success", duration = 3000, onClose, show }) {
    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        if (show) {
            setVisible(true);
            setLeaving(false);
            const timer = setTimeout(() => {
                setLeaving(true);
                setTimeout(() => {
                    setVisible(false);
                    if (onClose) onClose();
                }, 300);
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    if (!visible) return null;

    const icons = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ"
    };

    return (
        <div className={`toast-container ${leaving ? "toast-leave" : "toast-enter"}`}>
            <div className={`toast toast-${type}`}>
                <span className="toast-icon">{icons[type]}</span>
                <span className="toast-message">{message}</span>
                <button className="toast-close" onClick={() => {
                    setLeaving(true);
                    setTimeout(() => {
                        setVisible(false);
                        if (onClose) onClose();
                    }, 300);
                }}>×</button>
            </div>
        </div>
    );
}

/**
 * Hook para usar Toast fácilmente
 */
export function useToast() {
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });

    const showToast = (message, type = "success", duration = 3000) => {
        setToast({ show: true, message, type, duration });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, show: false }));
    };

    const ToastComponent = () => (
        <Toast
            show={toast.show}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={hideToast}
        />
    );

    return { showToast, hideToast, ToastComponent };
}
