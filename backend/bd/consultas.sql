
/*Ejemplo: INSERT INTO paciente (fec_nac, nombre, rut) 
VALUES ('1990-01-01','Carlos López', '12345678-9');*/
-- nombre: insert_paciente
INSERT INTO paciente (rut, nombre, apellido1, apellido2, fec_nac)
VALUES (%s, %s, %s, %s, %s);


/*Ejemplo: INSERT INTO contrato (rut_empleado, nombre, genero, especialidad) 
VALUES ('12345678-9', 'Carlos López', 'H', 'Medico');*/
-- nombre: insert_contrato
INSERT INTO contrato (rut_empleado, nombre, apellido_paterno, apellido_materno, genero, especialidad, inicio_de_contrato, sueldo_bruto, telefono1)
VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);

/*Ejemplo: INSERT INTO urgencias_medicas (id_urgencia, observacion, fecha,) 
VALUES (3, 'Fractura de pierna', '2025-09-21');*/
-- nombre: insert_urgencia_medica
INSERT INTO urgencias_medicas (id_urgencia, rut_paciente, fecha, observacion, ala, procedimiento) 
VALUES (%s, %s, %s ,%s ,%s ,%s);


-- nombre: select_pacientes
SELECT * FROM paciente;

-- nombre: select_reportes_empleados
SELECT c.nombre, c.rut_empleado, r.rut_paciente
FROM reportes r
JOIN tiene_reporte tr ON r.id_reporte = tr.id_reporte
JOIN contrato c ON tr.rut_empleado= c.rut_empleado;

-- nombre: select_pacientes_empleados
SELECT u.observacion, c.nombre, c.correo
FROM urgencias_medicas u
JOIN tiene_urgencia tu ON u.id_urgencia = tu.id_urgencia
JOIN contrato c ON tu.rut_empleado = c.rut_empleado;


/*Ejemplo: UPDATE paciente 
SET nombre = 'Carlos A. López' 
WHERE rut = '12345678-9';*/
-- nombre: update_paciente
UPDATE paciente
SET nombre = %s, apellido1 = %s, apellido2 = %s, fec_nac = %s
WHERE rut = %s;

/*Ejemplo: UPDATE contrato 
SET direccion = 'Calle Real 123'
WHERE rut_empleado = '12345678-9';*/
-- nombre: update_contrato
UPDATE paciente
SET nombre = %s, apellido_paterno = %s, apellido_materno = %s, rut_empleado = %s
WHERE rut_empleado = %s;

-- Ejemplo: DELETE FROM paciente WHERE rut = '12345678-9';
-- nombre: delete_paciente
DELETE FROM paciente WHERE rut = %s;

/*Ejempo: DELETE FROM urgencias_medicas WHERE id_urgencia = 3;*/
-- nombre: delete_urgencia_medica
DELETE FROM urgencias_medicas WHERE id_urgencia = %s;

/*
Estas instrucciones DDL no se ocupan en las API REST, solo estan
como ejemplos.

ALTER TABLE paciente ADD COLUMN telefono VARCHAR(15);


ALTER TABLE contrato MODIFY correo VARCHAR(35);


DROP TABLE IF EXISTS reemplazos;
*/