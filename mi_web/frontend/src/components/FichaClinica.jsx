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
    if (error) return <div>Error: {error}</div>;
    if (!paciente) return <div>No se encontró la ficha clínica</div>;

    return (
        <div className="ficha-clinica">
            <h2>Ficha Clínica</h2>
            
            <div className="seccion-datos">
                <h3>Datos del Paciente</h3>
                <p><strong>RUT:</strong> {rut}</p>
                <p><strong>Nombre:</strong> {paciente.nombre}</p>
            </div>

            <div className="seccion-medica">
                <h3>Información Médica</h3>
                <p><strong>Médico Tratante:</strong> {paciente.medicoTratante}</p>
                <p><strong>Próximo Control:</strong> {paciente.proximoControl}</p>
                <p><strong>Diagnóstico:</strong> {paciente.diagnostico}</p>
            </div>

            <div className="seccion-medicamentos">
                <h3>Medicamentos</h3>
                <p><strong>Medicamento:</strong> {paciente.medicamento}</p>
                <p><strong>Dosis:</strong> {paciente.dosis}</p>
                <p><strong>Médico Indicador:</strong> {paciente.medicoIndicador}</p>
                <p><strong>Caso SOS:</strong> {paciente.casoSOS}</p>
            </div>
        </div>
    );
}

export default FichaClinica;
