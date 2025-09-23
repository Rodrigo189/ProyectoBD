# 🏥 Sistema de Gestión de Base de Datos Médica
## Guía Completa de Uso

### 📋 Descripción General
Este sistema te proporciona una interfaz web completa para realizar consultas SQL básicas y avanzadas en una base de datos médica. Incluye datos de 17+ pacientes con medicamentos, registros vitales y personal médico.

---

## 🚀 Cómo Ejecutar el Sistema

### 1. **Preparar el Entorno**
```bash
# Asegúrate de estar en el directorio correcto
cd "/home/benja/trabajobd/ProyectoBD-main listo"

# Activar el entorno virtual
source ../proyecto_venv/bin/activate
```

### 2. **Ejecutar los Servidores**

#### Sistema SQL Principal (Puerto 5002):
```bash
# Desde la raíz del proyecto
python3 app_sql.py
```
- **URL:** http://localhost:5002
- **Función:** Interfaces de consultas SQL básicas y avanzadas

#### Backend Original (Puerto 5000) - Opcional:
```bash
cd mi_web/backend
python3 app.py
```
- **URL:** http://localhost:5000
- **Función:** Sistema médico original (React + Flask)

#### Frontend React (Puerto 3000) - Opcional:
```bash
cd mi_web/frontend
npm start
```
- **URL:** http://localhost:3000
- **Función:** Interfaz principal del sistema médico

---

## 🎯 Funcionalidades del Sistema

### 🔧 **SQL Básico** (`http://localhost:5001/sql-basico`)
6 operaciones fundamentales de SQL:

1. **📝 INSERT** - Insertar nuevos pacientes
   - Formulario interactivo para agregar pacientes
   - Genera consultas INSERT dinámicas
   
2. **🔍 SELECT** - Consultar datos
   - Todos los pacientes
   - Por médico tratante
   - Por rango de edad
   - Ingresos recientes
   - Pacientes con medicamentos

3. **✏️ UPDATE** - Actualizar información
   - Modificar médico tratante
   - Actualizar diagnósticos
   - Cambiar fechas de control

4. **🗑️ DELETE** - Eliminar registros
   - Eliminar pacientes específicos
   - Limpiar registros antiguos
   - Remover medicamentos vencidos

5. **🏗️ CREATE TABLE** - Crear nuevas tablas
   - Tabla de alergias
   - Tabla de citas médicas
   - Tabla de exámenes
   - Tabla de habitaciones

6. **💥 DROP TABLE** - Eliminar tablas
   - Con validaciones de seguridad
   - Advertencias de seguridad

### 🔗 **SQL Avanzado** (`http://localhost:5001/sql-relacionado`)
6 operaciones avanzadas con relaciones:

1. **🔄 INNER JOIN** - Pacientes con medicamentos
   - Solo pacientes que tienen medicamentos
   - Filtros por médico, medicamento, SOS

2. **↪️ LEFT JOIN** - Todos los pacientes
   - Incluye pacientes sin medicamentos
   - Estadísticas completas

3. **📊 SUBCONSULTAS** - Análisis avanzado
   - Pacientes con más medicamentos que el promedio
   - Comparaciones dinámicas
   - Análisis de patrones

4. **📈 FUNCIONES AGREGADAS** - Estadísticas
   - Estadísticas por médico
   - Distribución por edad
   - Ingresos por mes
   - Medicamentos más utilizados

5. **🎯 CONSULTAS COMPLEJAS** - Multi-tabla
   - Perfil completo del paciente
   - Análisis de adherencia
   - Evaluación de riesgo
   - Carga de trabajo por funcionario

6. **👁️ VISTAS Y PROCEDIMIENTOS** - Automatización
   - Crear vistas de resumen
   - Procedimientos almacenados
   - Funciones personalizadas
   - Triggers de auditoría

---

## 📊 Base de Datos Poblada

### **Pacientes:** 17+ residentes con datos completos
- Información demográfica completa
- Diagnósticos variados (hipertensión, diabetes, demencia, etc.)
- Fechas de ingreso y controles programados

### **Funcionarios:** 10 profesionales
- Médicos especialistas (geriatras, cardiólogos, neurólogos)
- Personal de enfermería
- Diferentes turnos de trabajo

### **Medicamentos:** 25+ prescripciones
- Medicamentos regulares y SOS
- Diferentes dosis y frecuencias
- Medicamentos activos y terminados

