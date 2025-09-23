-- Script para poblar la base de datos con datos de ejemplo
-- ========================================================

USE proyectobd;

-- Primero limpiar datos existentes para evitar duplicados
DELETE FROM registros_vitales;
DELETE FROM medicamentos;
DELETE FROM formularios_turno;
DELETE FROM residentes;
DELETE FROM funcionarios;

-- Insertar funcionarios (médicos, enfermeros, etc.)
INSERT INTO funcionarios (rut, nombre, cargo, clave) VALUES
('11222333-4', 'Dr. Ricardo Martínez', 'Médico General', 'med123'),
('22333444-5', 'Dra. Carolina Sánchez', 'Geriatra', 'ger456'),
('33444555-6', 'Dr. Pablo Herrera', 'Cardiólogo', 'card789'),
('44555666-7', 'Enf. María González', 'Enfermera Jefe', 'enf001'),
('55666777-8', 'Enf. Luis Torres', 'Enfermero', 'enf002'),
('66777888-9', 'Enf. Ana Rojas', 'Enfermera', 'enf003'),
('77888999-0', 'Enf. Carlos Mendoza', 'Enfermero', 'enf004'),
('88999000-1', 'Dra. Sofía Vargas', 'Neuróloga', 'neu123'),
('99000111-2', 'Dr. Fernando Castro', 'Internista', 'int456'),
('10111222-3', 'Enf. Patricia Silva', 'Enfermera', 'enf005');

-- Insertar 15+ residentes/pacientes
INSERT INTO residentes (rut, nombre, fecha_nacimiento, fecha_ingreso, medico_tratante, proximo_control, diagnostico) VALUES
('12345678-9', 'María Elena Pérez', '1935-03-15', '2024-01-10', 'Dr. Ricardo Martínez', '2025-10-15', 'Hipertensión arterial, Diabetes tipo 2'),
('23456789-0', 'José Antonio García', '1940-07-22', '2024-01-15', 'Dra. Carolina Sánchez', '2025-10-20', 'Demencia senil, Hipertensión'),
('34567890-1', 'Carmen Rosa López', '1938-11-08', '2024-02-01', 'Dr. Pablo Herrera', '2025-11-01', 'Insuficiencia cardíaca, Arritmia'),
('45678901-2', 'Roberto Carlos Silva', '1942-05-30', '2024-02-05', 'Dr. Ricardo Martínez', '2025-10-25', 'EPOC, Diabetes tipo 2'),
('56789012-3', 'Esperanza Rodríguez', '1936-09-18', '2024-02-10', 'Dra. Sofía Vargas', '2025-11-05', 'Alzheimer inicial, Hipertensión'),
('67890123-4', 'Manuel Fernando Castro', '1941-12-03', '2024-02-15', 'Dr. Fernando Castro', '2025-10-30', 'Cirrosis hepática, Diabetes'),
('78901234-5', 'Rosa María Morales', '1939-04-25', '2024-03-01', 'Dra. Carolina Sánchez', '2025-11-10', 'Osteoporosis severa, Hipertensión'),
('89012345-6', 'Alejandro Vega', '1943-08-14', '2024-03-05', 'Dr. Pablo Herrera', '2025-11-15', 'Infarto miocardio previo, Angina'),
('90123456-7', 'Inés Beltrán', '1937-01-09', '2024-03-10', 'Dra. Sofía Vargas', '2025-10-28', 'Parkinson, Depresión'),
('01234567-8', 'Pedro Luis Jiménez', '1944-06-17', '2024-03-15', 'Dr. Ricardo Martínez', '2025-11-20', 'Insuficiencia renal crónica'),
('12345123-4', 'Lucía Fernández', '1940-10-12', '2024-04-01', 'Dr. Fernando Castro', '2025-11-25', 'Artritis reumatoide, Hipertensión'),
('23456234-5', 'Arturo González', '1938-02-28', '2024-04-05', 'Dra. Carolina Sánchez', '2025-12-01', 'Cáncer próstata en remisión'),
('34567345-6', 'Elena Martínez', '1941-07-07', '2024-04-10', 'Dr. Pablo Herrera', '2025-12-05', 'Fibrilación auricular, Anticoagulado'),
('45678456-7', 'Raúl Herrera', '1939-11-23', '2024-04-15', 'Dra. Sofía Vargas', '2025-11-30', 'Demencia vascular, Hipertensión'),
('56789567-8', 'Dolores Campos', '1942-03-11', '2024-05-01', 'Dr. Ricardo Martínez', '2025-12-10', 'Diabetes tipo 2, Neuropatía diabética'),
('67890678-9', 'Francisco Rojas', '1936-08-05', '2024-05-05', 'Dr. Fernando Castro', '2025-12-15', 'EPOC severo, Cor pulmonale'),
('78901789-0', 'Mercedes Salinas', '1943-12-19', '2024-05-10', 'Dra. Carolina Sánchez', '2025-12-20', 'Osteoartrosis generalizada');

