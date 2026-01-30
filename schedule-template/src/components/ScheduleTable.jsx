import React from "react";
import ResourcePill from "./ResourcePill.jsx";

const TYPE_META = {
  lecture: {
    label: "Lecture",
    rowClass: "bg-white border-l-4 border-slate-200",
    badgeClass: "badge badge-neutral",
  },
  lab: {
    label: "Lab",
    rowClass: "bg-emerald-50 border-l-4 border-emerald-300",
    badgeClass: "badge badge-emerald",
  },
  review: {
    label: "Review",
    rowClass: "bg-amber-50 border-l-4 border-amber-300",
    badgeClass: "badge badge-amber",
  },
  exam: {
    label: "Exam",
    rowClass: "bg-rose-50 border-l-4 border-rose-300",
    badgeClass: "badge badge-rose",
  },
  assignment: {
    label: "Assignment",
    rowClass: "bg-violet-50 border-l-4 border-violet-300",
    badgeClass: "badge badge-violet",
  },
  project: {
    label: "Project",
    rowClass: "bg-orange-50 border-l-4 border-orange-300",
    badgeClass: "badge badge-amber",
  },
};

const densityStyles = {
  comfortable: {
    head: "px-4 py-3 text-xs",
    cell: "px-4 py-3 text-sm",
  },
  compact: {
    head: "px-3 py-2 text-[0.72rem]",
    cell: "px-3 py-2 text-xs",
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

export default function ScheduleTable({ rows, modules, density }) {
  const moduleMap = React.useMemo(() => {
    const map = {};
    modules.forEach((mod) => {
      map[mod.key] = mod;
    });
    return map;
  }, [modules]);

  const styles = densityStyles[density] || densityStyles.comfortable;

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Course schedule</div>
          <div className="text-lg font-semibold text-slate-900">Sessions and resources</div>
        </div>
        <div className="text-xs text-slate-500">Use the Download PDF button to print this table.</div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[920px] w-full border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 uppercase tracking-wide">
              <th className={`border border-slate-200 text-center font-semibold ${styles.head}`}>Session</th>
              <th className={`border border-slate-200 text-center font-semibold ${styles.head}`}>Date</th>
              <th className={`border border-slate-200 text-center font-semibold ${styles.head}`}>Day</th>
              <th className={`border border-slate-200 text-left font-semibold ${styles.head}`}>Topic</th>
              <th className={`border border-slate-200 text-left font-semibold ${styles.head}`}>Lectures</th>
              <th className={`border border-slate-200 text-left font-semibold ${styles.head}`}>Recordings</th>
              <th className={`border border-slate-200 text-left font-semibold ${styles.head}`}>Assignments</th>
            </tr>
          </thead>
          <tbody className="text-slate-800">
            {rows.map((row, idx) => {
              if (row.kind === "break") {
                return (
                  <tr key={`break-${idx}`} className="bg-slate-100">
                    <td className="border border-slate-200 text-center font-semibold text-slate-600" colSpan={7}>
                      <div className="py-3">
                        <div className="text-sm">{row.label}</div>
                        {row.displayDate ? (
                          <div className="text-xs text-slate-500 mt-1">{row.displayDate}</div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              }

              const typeMeta = TYPE_META[row.type] || TYPE_META.lecture;
              const moduleMeta = row.module ? moduleMap[row.module] : null;
              const todayClass = row.isToday ? " ring-2 ring-sky-300 ring-offset-2" : "";

              return (
                <tr key={`session-${row.session}-${idx}`} className={`${typeMeta.rowClass}${todayClass}`}>
                  <td className={`border border-slate-200 text-center font-semibold ${styles.cell}`}>
                    {row.session}
                  </td>
                  <td className={`border border-slate-200 text-center ${styles.cell}`}>{row.displayDate}</td>
                  <td className={`border border-slate-200 text-center ${styles.cell}`}>{row.weekday}</td>
                  <td className={`border border-slate-200 ${styles.cell}`}>
                    <div className="space-y-2">
                      <div className="font-semibold text-slate-900">{row.topic}</div>
                      <div className="flex flex-wrap gap-2">
                        <span className={typeMeta.badgeClass}>{typeMeta.label}</span>
                        {moduleMeta ? (
                          <span className={moduleMeta.badgeClass}>{moduleMeta.label}</span>
                        ) : null}
                      </div>
                      {row.notes ? <div className="text-xs text-slate-500">{row.notes}</div> : null}
                    </div>
                  </td>
                  <td className={`border border-slate-200 ${styles.cell}`}>
                    {renderPills(row.lectures, "lecture")}
                  </td>
                  <td className={`border border-slate-200 ${styles.cell}`}>
                    {renderPills(row.recordings, "recording")}
                  </td>
                  <td className={`border border-slate-200 ${styles.cell}`}>
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
