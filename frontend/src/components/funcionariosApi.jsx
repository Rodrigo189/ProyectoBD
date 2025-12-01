import perfil from "../img/perfil.png";

// --- Helpers de API (usa proxy https://eleam.onrender.com desde package.json) ---
const token = () => localStorage.getItem("token");
const authHeaders = () => (token() ? { Authorization: `Bearer ${token()}` } : {});

async function apiFetch(path, opts = {}) {
    const res = await fetch(path, {
        headers: { "Content-Type": "application/json", ...authHeaders(), ...(opts.headers || {}) },
        ...opts,
    });
    if (!res.ok) throw await res.json().catch(() => ({ error: res.status }));
    return res.json();
}

// Agregado: login real (JWT)
export const loginApi = ({ username, rut, password }) =>
    apiFetch("/api/auth/login", { method: "POST", body: JSON.stringify({ username, rut, password }) });

// Normaliza el funcionario del backend a la forma usada en el front
function normalizeFuncionario(d) {
    return {
        id: d.rut,
        rut: d.rut,
        run: d.rut,
        nombre: d.nombre,
        apellido: d.apellido,
        cargo: d.cargo || "",
        email: d.email || "",
        telefono: d.telefono || "",
        direccion: d.direccion || "",
        nacimiento: d.nacimiento || "",
        avatar: d.avatar || perfil,
        tipoContrato: d.tipoContrato || "Indefinido",
        inicio: d.inicio || d.inicioContrato || "",
        termino: d.termino || d.terminoContrato || "",
        sueldoBruto: d.sueldoBruto || 0,
        sueldoLiquido: d.sueldoLiquido || 0,
        bonos: d.bonos || 0,
        fechaPago: d.fechaPago || "",
    };
}

// --- API Real ---

// Lista de funcionarios
export async function listFuncionarios() {
    const data = await apiFetch("/api/funcionarios");
    return (data || []).map(normalizeFuncionario);
}

// Detalle por RUT
export async function fetchFuncionarioById(idOrRut) {
    const d = await apiFetch(`/api/funcionarios/${encodeURIComponent(idOrRut)}`);
    return normalizeFuncionario(d);
}

// NUEVO: obtener registros SIS por RUT (para dashboard)
export async function fetchSisByRut(rut) {
    return apiFetch(`/api/sis/${encodeURIComponent(rut)}`);
}

// AGREGADO: Obtener datos del sistema por usuario (alias para SistemaPage)
export async function fetchSistemaByUser(idOrRut) {
    return apiFetch(`/api/sis/${encodeURIComponent(idOrRut)}`);
}

// Resumen mensual: mapea desde /api/sis/<rut>
export async function fetchResumenByUserMonth(idOrRut, month) {
    const sis = await apiFetch(`/api/sis/${encodeURIComponent(idOrRut)}`);
    const horas = Number(sis.horas || 0);
    return {
        diasTrabajados: Math.max(0, Math.round(horas / 8)),
        horas,
        turnosExtra: Number(sis.extra || 0),
        turnosLargos: 0,
        turnosNoche: 0,
        diasLibre: 0,
    };
}

// Historial de turnos: no disponible en backend -> devolver vacío
export async function fetchHistorialByUser(idOrRut) {
    return [];
}

// Actualizar remuneración (PUT /api/funcionarios/:rut)
export async function updateRemuneracion(idOrRut, payload) {
    const res = await fetch(`/api/funcionarios/${encodeURIComponent(idOrRut)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data };
}

// Medicamentos por usuario: placeholder
export async function fetchMedicamentosByUser(idOrRut) {
    return [];
}

// Riesgos reales por usuario
export async function fetchRiesgosByUser(idOrRut) {
    const items = await apiFetch(`/api/riesgos/${encodeURIComponent(idOrRut)}`);
    return Array.isArray(items) ? items : [];
}

// Probabilidades por medicamentos
export async function fetchProbabilidadesMedicamentosByUser(idOrRut) {
    const items = await apiFetch(`/api/probabilidades/${encodeURIComponent(idOrRut)}`);
    return Array.isArray(items) ? items : [];
}

// Estadísticas por usuario
export async function fetchEstadisticasByUser(
    idOrRut,
    { periodo = "mensual", year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = {}
) {
    const sis = await apiFetch(`/api/sis/${encodeURIComponent(idOrRut)}`);
    const horas = Number(sis.horas || 0);
    const turnosExtra = Number(sis.extra || 0);
    const incidentes = Number(sis.incidentes || 0);
    const diasTrabajados = Math.max(0, Math.round(horas / 8));

    if (periodo === "mensual") {
        return {
            userId: idOrRut,
            periodo,
            year,
            month,
            diasTrabajados,
            horas,
            turnosExtra,
            turnosNoche: 0,
            turnosLargos: 0,
            diasLibre: 0,
            incidentes,
        };
    }
    return {
        userId: idOrRut,
        periodo: "anual",
        year,
        diasTrabajados: diasTrabajados * 12,
        horas: horas * 12,
        turnosExtra: turnosExtra * 12,
        turnosNoche: 0,
        turnosLargos: 0,
        diasLibre: 0,
        incidentes: incidentes * 12,
    };
}

// Estadísticas del sistema (placeholder usando /api/sis/<rut> si se pasa userId)
export async function fetchEstadisticasSistema(
    { periodo = "mensual", year = new Date().getFullYear(), month = new Date().getMonth() + 1, sedeId = null, userId = null } = {}
) {
    if (!userId) {
        return {
            periodo, year, month, sedeId, userId: null,
            totals: { funcionariosActivos: 0, horasTotales: 0, turnosExtraTotales: 0, incidentesTotales: 0 },
            distribucionTurnos: { dia: 0, noche: 0, largo: 0 },
            riesgosPorNivel: { bajo: 0, medio: 0, alto: 0 },
            ausentismo: { tasa: 0, justificadas: 0, injustificadas: 0 },
        };
    }
    const sis = await apiFetch(`/api/sis/${encodeURIComponent(userId)}`);
    const horas = Number(sis.horas || 0);
    const extra = Number(sis.extra || 0);
    const inc = Number(sis.incidentes || 0);

    return {
        periodo, year, month, sedeId, userId,
        totals: {
            funcionariosActivos: 1,
            horasTotales: horas,
            turnosExtraTotales: extra,
            incidentesTotales: inc,
        },
        distribucionTurnos: { dia: 62, noche: 24, largo: 14 },
        riesgosPorNivel: { bajo: 9, medio: 4, alto: 2 },
        ausentismo: { tasa: 3.8, justificadas: 9, injustificadas: 4 },
    };
}

// Actualizar probabilidades de un usuario
export async function updateProbabilidades(idOrRut, items) {
    const res = await fetch(`/api/probabilidades/${encodeURIComponent(idOrRut)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ items }),
    });
    if (!res.ok) throw await res.json().catch(() => ({ error: res.status }));
    return res.json();
}

// Actualizar riesgos de un usuario
export async function updateRiesgos(idOrRut, items) {
    const res = await fetch(`/api/riesgos/${encodeURIComponent(idOrRut)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ items }),
    });
    if (!res.ok) throw await res.json().catch(() => ({ error: res.status }));
    return res.json();
}

// Actualizar datos del sistema (SIS) de un usuario
export async function updateSistema(idOrRut, data) {
    const res = await fetch(`/api/sis/${encodeURIComponent(idOrRut)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json().catch(() => ({ error: res.status }));
    return res.json();
}

// Alias compatible
export const fetchFuncionarios = listFuncionarios;