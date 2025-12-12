import React from "react";
import "../styles/modal.css";

/**
 * Componente Modal centrado para confirmaciones y formularios
 * Props:
 * - show: boolean - Controla visibilidad
 * - onClose: function - Callback al cerrar
 * - title: string - Título del modal
 * - children: React.Node - Contenido del modal
 * - size: "sm" | "md" | "lg" - Tamaño del modal
 * - showCloseButton: boolean - Mostrar botón X (default: true)
 */
export default function Modal({
    show,
    onClose,
    title,
    children,
    size = "md",
    showCloseButton = true
}) {
    if (!show) return null;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className={`modal-content modal-${size}`}>
                {(title || showCloseButton) && (
                    <div className="modal-header">
                        {title && <h3 className="modal-title">{title}</h3>}
                        {showCloseButton && (
                            <button className="modal-close-btn" onClick={onClose}>
                                ×
                            </button>
                        )}
                    </div>
                )}
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * Componente de confirmación con botones
 */
export function ConfirmModal({
    show,
    onClose,
    onConfirm,
    title = "Confirmar",
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    confirmType = "primary" // "primary" | "danger"
}) {
    if (!show) return null;

    return (
        <Modal show={show} onClose={onClose} title={title} size="sm">
            <p className="modal-message">{message}</p>
            <div className="modal-actions">
                <button className="modal-btn modal-btn-cancel" onClick={onClose}>
                    {cancelText}
                </button>
                <button
                    className={`modal-btn modal-btn-${confirmType}`}
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                >
                    {confirmText}
                </button>
            </div>
        </Modal>
    );
}
