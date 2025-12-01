import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function HistorialDetallado() {
    const { rut } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarDetalles = async () => {
            try {
                const response = await axios.get(`https://eleam.onrender.com/api/residentes/${rut}`);
                setPaciente(response.data);
                setError('');
            } catch (err) {
                setError('Error al cargar los detalles del paciente');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        cargarDetalles();
    }, [rut]);

    const volverHistorial = () => {
        navigate(`/historial-clinico/${rut}`);
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!paciente) return <div>No se encontraron datos del paciente</div>;

    return (
        <div className="container">
            <h2>Detalles del Paciente</h2>
            <div className="detalles-paciente">
                <p><strong>Nombre:</strong> {paciente.nombre}</p>
                <p><strong>RUT:</strong> {rut}</p>
                <p><strong>Médico Tratante:</strong> {paciente.medicoTratante}</p>
                <p><strong>Próximo Control:</strong> {paciente.proximoControl}</p>
                <p><strong>Diagnóstico:</strong> {paciente.diagnostico}</p>
                
                <h3>Medicamentos Actuales</h3>
                <p><strong>Medicamento:</strong> {paciente.medicamento}</p>
                <p><strong>Dosis:</strong> {paciente.dosis}</p>
                <p><strong>Médico Indicador:</strong> {paciente.medicoIndicador}</p>
                <p><strong>Caso SOS:</strong> {paciente.casoSOS}</p>
            </div>
            
            <button onClick={volverHistorial} className="btn btn-primary">
                Volver al Historial
            </button>
        </div>
    );
}

export default HistorialDetallado;
