import React from 'react';
import "../assets/styles/ModalCustom.css";

export default function ModalCustom({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  onConfirm,
  confirmText = "Aceptar"
}) {
  if (!isOpen) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-container ${type}`} onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <span>{icons[type]} {title}</span>
        </div>

        <div className="modal-body">
          {message}
        </div>

        <div className="modal-footer">
          {onConfirm && (
            <button className="btn-modal btn-cancel" onClick={onClose}>
              Cancelar
            </button>
          )}

          <button 
            className={`btn-modal ${type === 'warning' || type === 'error' ? 'btn-delete' : 'btn-confirm'}`}
            onClick={onConfirm ? onConfirm : onClose}
          >
            {onConfirm ? confirmText : 'Entendido'}
          </button>
        </div>

      </div>
    </div>
  );
}