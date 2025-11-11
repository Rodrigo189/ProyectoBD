import api from "./api";

/**
 * 🔹 Obtener ficha completa por RUT
 */
export const getFichaCompleta = async (rut) => {
  try {
    const res = await api.get(`/api/fichas/${rut}`);
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener ficha:", error);
    throw error.response?.data || new Error("Error al obtener ficha clínica.");
  }
};

/**
 * 🔹 Crear nueva ficha clínica
 * Guarda en todas las colecciones relacionadas.
 */
export const crearFicha = async (ficha) => {
  try {
    // 1️⃣ Crear ficha principal (Asumiendo que esta es tu lógica)
    // NOTA: Idealmente el backend debería manejar toda esta lógica
    // con una sola llamada a POST /api/fichas
    await api.post("/api/fichas", ficha);
    console.log("✅ Ficha creada");

    const rut_residente = ficha.datos_personales.rut;

    // 2️⃣ Registrar Apoderado
    if (ficha.apoderado?.nombre) {
      await api.post("/api/apoderado", {
        rut_residente,
        ...ficha.apoderado,
      });
      console.log("✅ Apoderado guardado");
    }

    // 3️⃣ Registrar Residente
    // (Aseguramos los campos que necesita este endpoint)
    await api.post("/api/residentes", {
      rut: rut_residente,
      nombre: ficha.datos_personales.nombre,
      edad: ficha.datos_personales.edad,
      sexo: ficha.datos_personales.sexo,
      peso: ficha.datos_personales.peso,
      estado_civil: ficha.datos_sociales.estado_civil,
      religion: ficha.datos_sociales.religion,
      habitacion: ficha.ubicacion.habitacion,
      prevision_salud: ficha.datos_personales.prevision_salud,
      prevision_social: ficha.datos_personales.prevision_social,
      direccion: ficha.datos_personales.direccion_actual,
      calidad_apoyo: ficha.datos_sociales.calidad_apoyo,
      vive_solo: ficha.datos_sociales.vive_solo,
      apoderado: ficha.apoderado.nombre || "",
    });
    console.log("✅ Residente creado");

    // 4️⃣ Registrar Historia Clínica
    await api.post("/api/historia", {
      rut_residente,
      categoria_residente: ficha.historia_clinica.categoria_residente,
      alergias: ficha.historia_clinica.alergias,
      examenes: ficha.historia_clinica.examenes,
      medicamentos_asociados: ficha.historia_clinica.medicamentos_asociados,
    });
    console.log("✅ Historia clínica guardada");

    // 5️⃣ Registrar Alergias (si existen)
    if (ficha.historia_clinica.alergias?.trim()) {
      await api.post("/api/alergias", {
        rut_residente,
        descripcion: ficha.historia_clinica.alergias,
      });
      console.log("✅ Alergias registradas");
    }

    // 6️⃣ Registrar Patologías
    await api.post("/api/patologias", {
      rut_residente,
      ...ficha.antecedentes_medicos,
    });
    console.log("✅ Patologías guardadas");

    // 7️⃣ Registrar Ingreso / Habitación
    if (ficha.ubicacion?.habitacion) {
      await api.post("/api/ingresos", {
        rut_residente,
        ...ficha.ubicacion,
      });
      console.log("✅ Ingreso registrado");
    }

    // 8️⃣ Registrar Atenciones (si existen)
    if (ficha.historia_clinica.historial_atenciones?.length > 0) {
      for (const at of ficha.historia_clinica.historial_atenciones) {
        // Asumiendo que las atenciones nuevas no tienen ID y se crean
        await api.post("/api/atenciones", {
          rut_residente,
          fecha: at.fecha,
          hora: at.hora,
          motivo: at.motivo,
          tratante: at.tratante,
          medicamentos: at.medicamentos,
        });
      }
      console.log("✅ Atenciones guardadas");
    }

    return; // Devolvemos éxito
  } catch (error) {
    console.error("❌ Error al crear ficha completa:", error);
    throw error.response?.data || new Error("Error al crear ficha clínica.");
  }
};

/**
 * 🔹 Actualizar ficha existente
 * (CORREGIDO - Ahora actualiza todas las colecciones)
 */
