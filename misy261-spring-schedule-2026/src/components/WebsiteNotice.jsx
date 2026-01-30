import React from "react";

export default function WebsiteNotice() {
  return (
    <section className="card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-wide text-slate-500">Course platform</div>
          <div className="text-xl font-semibold text-slate-900">Tetta AI</div>
        </div>
        <a
          className="btn-primary"
          href="https://tettaai.com"
          target="_blank"
          rel="noreferrer"
        >
          Visit Platform
        </a>
      </div>
      <p className="mt-4 text-sm text-slate-600">
        Tetta AI is the course hub for attendance, AI tutors, and class workflows.
      </p>
      <ul className="mt-4 grid gap-2 text-sm text-slate-600 list-disc pl-5">
        <li>AI-powered platform with context-aware tutors for homework and class practice.</li>
        <li>Daily attendance is taken on the site, with attendance history available.</li>
        <li>Register and join the course using the enrollment key shown in class.</li>
        <li>Submit excused absence requests on the site.</li>
      </ul>
    </section>
  );
}
