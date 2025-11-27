import React, { useState } from 'react';
import axios from 'axios';
import '../styles/ConsultaSignosVitales.css';

function ConsultaSignosVitales() {
    const [rut, setRut] = useState('');
    const [fecha, setFecha] = useState('');
    const [signos, setSignos] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSignos(null);

        try {
            const response = await axios.get(`http://localhost:5000/api/registros-vitales/${rut}?fecha=${fecha}`);
            if (response.data && response.data.length > 0) {
                setSignos(response.data);
            } else {
                setError('No se encontraron registros para la fecha especificada');
            }
        } catch (err) {
            setError('Error al consultar los signos vitales');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="consulta-container">
            <h2>Consulta de Signos Vitales</h2>
            
            <form onSubmit={handleSubmit} className="consulta-form">
                <div className="form-group">
                    <label htmlFor="rut">RUT del Paciente:</label>
                    <input
                        type="text"
                        id="rut"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                        placeholder="Ej: 12345678-9"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="fecha">Fecha:</label>
                    <input
                        type="date"
                        id="fecha"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="consulta-button" disabled={loading}>
                    {loading ? 'Consultando...' : 'Consultar'}
                </button>
            </form>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {signos && (
                <div className="resultados-container">
                    <h3>Resultados</h3>
                    <table className="signos-table">
                        <thead>
                            <tr>
                                <th>Hora</th>
                                <th>Tipo</th>
                                <th>Valor</th>
                                <th>Observaciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {signos.map((signo, index) => (
                                <tr key={index}>
                                    <td>{signo.hora}</td>
                                    <td>{signo.tipo}</td>
                                    <td>{signo.valor}</td>
                                    <td>{signo.observaciones}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ConsultaSignosVitales;
