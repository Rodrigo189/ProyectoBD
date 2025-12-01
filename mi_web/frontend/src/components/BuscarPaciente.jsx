import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BuscarPaciente.css';

function BuscarPaciente() {
    const [rut, setRut] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post('http://localhost:5000/api/buscar-residente', { rut });
            
            if (response.data.existe) {
                // Si encontramos al paciente, navegamos a su historial
                navigate(`/historial-clinico/${rut}`);
            } else {
                setError('No se encontró ningún paciente con ese RUT');
            }
        } catch (err) {
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Error al buscar el paciente. Por favor intente nuevamente.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="buscar-paciente-container">
            <h2>Buscar Paciente</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>RUT del Paciente:</label>
                    <input
                        type="text"
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                        placeholder="Ingrese RUT (ej: 12345678-9)"
                        required
                    />
                </div>
                
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                
                <div className="buttons-container">
                    <button
                        type="submit"
                        className="btn-buscar"
                        disabled={loading}
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                    <button
                        type="button"
                        className="btn-volver"
                        onClick={() => navigate(-1)}
                    >
                        Volver
                    </button>
                </div>
            </form>
        </div>
    );
}

export default BuscarPaciente;
