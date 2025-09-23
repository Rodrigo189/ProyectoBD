# Instrucciones de Uso

## Ejecutar el Sistema

1. **Activar entorno virtual:**
```bash
cd /home/benja/trabajobd
source proyecto_venv/bin/activate
```

2. **Iniciar servidor:**
```bash
cd "ProyectoBD-main listo"
python app_sql.py
```

3. **Acceder a la aplicación:**
- URL: http://localhost:5003
- Cargar datos de ejemplo con el botón "Cargar Datos de Ejemplo"

## Funcionalidades

### SQL Básico
- **INSERT:** Agregar nuevos pacientes
- **SELECT:** Consultar información
- **UPDATE:** Modificar registros existentes
- **DELETE:** Eliminar registros
- **CREATE:** Crear nuevas tablas
- **DROP:** Eliminar tablas

### SQL Relacionado
- **INNER JOIN:** Datos relacionados entre tablas
- **LEFT JOIN:** Incluir todos los registros de la tabla principal
- **Funciones Agregadas:** COUNT, AVG, etc.
- **Subconsultas:** Consultas dentro de consultas

## Ejemplos Prácticos

### Insertar paciente:
```sql
INSERT INTO residentes (rut, nombre, fecha_nacimiento, medico_tratante, diagnostico) 
VALUES ('12345678-9', 'Juan Pérez', '1950-01-15', 'Dr. García', 'Hipertensión');
```

### Buscar pacientes por médico:
```sql
SELECT nombre, diagnostico 
FROM residentes 
WHERE medico_tratante = 'Dr. García';
```

### Contar pacientes por médico:
```sql
SELECT medico_tratante, COUNT(*) as total
FROM residentes 
GROUP BY medico_tratante;
```