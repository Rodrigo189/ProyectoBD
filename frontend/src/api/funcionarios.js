import perfil from "../img/perfil.png";

const STORAGE_KEY = "funcionarios_mock_v2";

// utilidades de random determinístico por usuario
function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h >>> 0;
}
function rng(seedStr) {
    let s = hash(String(seedStr)) || 1;
    return () => {
        s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
        return ((s >>> 0) % 10000) / 10000;
    };
}
function pick(rand, min, max) {
    return Math.floor(rand() * (max - min + 1)) + min;
}
function pad(n) { return String(n).padStart(2, "0"); }
function diaISO(y, m, d) { return `${y}-${pad(m)}-${pad(d)}`; }
function diaSemana(fecha) {
    const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return dias[new Date(fecha).getDay()];
}

function bootstrapDB() {
    const fromLS = localStorage.getItem(STORAGE_KEY);
    if (fromLS) return JSON.parse(fromLS);

    const base = [
        { id: "1", nombre: "Juanito", apellido: "Pérez", run: "11.111.111-1", genero: "Masculino", cargo: "Jefe de Departamento", email: "juan.perez@eleam.cl", telefono: "(+56) 9 1111 1111", direccion: "Av. Siempre Viva 123", nacimiento: "1985-04-22", avatar: perfil },
        { id: "2", nombre: "María", apellido: "Gómez", run: "22.222.222-2", genero: "Femenino", cargo: "Auxiliar", email: "maria.gomez@eleam.cl", telefono: "(+56) 9 2222 2222", direccion: "Calle Palma 45", nacimiento: "1990-08-12", avatar: perfil },
        { id: "3", nombre: "Carlos", apellido: "Ruiz", run: "33.333.333-3", genero: "Masculino", cargo: "Enfermero", email: "carlos.ruiz@eleam.cl", telefono: "(+56) 9 3333 3333", direccion: "Pedro de Valdivia 999", nacimiento: "1988-01-09", avatar: perfil },
        { id: "4", nombre: "Ana", apellido: "Torres", run: "44.444.444-4", genero: "Femenino", cargo: "Médico", email: "ana.torres@eleam.cl", telefono: "(+56) 9 4444 4444", direccion: "Los Laureles 12", nacimiento: "1983-11-30", avatar: perfil },
    ];

    const year = new Date().getFullYear();
    const db = base.map((u) => {
        const r = rng(u.id);

        // resumen mensual 1..12
        const resumen = {};
        for (let m = 1; m <= 12; m++) {
            const diasTrabajados = pick(r, 10, 22);
            const horas = diasTrabajados * pick(r, 7, 9);
            resumen[m] = {
                diasTrabajados,
                horas,
                turnosExtra: pick(r, 0, 4),
                turnosLargos: pick(r, 0, 3),
                turnosNoche: pick(r, 0, 8),
                diasLibre: pick(r, 4, 12),
            };
        }

        // historial: últimos 40 días (sin domingos)
        const historial = [];
        const hoy = new Date();
        for (let i = 0; i < 40; i++) {
            const d = new Date(hoy);
            d.setDate(hoy.getDate() - i);
            if (d.getDay() === 0) continue; // domingo
            const fecha = d.toISOString().slice(0, 10);
            const horas = [6, 8, 10][pick(r, 0, 2)];
            const turno = horas >= 10 ? "Turno Largo" : (pick(r, 0, 1) ? "Mañana" : "Tarde");
            const hIni = horas >= 10 ? "08:00" : (turno === "Mañana" ? "08:00" : "14:00");
            const hFin = horas >= 10 ? "18:00" : (turno === "Mañana" ? "14:00" : "22:00");
            historial.push({
                fecha,
                dia: diaSemana(fecha),
                turno,
                horario: `${hIni} - ${hFin}`,
                horas,
                observaciones: pick(r, 0, 10) > 8 ? "Apoyo extra en sala" : "",
            });
        }

        // riesgos y medicamentos
        const riesgos = [
            { id: `${u.id}-r1`, tipo: "Accidente", nivel: ["Bajo", "Medio", "Alto"][pick(r, 0, 2)], fecha: diaISO(year, pick(r, 1, 12), pick(r, 1, 28)), detalle: "Resbalón en turno" },
            { id: `${u.id}-r2`, tipo: "Salud", nivel: ["Bajo", "Medio", "Alto"][pick(r, 0, 2)], fecha: diaISO(year, pick(r, 1, 12), pick(r, 1, 28)), detalle: "Estrés laboral" },
        ];
        const meds = [
            { id: `${u.id}-m1`, nombre: "Paracetamol", dosis: "500mg", frecuencia: "Cada 8h", desde: diaISO(year, pick(r, 1, 12), pick(r, 1, 28)) },
            { id: `${u.id}-m2`, nombre: "Ibuprofeno", dosis: "400mg", frecuencia: "Cada 12h", desde: diaISO(year, pick(r, 1, 12), pick(r, 1, 28)) },
        ];

        return {
            ...u,
            tipoContrato: "Indefinido",
            inicio: "01/01/2024",
            termino: "31/12/2024",
            sueldoBruto: 1000000,
            sueldoLiquido: 800000,
            bonos: 50000,
            fechaPago: "30/09/2024",
            resumen,
            historial,
            riesgos,
            meds,
        };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
}

function loadDB() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : bootstrapDB();
    } catch {
        return bootstrapDB();
    }
}

function delay(ms = 120) {
    return new Promise((r) => setTimeout(r, ms));
}

// API

export async function listFuncionarios() {
    await delay();
    return loadDB().map((u) => ({ ...u }));
}