-- Insertar medicamentos para los residentes
INSERT INTO medicamentos (rut_residente, nombre, dosis, caso_sos, medico_indicador, fecha_inicio, fecha_termino) VALUES
-- Medicamentos para María Elena Pérez
('12345678-9', 'Losartán', '50mg cada 12 horas', FALSE, 'Dr. Ricardo Martínez', '2024-01-10', NULL),
('12345678-9', 'Metformina', '850mg cada 8 horas', FALSE, 'Dr. Ricardo Martínez', '2024-01-10', NULL),
('12345678-9', 'Paracetamol', '500mg', TRUE, 'Dr. Ricardo Martínez', '2024-01-10', NULL),

-- Medicamentos para José Antonio García
('23456789-0', 'Enalapril', '10mg cada 12 horas', FALSE, 'Dra. Carolina Sánchez', '2024-01-15', NULL),
('23456789-0', 'Donepezilo', '5mg por la noche', FALSE, 'Dra. Carolina Sánchez', '2024-01-15', NULL),
('23456789-0', 'Lorazepam', '0.5mg', TRUE, 'Dra. Carolina Sánchez', '2024-01-15', NULL),

-- Medicamentos para Carmen Rosa López
('34567890-1', 'Furosemida', '40mg en ayunas', FALSE, 'Dr. Pablo Herrera', '2024-02-01', NULL),
('34567890-1', 'Carvedilol', '6.25mg cada 12 horas', FALSE, 'Dr. Pablo Herrera', '2024-02-01', NULL),
('34567890-1', 'Warfarina', '5mg por la noche', FALSE, 'Dr. Pablo Herrera', '2024-02-01', NULL),

-- Medicamentos para Roberto Carlos Silva
('45678901-2', 'Salbutamol', '2 puff cada 6 horas', FALSE, 'Dr. Ricardo Martínez', '2024-02-05', NULL),
('45678901-2', 'Insulina NPH', '20 unidades desayuno', FALSE, 'Dr. Ricardo Martínez', '2024-02-05', NULL),
('45678901-2', 'Prednisona', '5mg en ayunas', FALSE, 'Dr. Ricardo Martínez', '2024-02-05', NULL),

-- Medicamentos para Esperanza Rodríguez
('56789012-3', 'Memantina', '10mg cada 12 horas', FALSE, 'Dra. Sofía Vargas', '2024-02-10', NULL),
('56789012-3', 'Amlodipino', '5mg por la mañana', FALSE, 'Dra. Sofía Vargas', '2024-02-10', NULL),
('56789012-3', 'Quetiapina', '25mg por la noche', TRUE, 'Dra. Sofía Vargas', '2024-02-10', NULL),

-- Medicamentos para Manuel Fernando Castro
('67890123-4', 'Espironolactona', '100mg en ayunas', FALSE, 'Dr. Fernando Castro', '2024-02-15', NULL),
('67890123-4', 'Lactulose', '15ml cada 12 horas', FALSE, 'Dr. Fernando Castro', '2024-02-15', NULL),
('67890123-4', 'Glargina', '15 unidades por la noche', FALSE, 'Dr. Fernando Castro', '2024-02-15', NULL),

-- Medicamentos para Rosa María Morales
('78901234-5', 'Alendronato', '70mg semanal', FALSE, 'Dra. Carolina Sánchez', '2024-03-01', NULL),
('78901234-5', 'Calcio + Vitamina D', '1 tableta por la mañana', FALSE, 'Dra. Carolina Sánchez', '2024-03-01', NULL),
('78901234-5', 'Irbesartán', '150mg por la mañana', FALSE, 'Dra. Carolina Sánchez', '2024-03-01', NULL),

