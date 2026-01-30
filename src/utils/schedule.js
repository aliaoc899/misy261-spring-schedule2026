import { formatShortDate, formatWeekday, isToday, parseLocalDate } from "./date.js";

export function normalizeRows(rows) {
  return rows.map((row) => {
    if (row.kind === "break") {
      return {
        ...row,
        displayDate: row.date ? formatShortDate(row.date) : "",
        weekday: row.date ? formatWeekday(row.date) : "",
      };
    }

    return {
      kind: "session",
      type: row.type || "lecture",
      lectures: row.lectures || [],
      recordings: row.recordings || [],
      assignments: row.assignments || [],
      notes: row.notes || "",
      ...row,
      displayDate: row.date ? formatShortDate(row.date) : "",
      weekday: row.date ? formatWeekday(row.date) : "",
      isToday: row.date ? isToday(row.date) : false,
    };
  });
}

export function getScheduleStats(rows) {
  const stats = {
    sessions: 0,
    assignments: 0,
    exams: 0,
    labs: 0,
    reviews: 0,
    projects: 0,
  };

  rows.forEach((row) => {
    if (row.kind !== "session") return;
    stats.sessions += 1;
    if (row.assignments && row.assignments.length) stats.assignments += row.assignments.length;
    if (row.type === "exam") stats.exams += 1;
    if (row.type === "lab") stats.labs += 1;
    if (row.type === "review") stats.reviews += 1;
    if (row.type === "project") stats.projects += 1;
  });

  return stats;
}

function formatShortDateFromDate(date) {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getWeekStart(isoDate) {
  const date = parseLocalDate(isoDate);
  if (!date) return null;
  const day = date.getDay();
  const diff = (day + 6) % 7;
  const start = new Date(date);
  start.setDate(date.getDate() - diff);
  return start;
}

function formatRange(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 4);
  return `${formatShortDateFromDate(startDate)} - ${formatShortDateFromDate(endDate)}`;
}

export function buildWeeklySchedule(rows) {
  const byWeek = new Map();

  rows.forEach((row) => {
    if (!row.date) return;
    const start = getWeekStart(row.date);
    if (!start) return;
    const key = start.toISOString().slice(0, 10);

    if (!byWeek.has(key)) {
      byWeek.set(key, { key, start, sessions: [], breaks: [] });
    }

    const group = byWeek.get(key);
    if (row.kind === "break") {
      group.breaks.push(row);
    } else {
      group.sessions.push(row);
    }
  });

  return Array.from(byWeek.values())
    .sort((a, b) => a.start - b.start)
    .map((week, index) => {
      const topics = week.sessions.map((session) => session.topic).filter(Boolean);
      const uniqueTopics = [...new Set(topics)];
      let topic = uniqueTopics.join(" / ");
      let isBreak = false;

      if (!topic && week.breaks.length) {
        topic = week.breaks[0].label;
        isBreak = true;
      }

      return {
        key: week.key,
        weekNumber: index + 1,
        rangeLabel: formatRange(week.start),
        topic: topic || "-",
        isBreak,
      };
    });
}