export async function fetchFuncionarioById(id) {
    await delay();
    const u = loadDB().find((x) => x.id === String(id));
    return u ? { ...u } : null;
}

/**
 * Devuelve el resumen para un usuario y mes (1..12).
 */
export async function fetchResumenByUserMonth(id, month) {
    await delay();
    const u = loadDB().find((x) => x.id === String(id));
    if (!u) return { diasTrabajados: 0, horas: 0, turnosExtra: 0, turnosLargos: 0, turnosNoche: 0, diasLibre: 0 };
    return u.resumen?.[Number(month)] || { diasTrabajados: 0, horas: 0, turnosExtra: 0, turnosLargos: 0, turnosNoche: 0, diasLibre: 0 };
}

export async function fetchHistorialByUser(id) {
    await delay();
    const u = loadDB().find((x) => x.id === String(id));
    return u ? u.historial.map((h) => ({ ...h })) : [];
}

export async function updateRemuneracion(id, payload) {
    await delay();
    const db = loadDB();
    const idx = db.findIndex((m) => String(m.id) === String(id));
    if (idx === -1) return { ok: false };
    db[idx] = { ...db[idx], ...payload };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return { ok: true, data: { ...db[idx] } };
}

// Datos complementarios por usuario

export async function fetchMedicamentosByUser(userId) {
    await delay();
    const u = loadDB().find((x) => x.id === String(userId));
    return u ? u.meds.map((m) => ({ ...m })) : [];
}

export async function fetchRiesgosByUser(userId) {
    await delay();
    const u = loadDB().find((x) => x.id === String(userId));
    return u ? u.riesgos.map((r) => ({ ...r })) : [];
}

// Probabilidades por medicamento (determinístico por usuario)
export async function fetchProbabilidadesMedicamentosByUser(userId) {
    await delay();
    const rand = rng(`prob-${userId}`);
    const meds = [
        { id: "asp", nombre: "Aspirina", grupo: "Analgésicos" },
        { id: "ibu", nombre: "Ibuprofeno", grupo: "Analgésicos" },
        { id: "par", nombre: "Paracetamol", grupo: "Analgésicos" },
        { id: "amo", nombre: "Amoxicilina", grupo: "Antibióticos" },
        { id: "los", nombre: "Losartán", grupo: "Cardíacos" },
        { id: "met", nombre: "Metformina", grupo: "Antidiabéticos" },
    ];
    // porcentaje 15%..95% por usuario
    return meds.map((m) => {
        const pct = Math.round((0.15 + rand() * 0.8) * 100);
        return { ...m, pct };
    });
}

export async function fetchEstadisticasByUser(
    userId,
    { periodo = "mensual", year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = {}
) {
    await delay();
    const u = loadDB().find((x) => x.id === String(userId));
    if (!u) return null;

    if (periodo === "mensual") {
        const r = u.resumen?.[Number(month)] || {};
        return {
            userId, periodo, year, month,
            diasTrabajados: r.diasTrabajados || 0,
            horas: r.horas || 0,
            turnosExtra: r.turnosExtra || 0,
            turnosNoche: r.turnosNoche || 0,
            turnosLargos: r.turnosLargos || 0,
            diasLibre: r.diasLibre || 0,
            incidentes: Math.max(0, Math.round((r.turnosExtra || 0) / 2 - 0.2)),
        };
    }

    // anual (suma de meses)
    const agg = Object.values(u.resumen || {}).reduce(
        (a, r) => ({
            diasTrabajados: a.diasTrabajados + (r.diasTrabajados || 0),
            horas: a.horas + (r.horas || 0),
            turnosExtra: a.turnosExtra + (r.turnosExtra || 0),
            turnosNoche: a.turnosNoche + (r.turnosNoche || 0),
            turnosLargos: a.turnosLargos + (r.turnosLargos || 0),
            diasLibre: a.diasLibre + (r.diasLibre || 0),
        }),
        { diasTrabajados: 0, horas: 0, turnosExtra: 0, turnosNoche: 0, turnosLargos: 0, diasLibre: 0 }
    );
    return { userId, periodo, year, ...agg, incidentes: Math.round(agg.turnosExtra / 3) };
}

export async function fetchEstadisticasSistema(
    { periodo = "mensual", year = new Date().getFullYear(), month = new Date().getMonth() + 1, sedeId = null, userId = null } = {}
) {
    await delay();
    const db = loadDB();

    const totals = db.reduce(
        (a, u) => {
            const r = u.resumen?.[Number(month)] || {};
            a.funcionariosActivos += 1;
            a.horasTotales += r.horas || 0;
            a.turnosExtraTotales += r.turnosExtra || 0;
            a.incidentesTotales += Math.max(0, Math.round((r.turnosExtra || 0) / 2 - 0.2));
            return a;
        },
        { funcionariosActivos: 0, horasTotales: 0, turnosExtraTotales: 0, incidentesTotales: 0 }
    );

    // “personaliza” levemente si viene userId (solo para diferenciar vista por usuario)
    if (userId) {
        const r = rng(`sis-${userId}`);
        totals.horasTotales = Math.round(totals.horasTotales * (0.95 + r() * 0.1));
        totals.turnosExtraTotales = Math.round(totals.turnosExtraTotales * (0.9 + r() * 0.2));
        totals.incidentesTotales = Math.max(0, Math.round(totals.incidentesTotales * (0.8 + r() * 0.4)));
    }

    return {
        periodo, year, month, sedeId, userId,
        totals,
        distribucionTurnos: { dia: 62, noche: 24, largo: 14 },
        riesgosPorNivel: { bajo: 9, medio: 4, alto: 2 },
        ausentismo: { tasa: 3.8, justificadas: 9, injustificadas: 4 },
    };
}