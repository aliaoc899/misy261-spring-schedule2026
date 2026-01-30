import React from "react";

export default function ScheduleHeader({ meta }) {
  return (
    <header className="relative overflow-hidden pt-4">
      <div className="relative max-w-6xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-start">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/40 dark:bg-slate-800/40 dark:border-slate-700/50 backdrop-blur-md px-3 py-1 text-xs font-bold tracking-wide text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-black/5 dark:ring-white/10">
              <span className="text-slate-600 dark:text-slate-400 font-medium">{meta.institution}</span>
              <span className="text-slate-400 dark:text-slate-600">|</span>
              <span>{meta.term}</span>
            </div>
            <div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 drop-shadow-sm">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
                  {meta.courseCode}
                </span>
                <span className="block mt-2 text-3xl sm:text-4xl lg:text-5xl font-medium text-slate-800 dark:text-slate-200">
                  {meta.title}
                </span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {meta.description}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {meta.modules.map((mod) => (
                <span key={mod.key} className="badge badge-neutral shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                  {mod.label}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 font-bold">
                {meta.instructor.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 font-bold">Instructor</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-none">{meta.instructor.name}</div>
              </div>
            </div>
            
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex gap-3">
                <span className="label w-24 shrink-0 dark:text-slate-300">Email:</span> 
                <span className="font-medium">{meta.instructor.email}</span>
              </div>
              <div className="flex gap-3">
                <span className="label w-24 shrink-0 dark:text-slate-300">Office hours:</span> 
                <span>{meta.instructor.officeHours}</span>
              </div>
              <div className="flex gap-3">
                <span className="label w-24 shrink-0 dark:text-slate-300">Location:</span> 
                <span>{meta.instructor.officeLocation}</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {meta.instructor.profileUrl && (
                  <a className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b-2 border-slate-900/10 dark:border-white/10 hover:border-slate-900 dark:hover:border-white transition-colors pb-0.5" href={meta.instructor.profileUrl} target="_blank" rel="noreferrer">
                    Profile
                  </a>
                )}
                {meta.instructor.appointmentUrl && (
                  <a
                    className="inline-flex items-center justify-center rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-sm font-bold uppercase tracking-wider text-white dark:text-slate-900 shadow-lg shadow-slate-900/20 transition-all hover:bg-slate-800 dark:hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0"
                    href={meta.instructor.appointmentUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Book Office Hours
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
