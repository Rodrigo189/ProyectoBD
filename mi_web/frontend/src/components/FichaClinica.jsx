import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../FichaClinica.css';

function FichaClinica() {
    const { rut } = useParams();
    const [paciente, setPaciente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const cargarFicha = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/residentes/${rut}`);
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
        <div className="ficha-clinica">
            <h2>Ficha Clínica</h2>

            <div className="seccion-datos">
                <h3>Datos del Paciente</h3>
                <p><strong>RUT:</strong> {paciente.rut}</p>
                <p><strong>Nombre:</strong> {paciente.nombre}</p>
                <p><strong>Fecha de Nacimiento:</strong> {paciente.fecha_nacimiento}</p>
                <p><strong>Fecha de Ingreso:</strong> {paciente.fecha_ingreso}</p>
            </div>

            <div className="seccion-medica">
                <h3>Información Médica</h3>
                <p><strong>Médico Tratante:</strong> {paciente.medico_tratante}</p>
                <p><strong>Próximo Control:</strong> {paciente.proximo_control}</p>
                <p><strong>Diagnóstico:</strong> {paciente.diagnostico}</p>
            </div>

            <div className="seccion-medicamentos">
                <h3>Medicamentos</h3>
                <p><strong>Nombre:</strong> {paciente.medicamento?.nombre}</p>
                <p><strong>Dosis:</strong> {paciente.medicamento?.dosis}</p>
                <p><strong>Médico Indicador:</strong> {paciente.medicamento?.medico_indicador}</p>
                <p><strong>Caso SOS:</strong> {paciente.medicamento?.caso_sos ? "Sí" : "No"}</p>
                <p><strong>Fecha Inicio:</strong> {paciente.medicamento?.fecha_inicio}</p>
                <p><strong>Fecha Término:</strong> {paciente.medicamento?.fecha_termino || "—"}</p>
            </div>
        </div>
    );
}

export default FichaClinica;
