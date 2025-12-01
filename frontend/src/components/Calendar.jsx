import React, { useEffect, useState } from "react";
import "../styles/calendar.css";

/**
 * Calendar con semanas completas (6 filas), lunes como primer día.
 * Muestra días de meses adyacentes atenuados (.other-month).
 *
 * Props:
 * - year (number) - año inicial
 * - month (1..12) - mes seleccionado
 * - entries (array) - [{ fecha: "YYYY-MM-DD", turno, horario, observaciones, extra }]
 * - firstDayMonday (boolean)
 * - onDayClick(dateIso, entriesForDay)
 * - onMonthChange(monthNumber)  -> se llama cuando el usuario cambia mes (1..12)
 * - onYearChange(yearNumber)
 */
export default function Calendario({
    year,
    month,
    entries = [],
    firstDayMonday = true,
    onDayClick,
    onMonthChange,
    onYearChange,
}) {
    const today = new Date();
    const initialYear = year || today.getFullYear();
    const initialMonth = month || today.getMonth() + 1;

    const [displayYear, setDisplayYear] = useState(initialYear);
    const [displayMonth, setDisplayMonth] = useState(initialMonth);

    // sincronizar si el padre cambia props year/month
    useEffect(() => {
        if (typeof year === "number" && year !== displayYear) {
            setDisplayYear(year);
        }
    }, [year, displayYear]);

    useEffect(() => {
        if (typeof month === "number" && month !== displayMonth) {
            setDisplayMonth(month);
        }
    }, [month, displayMonth]);

    // primer día del mes seleccionado
    const first = new Date(displayYear, displayMonth - 1, 1);

    // convertir getDay() a índice donde lunes = 0
    const rawStart = first.getDay(); // 0..6 (dom..sab)
    const startWeekday = firstDayMonday ? (rawStart === 0 ? 6 : rawStart - 1) : rawStart;

    // calcular fecha inicio de la cuadrícula (lunes anterior o mismo)
    const gridStart = new Date(first);
    gridStart.setDate(first.getDate() - startWeekday);

    // construir 6 semanas * 7 dias = 42 celdas
    const cells = Array.from({ length: 42 }).map((_, i) => {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        return d;
    });

    // mapear entradas por fecha ISO (YYYY-MM-DD)
    const map = {};
    (entries || []).forEach((e) => {
        if (!e || !e.fecha) return;
        const key = e.fecha;
        map[key] = map[key] || [];
        map[key].push(e);
    });

    const weekdayNames = firstDayMonday
        ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
        : ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const normalizeEntry = (e) => {
        const turno = (e.turno || "").toString().toLowerCase();
        let short = "";
        if (turno.includes("noche") || turno === "n") short = "N";
        else if (turno.includes("largo") || turno.includes("día") || turno.includes("dia") || turno === "l") short = "L";
        else short = (e.turno || "").slice(0, 1).toUpperCase();
        const isExtra = !!(
            e.extra ||
            (e.turno || "").toString().toLowerCase().includes("extra") ||
            (e.observaciones || "").toString().toLowerCase().includes("extra")
        );
        return { ...e, short, isExtra };
    };

    const fmt = (d) => {
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${d.getFullYear()}-${mm}-${dd}`;
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    const changeTo = (y, m) => {
        setDisplayYear(y);
        setDisplayMonth(m);
        if (typeof onMonthChange === "function") onMonthChange(m);
        if (typeof onYearChange === "function") onYearChange(y);
    };

    const handlePrev = () => {
        let m = displayMonth - 1;
        let y = displayYear;
        if (m < 1) { m = 12; y -= 1; }
        changeTo(y, m);
    };
    const handleNext = () => {
        let m = displayMonth + 1;
        let y = displayYear;
        if (m > 12) { m = 1; y += 1; }
        changeTo(y, m);
    };

    return (
        <div className="g14-calendar-wrapper">
            <div className="g14-calendar-header">
                <div className="cal-nav">
                    <button className="cal-nav-btn" onClick={handlePrev} aria-label="Mes anterior">◀</button>
                </div>

                <div className="cal-header-center">
                    <select
                        className="month-select"
                        value={displayMonth}
                        onChange={(e) => changeTo(displayYear, Number(e.target.value))}
                    >
                        {monthNames.map((mn, i) => <option key={i} value={i + 1}>{mn}</option>)}
                    </select>

                    <input
                        className="year-input"
                        type="number"
                        value={displayYear}
                        onChange={(e) => {
                            const y = Number(e.target.value) || displayYear;
                            changeTo(y, displayMonth);
                        }}
                        style={{ width: 72, marginLeft: 8 }}
                    />
                </div>

                <div className="cal-nav">
                    <button className="cal-nav-btn" onClick={handleNext} aria-label="Mes siguiente">▶</button>
                </div>
            </div>

            <div className="g14-calendar">
                {weekdayNames.map((w) => (
                    <div key={w} className={`cal-weekday ${w === "Dom" ? "sunday" : ""}`}>{w}</div>
                ))}

                {cells.map((dateObj, idx) => {
                    const cellKey = fmt(dateObj);
                    const dayNum = dateObj.getDate();
                    const isCurrentMonth = dateObj.getMonth() === (displayMonth - 1) && dateObj.getFullYear() === displayYear;
                    const dayEntriesRaw = map[cellKey] || [];
                    const dayEntries = dayEntriesRaw.map(normalizeEntry);

                    return (
                        <div
                            key={idx}
                            className={`cal-cell ${isCurrentMonth ? "current-month" : "other-month"} ${dayEntries.length ? "has-entry" : ""}`}
                            onClick={() => onDayClick && onDayClick(cellKey, dayEntries)}
                            role={onDayClick ? "button" : undefined}
                            tabIndex={onDayClick ? 0 : undefined}
                        >
                            <div className="cal-day">{dayNum}</div>

                            {dayEntries.length > 0 && (
                                <div className="cal-entries">
                                    {dayEntries.slice(0, 2).map((ev, i) => (
                                        <div key={i} className={`cal-entry ${ev.short === "N" ? "night" : "day"}`}>
                                            <span className="entry-short">{ev.short}</span>
                                            {ev.isExtra && <span className="entry-extra"> (Extra)</span>}
                                        </div>
                                    ))}
                                    {dayEntries.length > 2 && <div className="cal-more">+{dayEntries.length - 2}</div>}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}