-- Medicamentos para Alejandro Vega
('89012345-6', 'Atorvastatina', '40mg por la noche', FALSE, 'Dr. Pablo Herrera', '2024-03-05', NULL),
('89012345-6', 'Clopidogrel', '75mg por la mañana', FALSE, 'Dr. Pablo Herrera', '2024-03-05', NULL),
('89012345-6', 'Metoprolol', '50mg cada 12 horas', FALSE, 'Dr. Pablo Herrera', '2024-03-05', NULL),

-- Medicamentos adicionales para otros pacientes
('90123456-7', 'Levodopa/Carbidopa', '25/250mg cada 8 horas', FALSE, 'Dra. Sofía Vargas', '2024-03-10', NULL),
('90123456-7', 'Sertralina', '50mg por la mañana', FALSE, 'Dra. Sofía Vargas', '2024-03-10', NULL),
('01234567-8', 'Eritropoyetina', '4000 UI 3 veces por semana', FALSE, 'Dr. Ricardo Martínez', '2024-03-15', NULL),
('12345123-4', 'Metotrexato', '15mg semanal', FALSE, 'Dr. Fernando Castro', '2024-04-01', NULL),
('23456234-5', 'Bicalutamida', '50mg por la mañana', FALSE, 'Dra. Carolina Sánchez', '2024-04-05', NULL),
('34567345-6', 'Rivaroxabán', '20mg por la mañana', FALSE, 'Dr. Pablo Herrera', '2024-04-10', NULL),
('45678456-7', 'Rivastigmina', '6mg cada 12 horas', FALSE, 'Dra. Sofía Vargas', '2024-04-15', NULL);

-- Insertar registros vitales para varios pacientes
INSERT INTO registros_vitales (rut_residente, fecha, hora, tipo_signo_vital, valor, unidad, diuresis_dia, diuresis_noche, deposicion, peso, registrado_por, cargo, turno, observaciones) VALUES
-- Registros para María Elena Pérez
('12345678-9', '2024-09-20', '08:00:00', 'Presión Arterial', '140/85', 'mmHg', '800ml', '400ml', 'Normal', 65.5, 'Enf. María González', 'Enfermera Jefe', 'Mañana', 'Paciente estable'),
('12345678-9', '2024-09-20', '14:00:00', 'Temperatura', '36.8', '°C', NULL, NULL, NULL, NULL, 'Enf. Luis Torres', 'Enfermero', 'Tarde', 'Sin novedad'),
('12345678-9', '2024-09-20', '20:00:00', 'Glucemia', '150', 'mg/dL', NULL, NULL, NULL, NULL, 'Enf. Ana Rojas', 'Enfermera', 'Noche', 'Glicemia elevada'),

-- Registros para José Antonio García
('23456789-0', '2024-09-20', '08:30:00', 'Presión Arterial', '120/80', 'mmHg', '600ml', '300ml', 'Constipado', 70.2, 'Enf. María González', 'Enfermera Jefe', 'Mañana', 'Paciente confuso pero colaborador'),
('23456789-0', '2024-09-20', '16:00:00', 'Saturación O2', '95', '%', NULL, NULL, NULL, NULL, 'Enf. Carlos Mendoza', 'Enfermero', 'Tarde', 'Saturación límite'),

-- Registros para Carmen Rosa López
('34567890-1', '2024-09-20', '09:00:00', 'Frecuencia Cardíaca', '88', 'lpm', '1200ml', '500ml', 'Normal', 58.0, 'Enf. Patricia Silva', 'Enfermera', 'Mañana', 'Edema en extremidades inferiores'),
('34567890-1', '2024-09-20', '21:00:00', 'Presión Arterial', '110/70', 'mmHg', NULL, NULL, NULL, NULL, 'Enf. Ana Rojas', 'Enfermera', 'Noche', 'Buena respuesta a tratamiento'),

-- Registros para Roberto Carlos Silva
('45678901-2', '2024-09-20', '07:45:00', 'Glucemia', '180', 'mg/dL', '900ml', '450ml', 'Normal', 72.8, 'Enf. Luis Torres', 'Enfermero', 'Mañana', 'Requiere ajuste de insulina'),
('45678901-2', '2024-09-20', '15:30:00', 'Saturación O2', '92', '%', NULL, NULL, NULL, NULL, 'Enf. Carlos Mendoza', 'Enfermero', 'Tarde', 'Disnea leve'),

