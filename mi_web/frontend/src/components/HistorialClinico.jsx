import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../HistorialClinico.css';

function HistorialClinico() {
    const { rut } = useParams();
    const navigate = useNavigate();
    const [registros, setRegistros] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarHistorial = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/historial-clinico/${rut}`);
                setRegistros(response.data);
                setError('');
            } catch (err) {
                setError('Error al cargar el historial clínico');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        cargarHistorial();
    }, [rut]);

    const handleNuevoRegistro = () => {
        navigate(`/formulario-signos-vitales/${rut}`);
    };

    const handleVolver = () => {
        navigate(-1); // Vuelve a la página anterior
    };

    const handleBuscarPaciente = () => {
        navigate('/buscar-paciente');
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="historial-clinico-container">
            <div className="header">
            <div
            className="logo"
            style={{ backgroundImage: "url('/image.png')" }}
            ></div>
                <h1>HISTORIAL DEL CLÍNICO</h1>
            </div>

            <div className="info-paciente">
                <p><strong>Nombre residente:</strong> Juan Pérez</p>
                <p><strong>RUN:</strong> {rut}</p>
                <p><strong>Médico tratante:</strong> Dr. García</p>
                <p><strong>Próximo control:</strong> 2025-10-22</p>
            </div>

            <div className="botones-container">
                <button onClick={handleBuscarPaciente} className="btn-accion">
                    BUSCAR PACIENTE
                </button>
                <button onClick={handleVolver} className="btn-accion">
                    VOLVER AL MENÚ
                </button>
                <button onClick={handleNuevoRegistro} className="btn-accion">
                    GENERAR NUEVOS REPORTS
                </button>
            </div>

            <div className="ultimos-registros">
                <h3>Últimos registros:</h3>
                <div className="tabla-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Signo Vital</th>
                                <th>Valor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {registros.map((registro, index) => (
                                <tr key={index}>
                                    <td>{registro.fecha}</td>
                                    <td>{registro.hora}</td>
                                    <td>{registro.signoVital}</td>
                                    <td>{registro.valor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default HistorialClinico;
