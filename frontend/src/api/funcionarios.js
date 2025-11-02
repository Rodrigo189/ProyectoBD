import perfil from "../img/perfil.png";

const STORAGE_KEY = "funcionarios_mock_v1";

const DEFAULT = [
    {
        id: "1",
        nombre: "Juanito",
        apellido: "Pérez",
        run: "11.111.111-1",
        genero: "Masculino",
        cargo: "Jefe de Departamento",
        direccion: "Calle ejemplo 123",
        email: "juan.perez@eleam.cl",
        telefono: "(+569)9xxxxxxx",
        tipoContrato: "Contrato a plazo",
        inicio: "01/01/2024",
        termino: "31/12/2024",
        sueldoBruto: 1200000,
        sueldoLiquido: 900000,
        bonos: 50000,
        fechaPago: "30/09/2024",
        avatar: perfil,
        resumen: {
            "1": { diasTrabajados: 15, horas: 180, turnosExtra: 2, turnosLargos: 5, turnosNoche: 6, diasLibre: 10 },
            "8": { diasTrabajados: 18, horas: 216, turnosExtra: 8, turnosLargos: 10, turnosNoche: 8, diasLibre: 13 },
        },
        historial: [
            { fecha: "2024-08-01", dia: "Jueves", turno: "Noche", horario: "20:00-08:00", horas: 12, observaciones: "" },
            { fecha: "2024-08-02", dia: "Viernes", turno: "Día", horario: "08:00-20:00", horas: 12, observaciones: "" },
        ],
    },
    {
        id: "2",
        nombre: "María",
        apellido: "Gómez",
        run: "22.222.222-2",
        genero: "Femenino",
        cargo: "Auxiliar",
        direccion: "-",
        email: "maria.gomez@eleam.cl",
        telefono: "-",
        tipoContrato: "Indefinido",
        inicio: "-",
        termino: "-",
        sueldoBruto: 800000,
        sueldoLiquido: 650000,
        bonos: 30000,
        fechaPago: "30/09/2024",
        avatar: perfil,
        resumen: {
            "1": { diasTrabajados: 14, horas: 168, turnosExtra: 0, turnosLargos: 3, turnosNoche: 5, diasLibre: 16 },
            "8": { diasTrabajados: 12, horas: 144, turnosExtra: 1, turnosLargos: 2, turnosNoche: 4, diasLibre: 18 },
        },
        historial: [
            { fecha: "2024-08-05", dia: "Lunes", turno: "Día", horario: "08:00-20:00", horas: 12, observaciones: "" },
        ],
    },
];

function readStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return DEFAULT.map((d) => ({ ...d }));
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : DEFAULT.map((d) => ({ ...d }));
    } catch {
        return DEFAULT.map((d) => ({ ...d }));
    }
}

function writeStorage(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch { }
}

let DATA = readStorage();

function delay(ms = 120) {
    return new Promise((r) => setTimeout(r, ms));
}

export async function listFuncionarios() {
    await delay();
    return DATA.map((d) => ({ ...d }));
}

export async function fetchFuncionarioById(id) {
    await delay();
    if (!id) return null;
    const found = DATA.find((m) => String(m.id) === String(id));
    return found ? { ...found } : null;
}

/**
 * Devuelve el resumen para un usuario y mes (1..12). Si no hay datos devuelve ceros.
 */
export async function fetchResumenByUserMonth(id, month) {
    await delay();
    const user = DATA.find((m) => String(m.id) === String(id));
    const empty = { diasTrabajados: 0, horas: 0, turnosExtra: 0, turnosLargos: 0, turnosNoche: 0, diasLibre: 0 };
    if (!user) return empty;

    // 1) Si existe resumen precalculado, devolverlo
    if (user.resumen && user.resumen[String(month)]) {
        return { ...user.resumen[String(month)] };
    }

    // 2) Si no, intentar calcularlo desde historial (si existe)
    if (Array.isArray(user.historial) && user.historial.length) {
        const entries = user.historial.filter(h => {
            if (!h.fecha) return false;
            const parts = h.fecha.split("-");
            if (parts.length < 2) return false;
            return Number(parts[1]) === Number(month);
        });

        if (!entries.length) return empty;

        const resumenCalc = {
            diasTrabajados: entries.length,
            horas: entries.reduce((s, e) => s + (Number(e.horas) || 0), 0),
            turnosExtra: entries.filter(e => (e.extra || "").toString().toLowerCase() === "extra").length || 0,
            turnosLargos: entries.filter(e => (e.turno || "").toString().toLowerCase().includes("largo")).length || 0,
            turnosNoche: entries.filter(e => (e.turno || "").toString().toLowerCase().includes("noche")).length || 0,
            diasLibre: 0
        };

        return resumenCalc;
    }

    // 3) si nada, devolver vacío
    return empty;
}

export async function fetchHistorialByUser(id) {
    await delay();
    const user = DATA.find((m) => String(m.id) === String(id));
    return user && Array.isArray(user.historial) ? user.historial.map((h) => ({ ...h })) : [];
}

export async function updateRemuneracion(id, payload) {
    await delay();
    const idx = DATA.findIndex((m) => String(m.id) === String(id));
    if (idx === -1) return { ok: false };
    DATA[idx] = { ...DATA[idx], ...payload };
    writeStorage(DATA);
    return { ok: true, data: { ...DATA[idx] } };
}