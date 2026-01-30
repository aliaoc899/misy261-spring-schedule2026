import React from "react";

export default function SummaryCards({ meta, stats }) {
  const assignmentTotal = (() => {
    const item = meta.assessments?.find((entry) => /assignment/i.test(entry.label));
    const match = item?.label?.match(/\d+/);
    return match ? match[0] : stats.assignments;
  })();

  const kpis = [
    {
      key: "sessions",
      label: "Sessions",
      value: stats.sessions,
      icon: "📚",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      key: "assignments",
      label: "Assignments",
      value: assignmentTotal,
      icon: "🧩",
      color: "bg-violet-50 text-violet-600",
      border: "border-violet-100",
      gradient: "from-violet-500 to-purple-500"
    },
    {
      key: "exams",
      label: "Exams",
      value: stats.exams,
      icon: "📝", 
      color: "bg-rose-50 text-rose-600",
      border: "border-rose-100",
      gradient: "from-rose-500 to-pink-500"
    },
    {
      key: "project",
      label: "Final Project",
      value: 1,
      icon: "🚀",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
      gradient: "from-emerald-500 to-teal-500"
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 -mt-8 relative z-10 mb-12">
      {/* KPIs Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div 
            key={kpi.key} 
            className={`group relative overflow-hidden rounded-2xl border ${kpi.border} bg-white/80 dark:bg-slate-800/80 dark:border-slate-700 p-5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md`}
          >
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{kpi.label}</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{kpi.value}</div>
              </div>
              <div className={`rounded-xl p-3 ${kpi.color} shadow-sm ring-1 ring-black/5 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <span className="text-xl leading-none block">{kpi.icon}</span>
              </div>
            </div>
            
            {/* Decorative background elements */}
            <div className={`absolute -right-6 -bottom-6 h-24 w-24 rounded-full bg-gradient-to-br ${kpi.gradient} opacity-10 blur-2xl transition-all group-hover:opacity-20 group-hover:scale-150`} />
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${kpi.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
          </div>
        ))}
      </div>
    </section>
  );
}
