import React from "react";

export default function PatologiasResidente() {
  return (
    <div className="section-card">
      <h2>Ficha clínica Residente (Patologías del Residente)</h2>
      <p className="note">Todos los campos marcados con <span className="required">*</span> son obligatorios</p>

      <form>
        <div className="field">
          <label>Seleccione una Patología <span className="required">*</span></label>
          <div className="radio-group-column">
            <label><input type="radio" name="patologia" /> Diabetes Tipo 1</label>
            <label><input type="radio" name="patologia" /> Diabetes Tipo 2</label>
            <label><input type="radio" name="patologia" /> Glaucoma</label>
            <label><input type="radio" name="patologia" /> Patología Renal</label>
            <label><input type="radio" name="patologia" /> EPOC</label>
            <label><input type="radio" name="patologia" /> Cáncer</label>
            <label><input type="radio" name="patologia" /> Artrosis</label>
            <label><input type="radio" name="patologia" /> Otros</label>
          </div>
        </div>

        <div className="field">
          <label>Tipo y Etapa del Cáncer (si aplica)</label>
          <input type="text" placeholder="Ingrese etapa del cáncer" />
        </div>

        <div className="field">
          <label>Patología Renal (si aplica)</label>
          <input type="text" placeholder="Ingrese detalle renal" />
        </div>

        <div className="field">
          <label>Otros Diagnósticos</label>
          <textarea placeholder="Especifique otra patología"></textarea>
        </div>

        <div className="actions">
          <button type="button" className="btn-secondary">Atrás</button>
          <button type="submit" className="btn-primary">Guardar y pasar al siguiente paso</button>
        </div>
      </form>
    </div>
  );
}
