# Sistema de Base de Datos Médica

Sistema simple para practicar consultas SQL básicas y relacionadas en una base de datos médica.

## Instalación

1. Activar entorno virtual:
```bash
cd /home/benja/trabajobd
source proyecto_venv/bin/activate
```

2. Ir al directorio del proyecto:
```bash
cd "ProyectoBD-main listo"
```

3. Ejecutar el servidor:
```bash
python app_sql.py
```

4. Abrir navegador en: http://localhost:5003

## Uso

### SQL Básico
- INSERT: Insertar nuevos registros
- SELECT: Consultar datos
- UPDATE: Actualizar registros
- DELETE: Eliminar registros
- CREATE: Crear nuevas tablas
- DROP: Eliminar tablas

### SQL Relacionado
- INNER JOIN: Pacientes con medicamentos
- LEFT JOIN: Todos los pacientes
- Funciones agregadas: Estadísticas por médico
- Subconsultas: Análisis avanzado

## Ejemplos de Consultas

### Consultar pacientes:
```sql
SELECT * FROM residentes ORDER BY nombre;
```

### Pacientes con medicamentos:
```sql
SELECT r.nombre, m.nombre AS medicamento
FROM residentes r
INNER JOIN medicamentos m ON r.rut = m.rut_residente;
```

### Estadísticas por médico:
```sql
SELECT medico_tratante, COUNT(*) as total_pacientes
FROM residentes 
GROUP BY medico_tratante;
```

## Base de Datos

El sistema incluye datos de ejemplo:
- Tabla residentes: Información de pacientes
- Tabla medicamentos: Medicamentos asignados
- Tabla registros_vitales: Signos vitales

## Tecnologías

- Backend: Flask + SQLite
- Frontend: HTML/CSS/JavaScript