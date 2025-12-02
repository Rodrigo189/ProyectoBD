// src/components/Acordeon.jsx (SOLUCIÓN DEFINITIVA A DOBLE CLIC Y CORTE)
import { useState, useRef, useEffect } from "react"; 
import styles from "../assets/styles/fichaClinica.module.css";

const Acordeon = ({ titulo, children, isOpen, onToggle }) => { 
  const contentRef = useRef(null); 
  const containerRef = useRef(null); 

  // Efecto 1: Animación y altura dinámica (+50px para evitar cortes)
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        contentRef.current.style.maxHeight = (contentRef.current.scrollHeight + 50) + "px";
      } else {
        contentRef.current.style.maxHeight = "0px";
      }
    }
  }, [isOpen, children]); 
  
  // Efecto 2: Abrir si un campo DE ADENTRO recibe el foco
  useEffect(() => {
    const handleFocus = (event) => {
      // CORRECCIÓN CLAVE: 
      // Antes usábamos "containerRef" (que incluía el botón de título).
      // Ahora usamos "contentRef" para que solo se active si tocas el CONTENIDO interno.
      // Así evitamos que el clic en el título dispare esto por error.
      if (!isOpen && contentRef.current && contentRef.current.contains(event.target)) {
        onToggle();
      }
    };

    document.addEventListener('focusin', handleFocus);
    return () => {
      document.removeEventListener('focusin', handleFocus);
    };
  }, [isOpen, onToggle]);

  return (
    <div className={styles.acordeonContainer} ref={containerRef}>
      <button 
        type="button" 
        className={styles.acordeonHeader} 
        onClick={onToggle} 
        aria-expanded={isOpen}
      >
        <span className={styles.acordeonTitle}>{titulo}</span>
        <span className={`${styles.acordeonIcon} ${isOpen ? styles.open : ''}`}>
          &#9660; 
        </span>
      </button>
      
      <div 
        ref={contentRef} 
        className={styles.acordeonContentAnimated}
      >
        <div className={styles.acordeonInnerContent}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Acordeon;