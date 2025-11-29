import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/FichaClinica.css';

function FichaClinica() {
    const { rut } = useParams();
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarFicha = async () => {
            try {
                const response = await axios.get(`https://eleam.onrender.com/api/residentes/${rut}`);
                setPaciente(response.data);
                setError('');
            } catch (err) {
                setError('Error al cargar la ficha clínica');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        cargarFicha();
    }, [rut]);

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>{error}</div>;
    if (!paciente) return <div>No se encontró la ficha clínica</div>;

    return (
        <div className="dashboard-container">
            {/* Banner */}
            <div className="banner">
                <div className="logo" style={{ backgroundImage: "url('/image.png')" }}></div>
                <div className="portal-title">Portal ELEAM Residente</div>
            </div>

            {/* Datos residente */}
            <div className="datos-residente">
                <div className="foto-residente"></div>
                <div className="info-residente">
                    <p>Nombre residente: {paciente.nombre}</p>
                    <p>RUN: {paciente.rut}</p>
                    <p>Médico tratante: {paciente.medico_tratante}</p>
                    <p>Próximo control: {paciente.proximo_control}</p>
                </div>
            </div>

            {/* Ficha Clínica */}
            <div className="ficha-clinica">
                <h3>Ficha Clínica</h3>
                <div className="ficha-detalle">
                    <div className="seccion-datos">
                        <h4>Datos del Paciente</h4>
                        <p><strong>Fecha de Nacimiento:</strong> {paciente.fecha_nacimiento}</p>
                        <p><strong>Fecha de Ingreso:</strong> {paciente.fecha_ingreso}</p>
                    </div>

                    <div className="seccion-medica">
                        <h4>Información Médica</h4>
                        <p><strong>Diagnóstico:</strong> {paciente.diagnostico}</p>
                    </div>

                    <div className="seccion-medicamentos">
                        <h4>Medicamentos</h4>
                        {paciente.medicamentos && paciente.medicamentos.length > 0 ? (
                            paciente.medicamentos.map((med, index) => (
                                <div key={index} className="medicamento">
                                    <p><strong>Nombre:</strong> {med.nombre}</p>
                                    <p><strong>Dosis:</strong> {med.dosis}</p>
                                    <p><strong>Médico Indicador:</strong> {med.medico_indicador}</p>
                                    <p><strong>Caso SOS:</strong> {med.caso_sos ? "Sí" : "No"}</p>
                                    <p><strong>Fecha Inicio:</strong> {med.fecha_inicio}</p>
                                    <p><strong>Fecha Término:</strong> {med.fecha_termino || "—"}</p>
                                </div>
                            ))
                        ) : (
                            <p>No hay medicamentos registrados</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Botones de acción */}
            <div className="botones-accion">
                <button className="boton" onClick={() => window.location.href = `/dashboard?rut=${paciente.rut}`}>Volver al Dashboard</button>
                <button className="boton" onClick={() => window.location.href = '/'}>Salir</button>
            </div>
        </div>
    );
}

export default FichaClinica;
