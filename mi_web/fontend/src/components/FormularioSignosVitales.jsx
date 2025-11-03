import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../FormularioSignosVitales.css';

function FormularioSignosVitales() {
    const { rut } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombreResidente: rut,
        fecha: new Date().toISOString().split('T')[0],
        hora: new Date().toTimeString().split(' ')[0].slice(0, 5),
        presionSistolica: '',
        presionDiastolica: '',
        pulso: '',
        saturacionO2: '',
        temperatura: '',
        frecuenciaRespiratoria: '',
        hemoglucotest: '',
        diuresisDia: '',
        diuresisNoche: '',
        deposicion: '',
        vomito: '',
        peso: '',
        registradoPor: '',
        cargo: '',
        turno: '',
        observaciones: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSend = {
                ...formData,
                rut: rut, // Aseguramos que el RUT se envíe
                fecha: new Date().toISOString().split('T')[0]
            };
            await axios.post('http://localhost:5000/api/registros-vitales', dataToSend);
            const result = await Swal.fire({
                title: 'Registro guardado con éxito',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#00A3B5'
            });
            
            if (result.isConfirmed) {
                navigate(`/historial-clinico/${rut}`);
            }
        } catch (error) {
            console.error('Error al guardar:', error);
            Swal.fire({
                title: 'Error',
                text: 'Error al guardar el registro',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#00A3B5'
            });
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="formulario-container">
            <h2>Signos Vitales</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Hora:</label>
                    <input
                        type="time"
                        name="hora"
                        value={formData.hora}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Presión arterial sistólica:</label>
                    <div className="input-unit">
                        <input
                            type="text"
                            name="presionSistolica"
                            value={formData.presionSistolica}
                            onChange={handleInputChange}
                        />
                        <span className="unit">mmHg</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Presión arterial diastólica:</label>
                    <div className="input-unit">
                        <input
                            type="text"
                            name="presionDiastolica"
                            value={formData.presionDiastolica}
                            onChange={handleInputChange}
                        />
                        <span className="unit">mmHg</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Pulso:</label>
                    <div className="input-unit">
                        <input
                            type="text"
                            name="pulso"
                            value={formData.pulso}
                            onChange={handleInputChange}
                        />
                        <span className="unit">lpm</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Saturación O₂:</label>
                    <div className="input-unit">
                        <input
                            type="text"
                            name="saturacionO2"
                            value={formData.saturacionO2}
                            onChange={handleInputChange}
                        />
                        <span className="unit">%</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Temperatura:</label>
                    <div className="input-unit">
                        <input
                            type="text"
                            name="temperatura"
                            value={formData.temperatura}
                            onChange={handleInputChange}
                        />
                        <span className="unit">°C</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Frecuencia respiratoria:</label>
                    <div className="input-unit">
                        <input
                            type="text"
                            name="frecuenciaRespiratoria"
                            value={formData.frecuenciaRespiratoria}
                            onChange={handleInputChange}
                        />
                        <span className="unit">rpm</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Hemoglucotest:</label>
                    <div className="input-unit">
                        <input
                            type="text"
                            name="hemoglucotest"
                            value={formData.hemoglucotest}
                            onChange={handleInputChange}
                        />
                        <span className="unit">mg/dL</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Diuresis (Día):</label>
                    <input
                        type="text"
                        name="diuresisDia"
                        value={formData.diuresisDia}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Diuresis (Noche):</label>
                    <input
                        type="text"
                        name="diuresisNoche"
                        value={formData.diuresisNoche}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Deposición:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="deposicion"
                                value="SI"
                                checked={formData.deposicion === "SI"}
                                onChange={handleInputChange}
                            /> SI
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="deposicion"
                                value="NO"
                                checked={formData.deposicion === "NO"}
                                onChange={handleInputChange}
                            /> NO
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Vómito:</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="vomito"
                                value="SI"
                                checked={formData.vomito === "SI"}
                                onChange={handleInputChange}
                            /> SI
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="vomito"
                                value="NO"
                                checked={formData.vomito === "NO"}
                                onChange={handleInputChange}
                            /> NO
                        </label>
                    </div>
                </div>

                <div className="form-group">
                    <label>Peso:</label>
                    <div className="input-unit">
                        <input
                            type="text"
                            name="peso"
                            value={formData.peso}
                            onChange={handleInputChange}
                        />
                        <span className="unit">kg</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Registrado por:</label>
                    <input
                        type="text"
                        name="registradoPor"
                        value={formData.registradoPor}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Cargo:</label>
                    <input
                        type="text"
                        name="cargo"
                        value={formData.cargo}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Turno:</label>
                    <input
                        type="text"
                        name="turno"
                        value={formData.turno}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Observaciones:</label>
                    <textarea
                        name="observaciones"
                        value={formData.observaciones}
                        onChange={handleInputChange}
                        rows="4"
                    />
                </div>

                <div className="buttons-container">
                    <button type="submit" className="btn-guardar">Guardar</button>
                    <button type="button" className="btn-volver" onClick={() => navigate(-1)}>
                        Volver al menú
                    </button>
                </div>
            </form>
        </div>
    );
}

export default FormularioSignosVitales;