export function parseLocalDate(isoDate) {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

export function formatShortDate(isoDate) {
  const date = parseLocalDate(isoDate);
  if (!date) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatWeekday(isoDate) {
  const date = parseLocalDate(isoDate);
  if (!date) return "";
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function isToday(isoDate) {
  const date = parseLocalDate(isoDate);
  if (!date) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}
