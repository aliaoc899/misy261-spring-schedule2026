import React from "react";
import ResourcePill from "./ResourcePill.jsx";

const DEFAULT_ROW_CLASS = "bg-white/40 dark:bg-slate-800/40 border-l-4 border-slate-200 dark:border-slate-700";

const TYPE_META = {
  lecture: {
    label: "Lecture",
    rowClass: DEFAULT_ROW_CLASS,
    badgeClass: "badge badge-neutral bg-white/50 dark:bg-slate-700/50 dark:text-slate-300",
  },
  lab: {
    label: "Lab",
    rowClass: DEFAULT_ROW_CLASS,
    badgeClass: "badge badge-emerald bg-emerald-50/80 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
  },
  review: {
    label: "Review",
    rowClass: DEFAULT_ROW_CLASS,
    badgeClass: "badge badge-amber bg-amber-50/80 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
  },
  exam: {
    label: "Exam",
    rowClass: "bg-rose-50/60 dark:bg-rose-900/20 border-l-4 border-rose-400 dark:border-rose-600",
    badgeClass: "badge badge-rose bg-rose-50/80 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800",
  },
  assignment: {
    label: "Assignment",
    rowClass: DEFAULT_ROW_CLASS,
    badgeClass: "badge badge-violet bg-violet-50/80 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800",
  },
  project: {
    label: "Project",
    rowClass: DEFAULT_ROW_CLASS,
    badgeClass: "badge badge-amber bg-amber-50/80 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
  },
};

const densityStyles = {
  comfortable: {
    head: "px-4 py-3",
    cell: "px-4 py-3",
  },
  compact: {
    head: "px-3 py-2",
    cell: "px-3 py-2",
  },
};

const fontSizeStyles = {
  small: {
    head: "text-[0.7rem]",
    cell: "text-xs",
  },
  medium: {
    head: "text-xs",
    cell: "text-sm",
  },
  large: {
    head: "text-sm",
    cell: "text-base",
  },
};

function renderPills(items, variant) {
  if (!items || items.length === 0) {
    return <span className="text-slate-400">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <ResourcePill
          key={`${variant}-${idx}-${item.label}`}
          label={item.label}
          href={item.href}
          variant={variant}
          download={item.download}
        />
      ))}
    </div>
  );
}

export default function ScheduleTable({ rows, modules, density, fontSize }) {
  const moduleMap = React.useMemo(() => {
    const map = {};
    modules.forEach((mod) => {
      map[mod.key] = mod;
    });
    return map;
  }, [modules]);

  const styles = densityStyles[density] || densityStyles.comfortable;
  const font = fontSizeStyles[fontSize] || fontSizeStyles.medium;

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Course schedule</div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">Sessions and resources</div>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">Use the Download PDF button to print this table.</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              <th className={`border border-slate-200 dark:border-slate-700 text-center font-semibold ${styles.head} ${font.head}`}>Session</th>
              <th className={`border border-slate-200 dark:border-slate-700 text-center font-semibold ${styles.head} ${font.head}`}>Date</th>
              <th className={`border border-slate-200 dark:border-slate-700 text-center font-semibold ${styles.head} ${font.head}`}>Day</th>
              <th className={`border border-slate-200 dark:border-slate-700 text-left font-semibold ${styles.head} ${font.head}`}>Topic</th>
              <th className={`border border-slate-200 dark:border-slate-700 text-left font-semibold ${styles.head} ${font.head}`}>Lectures</th>
              <th className={`border border-slate-200 dark:border-slate-700 text-left font-semibold ${styles.head} ${font.head}`}>Recordings</th>
              <th className={`border border-slate-200 dark:border-slate-700 text-left font-semibold ${styles.head} ${font.head}`}>Assignments</th>
            </tr>
          </thead>
          <tbody className="text-slate-800 dark:text-slate-200">
            {rows.map((row, idx) => {
              if (row.kind === "break") {
                return (
                  <tr key={`break-${idx}`} className="bg-slate-50/50 dark:bg-slate-800/50">
                    <td className={`border border-white/40 dark:border-slate-700 text-center font-semibold text-slate-500 dark:text-slate-400 py-4 ${font.cell}`} colSpan={7}>
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="uppercase tracking-widest text-xs">{row.label}</span>
                        {row.displayDate ? (
                          <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">{row.displayDate}</span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              }

              const typeMeta = TYPE_META[row.type] || TYPE_META.lecture;
              const moduleMeta = row.module ? moduleMap[row.module] : null;
              const todayClass = row.isToday ? " ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 z-10 relative" : "";

              return (
                <tr
                  key={`session-${row.session}-${idx}`}
                  className={`${typeMeta.rowClass}${todayClass} transition-all hover:bg-white/60 dark:hover:bg-slate-800/60`}
                >
                  <td className={`border border-white/40 dark:border-slate-700/50 text-center font-bold text-slate-400 dark:text-slate-500 ${styles.cell} ${font.cell}`}>
                    {row.session}
                  </td>
                  <td className={`border border-white/40 dark:border-slate-700/50 text-center font-medium ${styles.cell} ${font.cell}`}>{row.displayDate}</td>
                  <td className={`border border-white/40 dark:border-slate-700/50 text-center text-slate-500 dark:text-slate-400 ${styles.cell} ${font.cell}`}>{row.weekday}</td>
                  <td className={`border border-white/40 dark:border-slate-700/50 ${styles.cell} ${font.cell}`}>
                    <div className="space-y-2">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{row.topic}</div>
                      <div className="flex flex-wrap gap-2">
                        <span className={typeMeta.badgeClass}>{typeMeta.label}</span>
                        {moduleMeta ? (
                          <span className={moduleMeta.badgeClass}>{moduleMeta.label}</span>
                        ) : null}
                      </div>
                      {row.notes ? <div className="text-xs text-slate-500 dark:text-slate-400 italic mt-1">{row.notes}</div> : null}
                    </div>
                  </td>
                  <td className={`border border-white/40 dark:border-slate-700/50 ${styles.cell} ${font.cell}`}>
                    {renderPills(row.lectures, "lecture")}
                  </td>
                  <td className={`border border-white/40 dark:border-slate-700/50 ${styles.cell} ${font.cell}`}>
                    {renderPills(row.recordings, "recording")}
                  </td>
                  <td className={`border border-white/40 dark:border-slate-700/50 ${styles.cell} ${font.cell}`}>
                    {renderPills(row.assignments, "assignment")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
