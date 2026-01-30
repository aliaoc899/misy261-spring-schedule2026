import React from "react";
import { courseMeta, scheduleRows } from "./data/schedule.js";
import { normalizeRows, getScheduleStats } from "./utils/schedule.js";
import ScheduleHeader from "./components/ScheduleHeader.jsx";
import SummaryCards from "./components/SummaryCards.jsx";
import ScheduleTable from "./components/ScheduleTable.jsx";

export default function App() {
  const [density, setDensity] = React.useState("comfortable");
  const rows = React.useMemo(() => normalizeRows(scheduleRows), []);
  const stats = React.useMemo(() => getScheduleStats(rows), [rows]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen text-slate-900">
      <ScheduleHeader meta={courseMeta} />
      <SummaryCards meta={courseMeta} stats={stats} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="toolbar no-print">
          <div className="text-sm text-slate-600">
            Update the schedule by editing <span className="font-semibold">src/data/schedule.js</span>.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1">
              <button
                className={`toggle ${density === "comfortable" ? "toggle-active" : ""}`}
                onClick={() => setDensity("comfortable")}
                type="button"
              >
                Comfortable
              </button>
              <button
                className={`toggle ${density === "compact" ? "toggle-active" : ""}`}
                onClick={() => setDensity("compact")}
                type="button"
              >
                Compact
              </button>
            </div>
            <button className="btn-primary" type="button" onClick={handlePrint}>
              Download PDF
            </button>
          </div>
        </div>

        <ScheduleTable rows={rows} modules={courseMeta.modules} density={density} />

        <div className="print-only text-xs text-slate-500">
          Generated from a single data source. No duplicate table to update.
        </div>
      </main>
    </div>
  );
}