export const updateFicha = async (rut, ficha) => {
  try {
    const rut_residente = rut; // Usamos el rut de la URL

    // 1️⃣ Actualizar ficha principal
    await api.put(`/api/fichas/${rut_residente}`, ficha);
    console.log("✅ Ficha principal actualizada");

    // 2️⃣ Actualizar Apoderado
    await api.put(`/api/apoderado/${rut_residente}`, {
      rut_residente,
      ...ficha.apoderado,
    });
    console.log("✅ Apoderado actualizado");

    // 3️⃣ Actualizar Residente
    await api.put(`/api/residentes/${rut_residente}`, {
      rut: rut_residente,
      nombre: ficha.datos_personales.nombre,
      edad: ficha.datos_personales.edad,
      sexo: ficha.datos_personales.sexo,
      peso: ficha.datos_personales.peso,
      estado_civil: ficha.datos_sociales.estado_civil,
      religion: ficha.datos_sociales.religion,
      habitacion: ficha.ubicacion.habitacion,
      prevision_salud: ficha.datos_personales.prevision_salud,
      prevision_social: ficha.datos_personales.prevision_social,
      direccion: ficha.datos_personales.direccion_actual,
      calidad_apoyo: ficha.datos_sociales.calidad_apoyo,
      vive_solo: ficha.datos_sociales.vive_solo,
      apoderado: ficha.apoderado.nombre || "",
    });
    console.log("✅ Residente actualizado");

    // 4️⃣ Actualizar Historia Clínica
    await api.put(`/api/historia/${rut_residente}`, {
      rut_residente,
      categoria_residente: ficha.historia_clinica.categoria_residente,
      alergias: ficha.historia_clinica.alergias,
      examenes: ficha.historia_clinica.examenes,
      medicamentos_asociados: ficha.historia_clinica.medicamentos_asociados,
    });
    console.log("✅ Historia clínica actualizada");

    // 5️⃣ Actualizar Alergias (puede ser PUT o POST si no existe)
    await api.put(`/api/alergias/${rut_residente}`, {
        rut_residente,
        descripcion: ficha.historia_clinica.alergias,
    }).catch(async (err) => {
        if(err.response.status === 404) { // Si no existe, lo crea
            await api.post("/api/alergias", {
                rut_residente,
                descripcion: ficha.historia_clinica.alergias,
            });
        }
    });
    console.log("✅ Alergias actualizadas");

    // 6️⃣ Actualizar Patologías
    await api.put(`/api/patologias/${rut_residente}`, {
      rut_residente,
      ...ficha.antecedentes_medicos,
    });
    console.log("✅ Patologías actualizadas");

    // 7️⃣ Actualizar Ingreso / Habitación
    await api.put(`/api/ingresos/${rut_residente}`, {
        rut_residente,
        ...ficha.ubicacion,
    }).catch(async (err) => {
        if(err.response.status === 404 && ficha.ubicacion?.habitacion) { // Si no existe, lo crea
            await api.post("/api/ingresos", {
                rut_residente,
                ...ficha.ubicacion,
            });
        }
    });
    console.log("✅ Ingreso actualizado");

    // 8️⃣ Actualizar Atenciones
    // Esta lógica es compleja: debe borrar las eliminadas,
    // actualizar las existentes (PUT) y crear las nuevas (POST).
    // Por simplicidad, borramos todas y las creamos de nuevo.
    // (Una mejor solución usaría IDs únicos por atención)
    await api.delete(`/api/atenciones/${rut_residente}`).catch(() => {});
    console.log("... Historial de atenciones limpiado, re-creando...");
    
    if (ficha.historia_clinica.historial_atenciones?.length > 0) {
      for (const at of ficha.historia_clinica.historial_atenciones) {
        await api.post("/api/atenciones", {
          rut_residente,
          fecha: at.fecha,
          hora: at.hora,
          motivo: at.motivo,
          tratante: at.tratante, // Tu form usa 'tratante'
          medicamentos: at.medicamentos,
          // El servicio 'crearFicha' usaba 'profesional',
          // asegúrate que el backend acepte 'tratante' o cámbialo aquí.
        });
      }
      console.log("✅ Atenciones actualizadas");
    }

    return; // Devolvemos éxito

  } catch (error) {
    console.error("❌ Error al actualizar ficha completa:", error);
    throw error.response?.data || new Error("Error al actualizar ficha clínica.");
  }
};


/**
 * 🔹 Eliminar ficha y registros relacionados
 */
export const deleteFicha = async (rut) => {
  try {
    // Tu lógica de delete es correcta, asumiendo que el backend la soporta
    await api.delete(`/api/fichas/${rut}`);
    await api.delete(`/api/apoderado/${rut}`).catch(() => {});
    await api.delete(`/api/residentes/${rut}`).catch(() => {});
    await api.delete(`/api/historia/${rut}`).catch(() => {});
    await api.delete(`/api/patologias/${rut}`).catch(() => {});
    await api.delete(`/api/alergias/${rut}`).catch(() => {});
    await api.delete(`/api/atenciones/${rut}`).catch(() => {});
    await api.delete(`/api/ingresos/${rut}`).catch(() => {}); // Faltaba este
    console.log("✅ Ficha y registros asociados eliminados");
  } catch (error) {
    console.error("❌ Error al eliminar ficha:", error);
    throw error.response?.data || new Error("Error al eliminar ficha clínica.");
  }
};