-- Registros adicionales para otros pacientes
('56789012-3', '2024-09-20', '10:00:00', 'Presión Arterial', '130/75', 'mmHg', '700ml', '350ml', 'Normal', 55.3, 'Enf. María González', 'Enfermera Jefe', 'Mañana', 'Paciente agitada en la noche'),
('67890123-4', '2024-09-20', '11:00:00', 'Peso', '68.5', 'kg', '1500ml', '600ml', 'Diarreica', NULL, 'Enf. Patricia Silva', 'Enfermera', 'Mañana', 'Pérdida de peso progresiva'),
('78901234-5', '2024-09-20', '12:00:00', 'Temperatura', '37.2', '°C', '500ml', '250ml', 'Constipado', 48.2, 'Enf. Luis Torres', 'Enfermero', 'Tarde', 'Febrícula persistente'),
('89012345-6', '2024-09-21', '08:15:00', 'Presión Arterial', '125/75', 'mmHg', '800ml', '400ml', 'Normal', 75.1, 'Enf. María González', 'Enfermera Jefe', 'Mañana', 'Sin dolor torácico'),
('90123456-7', '2024-09-21', '09:30:00', 'Frecuencia Cardíaca', '75', 'lpm', '650ml', '300ml', 'Normal', 62.8, 'Enf. Ana Rojas', 'Enfermera', 'Mañana', 'Temblor controlado con medicación'),
('01234567-8', '2024-09-21', '10:45:00', 'Glucemia', '95', 'mg/dL', '400ml', '200ml', 'Normal', 58.9, 'Enf. Carlos Mendoza', 'Enfermero', 'Mañana', 'Función renal estable');

-- Insertar formularios de turno
INSERT INTO formularios_turno (nombre, email, hora_ingreso, fecha_ingreso, descripcion_turno, caso_sos, descripcion_sos) VALUES
('Enf. María González', 'maria.gonzalez@clinica.com', '07:00:00', '2024-09-20', 'Turno mañana: Control de signos vitales, administración de medicamentos matutinos, evaluación general de pacientes', FALSE, NULL),
('Enf. Luis Torres', 'luis.torres@clinica.com', '15:00:00', '2024-09-20', 'Turno tarde: Medicamentos vespertinos, control de glicemias, apoyo a pacientes con movilidad reducida', TRUE, 'Paciente García presentó episodio de confusión, se administró Lorazepam según indicación SOS'),
('Enf. Ana Rojas', 'ana.rojas@clinica.com', '23:00:00', '2024-09-20', 'Turno noche: Medicamentos nocturnos, rondas cada 2 horas, control de pacientes inquietos', TRUE, 'Paciente Pérez con glicemia elevada 180mg/dL, se informó a médico de turno'),
('Enf. Carlos Mendoza', 'carlos.mendoza@clinica.com', '07:00:00', '2024-09-21', 'Turno mañana: Cambio de ropa de cama, aseo personal de pacientes, administración de medicamentos', FALSE, NULL),
('Enf. Patricia Silva', 'patricia.silva@clinica.com', '15:00:00', '2024-09-21', 'Turno tarde: Control de peso semanal, curaciones menores, apoyo en alimentación', TRUE, 'Paciente Castro con deposiciones diarreicas, se aumentó hidratación oral');

-- Crear vista útil para consultas
CREATE OR REPLACE VIEW vista_pacientes_completa AS
SELECT 
    r.rut,
    r.nombre,
    r.fecha_nacimiento,
    YEAR(CURDATE()) - YEAR(r.fecha_nacimiento) AS edad,
    r.fecha_ingreso,
    DATEDIFF(CURDATE(), r.fecha_ingreso) AS dias_internacion,
    r.medico_tratante,
    r.proximo_control,
    r.diagnostico,
    COUNT(m.id) AS total_medicamentos,
    COUNT(rv.id) AS total_registros_vitales
FROM residentes r
LEFT JOIN medicamentos m ON r.rut = m.rut_residente
LEFT JOIN registros_vitales rv ON r.rut = rv.rut_residente
GROUP BY r.rut, r.nombre, r.fecha_nacimiento, r.fecha_ingreso, r.medico_tratante, r.proximo_control, r.diagnostico;