import React from "react";
import { courseMeta, scheduleRows } from "./data/schedule.js";
import { normalizeRows, getScheduleStats, buildWeeklySchedule } from "./utils/schedule.js";
import ScheduleHeader from "./components/ScheduleHeader.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import WebsiteNotice from "./components/WebsiteNotice.jsx";
import WeeklySchedule from "./components/WeeklySchedule.jsx";
import ScheduleTable from "./components/ScheduleTable.jsx";

export default function App() {
  const [density, setDensity] = React.useState("comfortable");
  const [fontSize, setFontSize] = React.useState("medium");
  const [darkMode, setDarkMode] = React.useState(false);
  
  const rows = React.useMemo(() => normalizeRows(scheduleRows), []);
  const stats = React.useMemo(() => getScheduleStats(rows), [rows]);
  const weeks = React.useMemo(() => buildWeeklySchedule(rows), [rows]);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const adjustFontSize = (direction) => {
    const sizes = ["small", "medium", "large"];
    setFontSize((current) => {
      const idx = sizes.indexOf(current);
      const next = Math.min(sizes.length - 1, Math.max(0, idx + direction));
      return sizes[next];
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <ScheduleHeader meta={courseMeta} />
      <SummaryCards meta={courseMeta} stats={stats} />

      <main className="max-w-6xl mx-auto px-4 pb-20 space-y-8">
        <div className="toolbar no-print p-3 rounded-2xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-4 z-50 transition-colors duration-300">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
            Running in <span className="font-bold text-slate-700 dark:text-slate-200">dev preview</span> mode
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-center sm:justify-end">
            <div className="flex items-center gap-1 rounded-xl bg-slate-100/50 p-1 ring-1 ring-slate-200/50 dark:bg-slate-800/50 dark:ring-slate-700/50">
              <button
                className={`toggle ${density === "comfortable" ? "toggle-active" : ""}`}
                onClick={() => setDensity("comfortable")}
                type="button"
              >
                Comfy
              </button>
              <button
                className={`toggle ${density === "compact" ? "toggle-active" : ""}`}
                onClick={() => setDensity("compact")}
                type="button"
              >
                Compact
              </button>
            </div>
            <div className="flex items-center gap-1 rounded-xl bg-slate-100/50 p-1 ring-1 ring-slate-200/50 dark:bg-slate-800/50 dark:ring-slate-700/50">
              <span className="text-[0.65rem] font-bold uppercase tracking-wider text-slate-400 px-2">Font</span>
              <button
                className="toggle px-2"
                onClick={() => adjustFontSize(-1)}
                type="button"
                disabled={fontSize === "small"}
                aria-label="Decrease font size"
              >
                A-
              </button>
              <button
                className="toggle px-2"
                onClick={() => adjustFontSize(1)}
                type="button"
                disabled={fontSize === "large"}
                aria-label="Increase font size"
              >
                A+
              </button>
            </div>
            <button
                className="inline-flex items-center justify-center rounded-xl bg-slate-200 text-slate-700 h-10 w-10 transition-all hover:bg-slate-300 dark:bg-slate-700 dark:text-yellow-400 dark:hover:bg-slate-600 shadow-sm"
                type="button"
                onClick={() => setDarkMode(!darkMode)}
                aria-label="Toggle dark mode"
              >
                {darkMode ? "🌙" : "☀️"}
            </button>
            <button className="btn-primary" type="button" onClick={handlePrint}>
              <span className="mr-1">🖨️</span> PDF
            </button>
          </div>
        </div>

        <WebsiteNotice />

        <WeeklySchedule weeks={weeks} fontSize={fontSize} />

        <ScheduleTable rows={rows} modules={courseMeta.modules} density={density} fontSize={fontSize} />

        <div className="print-only text-xs text-slate-500">
          Generated from a single data source. No duplicate table to update.
        </div>
      </main>
    </div>
  );
}