### **Registros Vitales:** 15+ mediciones
- Presión arterial
- Temperatura
- Glucemia
- Saturación de oxígeno
- Frecuencia cardíaca
- Peso y diuresis

---

## 🌐 URLs de Acceso

| Funcionalidad | URL | Descripción |
|---------------|-----|-------------|
| **Portal Principal** | http://localhost:5002 | Página de inicio con navegación |
| **SQL Básico** | http://localhost:5002/sql-basico | Consultas fundamentales |
| **SQL Avanzado** | http://localhost:5002/sql-relacionado | JOINs y subconsultas |
| **Sistema Original** | http://localhost:3000 | Interfaz React original |

---

## 🛠️ Endpoints de API Disponibles

### **Consultas Básicas:**
- `GET /api/patients` - Lista de pacientes
- `GET /api/patients/<rut>` - Detalle de paciente
- `GET /api/medications` - Lista de medicamentos
- `GET /api/vital-signs` - Signos vitales recientes

### **Consultas Avanzadas:**
- `GET /api/patients-with-medications` - INNER JOIN
- `GET /api/all-patients-medications` - LEFT JOIN
- `GET /api/doctor-statistics` - Estadísticas por médico
- `GET /api/risk-assessment` - Evaluación de riesgo

### **Utilidades:**
- `POST /api/execute-sql` - Ejecutar SQL personalizado
- `GET /api/test` - Prueba de conexión

---

## 📝 Ejemplos de Uso

### **1. Consultar todos los pacientes:**
```sql
SELECT rut, nombre, fecha_nacimiento, 
       YEAR(CURDATE()) - YEAR(fecha_nacimiento) AS edad,
       medico_tratante, diagnostico
FROM residentes 
ORDER BY nombre;
```

### **2. Pacientes con medicamentos (INNER JOIN):**
```sql
SELECT 
    r.rut, r.nombre AS paciente,
    m.nombre AS medicamento, m.dosis
FROM residentes r
INNER JOIN medicamentos m ON r.rut = m.rut_residente
ORDER BY r.nombre;
```

### **3. Estadísticas por médico:**
```sql
SELECT 
    medico_tratante,
    COUNT(*) as total_pacientes,
    AVG(YEAR(CURDATE()) - YEAR(fecha_nacimiento)) as edad_promedio
FROM residentes 
GROUP BY medico_tratante;
```

---

## 🔒 Consideraciones de Seguridad

- **Validaciones SQL:** El sistema bloquea consultas peligrosas
- **Consultas Bloqueadas:** DROP DATABASE, TRUNCATE, DELETE masivos
- **Modo Desarrollo:** No usar en producción
- **Backup:** Siempre hacer respaldo antes de modificaciones

---

## 🎨 Características de la Interfaz

- **Diseño Responsivo:** Funciona en desktop y móviles
- **Código Sintaxis:** Resaltado de código SQL
- **Copiar al Portapapeles:** Un clic para copiar consultas
- **Formularios Dinámicos:** Generación interactiva de consultas
- **Navegación Intuitiva:** Enlaces entre secciones
- **Feedback Visual:** Indicadores de estado y resultados

---

## 🚨 Solución de Problemas

### **Error de conexión a BD:**
1. Verificar que MySQL esté ejecutándose
2. Comprobar credenciales en `app_sql.py`
3. Verificar que la base de datos `proyectobd` exista

### **Puerto en uso:**
```bash
# Cambiar puerto en app_sql.py línea final
app.run(debug=True, host='0.0.0.0', port=5002)  # Cambiar puerto
```

### **Módulos no encontrados:**
```bash
# Reinstalar dependencias
source ../proyecto_venv/bin/activate
pip install flask flask-cors pymysql
```

---

## 📚 Archivos del Sistema

- **`app_sql.py`** - Servidor Flask con APIs
- **`sql_basico.html`** - Interfaz de consultas básicas
- **`sql_relacionado.html`** - Interfaz de consultas avanzadas
- **`populate_db.sql`** - Script de datos de ejemplo
- **`setup_db.sql`** - Estructura de la base de datos

---

## 🎯 Próximos Pasos Sugeridos

1. **Conectar con MySQL real** (actualmente usa datos simulados)
2. **Agregar autenticación** para mayor seguridad
3. **Implementar exportación** de resultados a Excel/PDF
4. **Crear más vistas personalizadas** según necesidades específicas
5. **Agregar gráficos** para visualización de datos

---

**¡El sistema está listo para usar! 🎉**

Puedes comenzar explorando las diferentes interfaces y probando las consultas SQL que se generan automáticamente.