import React from "react";

export default function SummaryCards({ meta, stats }) {
  return (
    <section className="max-w-6xl mx-auto px-4 -mt-8">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-500">At a glance</div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <div><span className="label">Sessions:</span> {stats.sessions}</div>
            <div><span className="label">Assignments:</span> {stats.assignments}</div>
            <div><span className="label">Exams:</span> {stats.exams}</div>
          </div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-500">Lab and review</div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <div><span className="label">Labs:</span> {stats.labs}</div>
            <div><span className="label">Reviews:</span> {stats.reviews}</div>
            <div><span className="label">Project sessions:</span> {stats.projects}</div>
          </div>
        </div>
        <div className="card">
          <div className="text-xs uppercase tracking-wide text-slate-500">Assessments</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {meta.assessments.map((item) => (
              <li key={item.label}>
                <span className="label">{item.label}:</span> {item.detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
