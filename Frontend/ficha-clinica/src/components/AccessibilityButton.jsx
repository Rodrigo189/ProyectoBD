// src/components/AccessibilityButton.jsx (Implementado)
import React, { useState, useEffect } from 'react';
import '../assets/styles/AccessibilityButton.css';

// Función para aplicar clases al body
const applySettings = (settings) => {
  // Limpiar clases anteriores
  document.body.classList.remove('accessibility-high-contrast', 'accessibility-font-large', 'accessibility-font-xlarge');

  // Aplicar contraste
  if (settings.contrast) {
    document.body.classList.add('accessibility-high-contrast');
  }

  // Aplicar tamaño de fuente
  if (settings.fontSize === 'large') {
    document.body.classList.add('accessibility-font-large');
  } else if (settings.fontSize === 'xlarge') {
    document.body.classList.add('accessibility-font-xlarge');
  }
};

export default function AccessibilityButton() {
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  // Estado para las opciones (leemos desde localStorage)
  const [settings, setSettings] = useState(() => {
    const savedContrast = localStorage.getItem('accessibility-contrast') === 'true';
    const savedFontSize = localStorage.getItem('accessibility-font-size') || 'normal';
    return { contrast: savedContrast, fontSize: savedFontSize };
  });

  // Aplicar settings guardados CADA VEZ que el componente carga
  useEffect(() => {
    applySettings(settings);
  }, [settings]); // Se re-ejecuta si 'settings' cambia

  // --- MANEJADORES DE CLIC ---

  const handleToggleContrast = () => {
    setSettings(prev => {
      const newSettings = { ...prev, contrast: !prev.contrast };
      localStorage.setItem('accessibility-contrast', newSettings.contrast);
      return newSettings;
    });
  };

  const handleSetFontSize = (size) => {
    setSettings(prev => {
      // Si presiona el mismo tamaño, vuelve a normal
      const newSize = prev.fontSize === size ? 'normal' : size;
      const newSettings = { ...prev, fontSize: newSize };
      localStorage.setItem('accessibility-font-size', newSettings.fontSize);
      return newSettings;
    });
  };

  const handleReset = () => {
    localStorage.removeItem('accessibility-contrast');
    localStorage.removeItem('accessibility-font-size');
    const defaultSettings = { contrast: false, fontSize: 'normal' };
    setSettings(defaultSettings);
  };

  return (
    <>
      {menuAbierto && (
        <div className="accessibility-menu">
          <button 
            onClick={() => handleSetFontSize('large')} 
            className={`accessibility-option ${settings.fontSize === 'large' ? 'active' : ''}`}
          >
            Aumentar Texto (Grande)
          </button>
          <button 
            onClick={() => handleSetFontSize('xlarge')} 
            className={`accessibility-option ${settings.fontSize === 'xlarge' ? 'active' : ''}`}
          >
            Aumentar Texto (Muy Grande)
          </button>
          <button 
            onClick={handleToggleContrast} 
            className={`accessibility-option ${settings.contrast ? 'active' : ''}`}
          >
            Modo Alto Contraste
          </button>
          <button 
            onClick={handleReset} 
            className="accessibility-option"
          >
            Restablecer
          </button>
        </div>
      )}

      <button 
        className="accessibility-button" 
        onClick={() => setMenuAbierto(!menuAbierto)}
        title="Opciones de Accesibilidad"
      >
        ♿
      </button>
    </>
  );
}