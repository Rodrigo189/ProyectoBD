import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BuscarPaciente.css';

function BusquedaPaciente() {
    const navigate = useNavigate();
    const [filtros, setFiltros] = useState({
        paciente: '',
        tipoSigno: '',
        personal: '',
        turno: '',
        fechaInicio: '',
        fechaFin: ''
    });
    const [resultados, setResultados] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const buscar = async () => {
        try {
            const response = await axios.get(`https://eleam.onrender.com/api/registros-vitales`, {
                params: filtros
            });
            setResultados(response.data);
        } catch (error) {
            console.error('Error al buscar:', error);
        }
    };

    return (
        <div className="consulta-container">
            <div className="header">
                <div className="logo"></div>
                <h1>CONSULTA DE SIGNOS VITALES</h1>
            </div>

            <div className="filtros-seccion">
                <h3>Filtros de búsqueda:</h3>
                <div className="filtros-grid">
                    <div className="filtro">
                        <label>Paciente:</label>
                        <input
                            type="text"
                            name="paciente"
                            value={filtros.paciente}
                            onChange={handleInputChange}
                            placeholder="................"
                        />
                    </div>
                    <div className="filtro">
                        <label>Tipo de signo vital:</label>
                        <input
                            type="text"
                            name="tipoSigno"
                            value={filtros.tipoSigno}
                            onChange={handleInputChange}
                            placeholder="......"
                        />
                    </div>
                    <div className="filtro">
                        <label>Fecha inicio:</label>
                        <input
                            type="text"
                            name="fechaInicio"
                            value={filtros.fechaInicio}
                            onChange={handleInputChange}
                            placeholder="dd/mm/aaaa"
                        />
                    </div>
                    <div className="filtro">
                        <label>Personal que registró:</label>
                        <input
                            type="text"
                            name="personal"
                            value={filtros.personal}
                            onChange={handleInputChange}
                            placeholder="....."
                        />
                    </div>
                    <div className="filtro">
                        <label>Fecha fin:</label>
                        <input
                            type="text"
                            name="fechaFin"
                            value={filtros.fechaFin}
                            onChange={handleInputChange}
                            placeholder="dd/mm/aaaa"
                        />
                    </div>
                    <div className="filtro">
                        <label>Turno:</label>
                        <input
                            type="text"
                            name="turno"
                            value={filtros.turno}
                            onChange={handleInputChange}
                            placeholder="........."
                        />
                    </div>
                </div>

                <div className="botones">
                    <button onClick={buscar} className="btn-buscar">BUSCAR</button>
                    <button onClick={() => navigate(-1)} className="btn-volver">Volver al menú</button>
                </div>
            </div>

            <div className="resultados-seccion">
                {resultados.length > 0 && (
                    <table>
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Paciente</th>
                                <th>Signo Vital</th>
                                <th>Valor</th>
                                <th>Personal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {resultados.map((registro, index) => (
                                <tr key={index}>
                                    <td>{registro.fecha}</td>
                                    <td>{registro.nombreResidente}</td>
                                    <td>{registro.tipoSigno}</td>
                                    <td>{registro.valor}</td>
                                    <td>{registro.registradoPor}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default BusquedaPaciente;