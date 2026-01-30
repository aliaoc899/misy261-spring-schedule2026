import React from "react";

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

export default function WeeklySchedule({ weeks, fontSize }) {
  const font = fontSizeStyles[fontSize] || fontSizeStyles.medium;

  return (
    <section className="card mb-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Weekly schedule</div>
          <div className="text-xl font-bold text-slate-900 dark:text-white">Week-by-week focus</div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <table className="min-w-[760px] w-full border-collapse">
          <colgroup>
            <col className="w-[120px]" />
            <col className="w-[180px]" />
            <col />
          </colgroup>
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <th className={`px-4 py-3 text-center font-bold ${font.head}`}>Week</th>
              <th className={`px-4 py-3 text-center font-bold ${font.head}`}>Dates</th>
              <th className={`px-4 py-3 text-left font-bold ${font.head}`}>Weekly topic</th>
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-700">
            {weeks.map((week) => (
              <tr key={week.key} className="bg-white/40 dark:bg-slate-900/40 transition-all hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:shadow-sm">
                <td className={`px-4 py-3 text-center font-bold text-slate-400 dark:text-slate-500 whitespace-nowrap ${font.cell}`}>
                  Week {week.weekNumber}
                </td>
                <td className={`px-4 py-3 text-center whitespace-nowrap font-medium text-slate-500 dark:text-slate-400 ${font.cell}`}>
                  {week.rangeLabel}
                </td>
                <td
                  className={`px-6 py-3 font-medium ${font.cell} ${
                    week.isBreak ? "text-slate-400 dark:text-slate-500 italic" : "text-slate-800 dark:text-slate-200"
                  }`}
                >
                  {week.topic}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
