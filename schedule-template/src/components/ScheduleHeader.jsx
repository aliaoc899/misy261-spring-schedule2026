import React from "react";

export default function ScheduleHeader({ meta }) {
  return (
    <header className="relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-4 py-10 sm:py-12">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold tracking-wide text-slate-700">
              <span className="text-slate-500">{meta.institution}</span>
              <span className="text-slate-400">|</span>
              <span>{meta.term}</span>
            </div>
            <div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900">
                {meta.courseCode}: {meta.title}
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-600 max-w-2xl">
                {meta.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {meta.modules.map((mod) => (
                <span key={mod.key} className="badge badge-neutral">
                  {mod.label}
                </span>
              ))}
            </div>
          </div>

          <div className="card bg-white/90">
            <div className="text-xs uppercase tracking-wide text-slate-500">Instructor</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">{meta.instructor.name}</div>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <div>
                <span className="label">Email:</span> {meta.instructor.email}
              </div>
              <div>
                <span className="label">Office hours:</span> {meta.instructor.officeHours}
              </div>
              <div>
                <span className="label">Location:</span> {meta.instructor.officeLocation}
              </div>
              {meta.instructor.profileUrl ? (
                <div>
                  <a className="text-slate-900 underline" href={meta.instructor.profileUrl} target="_blank" rel="noreferrer">
                    Instructor profile
                  </a>
                </div>
              ) : null}
              {meta.instructor.appointmentUrl ? (
                <div>
                  <a className="text-slate-900 underline" href={meta.instructor.appointmentUrl} target="_blank" rel="noreferrer">
                    Schedule appointment
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
