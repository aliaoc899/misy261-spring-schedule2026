import { formatShortDate, formatWeekday, isToday } from "./date.js";

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
