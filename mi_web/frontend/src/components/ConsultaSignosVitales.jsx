import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../ConsultaSignosVitales.css';

function ConsultaSignosVitales() {
    const navigate = useNavigate();
    const { rut } = useParams();
    
    console.log('ConsultaSignosVitales - RUT recibido:', rut);

    const registros = [
        { fecha: '2025-11-01', signoVital: 'Presión Arterial', valor: '120/80 mmHg', personal: 'Dr. Martínez' },
        { fecha: '2025-11-01', signoVital: 'Temperatura', valor: '36.5 °C', personal: 'Dr. Martínez' },
        { fecha: '2025-11-01', signoVital: 'Frecuencia Cardíaca', valor: '75 lpm', personal: 'Dr. Martínez' },
        { fecha: '2025-11-01', signoVital: 'Saturación O2', valor: '98%', personal: 'Dr. Martínez' }
    ];

    return (
        <div className="dashboard-container">
            <div className="banner">
                <div className="logo"></div>
                <h1>Portal ELEAM Residente</h1>
            </div>

            <div className="contenido">
                <h2>Historial de Signos Vitales</h2>
                <h3>RUT: {rut}</h3>
                
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Signo Vital</th>
                            <th>Valor</th>
                            <th>Personal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {registros.map((registro, index) => (
                            <tr key={index}>
                                <td>{registro.fecha}</td>
                                <td>{registro.signoVital}</td>
                                <td>{registro.valor}</td>
                                <td>{registro.personal}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="botones">
                    <button onClick={() => navigate(`/dashboard?rut=${rut}`)}>Volver</button>
                    <button onClick={() => navigate('/')}>Salir</button>
                </div>
            </div>
        </div>
    );
}

export default ConsultaSignosVitales;
