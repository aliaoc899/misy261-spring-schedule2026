import React from "react";
import { SlideApp, Slide, SectionCard, useBucket, SimpleTableCard, Row } from "./lib/slidekit.tsx";

// Shared constants for the deck
const COURSE = "MISY261";
const TITLE = "MISY261: Business Information Systems";
const SUBTITLE = "Homework 1: Data Management and Data Modeling";

// Example slides showing how to define screens one-by-one and keep state per slide.

const IDENTITY_SESSION_KEY = "slidekit_example_identity_session";

function WelcomeSlide() {
  const [bucket, setBucket] = useBucket<{ firstName: string; lastName: string; section: string }>({
    firstName: "",
    lastName: "",
    section: "",
  });

  // session-only lock (clears when browser session ends)
  const [locked, setLocked] = React.useState<boolean>(false);
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(IDENTITY_SESSION_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setBucket({
          firstName: saved.firstName || "",
          lastName: saved.lastName || "",
          section: saved.section || "",
        });
        setLocked(true);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canRecord = (bucket.firstName?.trim() || "") && (bucket.lastName?.trim() || "") && (bucket.section?.trim() || "");
  const record = () => {
    if (!canRecord) return;
    try {
      sessionStorage.setItem(
        IDENTITY_SESSION_KEY,
        JSON.stringify({ firstName: bucket.firstName.trim(), lastName: bucket.lastName.trim(), section: bucket.section })
      );
      setLocked(true);
      try { window.dispatchEvent(new Event('identity-updated')); } catch {}
    } catch {
      setLocked(true);
    }
  };

  const fullName = `${bucket.firstName || ""} ${bucket.lastName || ""}`.trim();

  return (
    <Slide title="Welcome">
      {!locked ? (
        <>
          <SectionCard title="Your Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block text-sm">
                <span className="text-slate-600">First name</span>
                <input
                  disabled={locked}
                  value={bucket.firstName}
                  onChange={(e) => setBucket({ ...bucket, firstName: e.target.value })}
                  placeholder="First"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
              <label className="block text-sm">
                <span className="text-slate-600">Last name</span>
                <input
                  disabled={locked}
                  value={bucket.lastName}
                  onChange={(e) => setBucket({ ...bucket, lastName: e.target.value })}
                  placeholder="Last"
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
                />
              </label>
            </div>
            <label className="block text-sm mt-3">
              <span className="text-slate-600">Section</span>
              <select
                disabled={locked}
                value={bucket.section}
                onChange={(e) => setBucket({ ...bucket, section: e.target.value })}
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
              >
                <option value="">Select section...</option>
                <option value="010 - 9:30">010 - 9:30</option>
                <option value="017 - 11:30">017 - 11:30</option>
                <option value="024 - 2:00">024 - 2:00</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <div className="text-center mt-8">
              <button
                onClick={record}
                disabled={!canRecord}
                className={`px-6 py-3 rounded-xl text-white font-semibold shadow-sm ${
                  canRecord ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-600/50 cursor-not-allowed"
                }`}
              >
                Record Name & Section
              </button>
            </div>
          </SectionCard>
        </>
      ) : (
        <>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="text-slate-700 font-semibold">Recorded Identity</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-900">{fullName || "—"}</div>
            <div className="mt-2 text-xl text-slate-700">
              Section: <span className="font-bold">{bucket.section || "—"}</span>
            </div>
            <div className="mt-2 text-slate-500">Locked for this browser. Use a fresh session to change.</div>
          </div>
          <div className="text-center mt-8 text-slate-600">Date: {new Date().toLocaleDateString()}</div>
        </>
      )}
    </Slide>
  );
}

function BrainstormSlide() {
  const [bucket, setBucket] = useBucket<{ notes: string[] }>({ notes: [] });
  const addNote = () => setBucket({ notes: [...bucket.notes, ""] });
  const setNote = (i: number, v: string) => setBucket({ notes: bucket.notes.map((n, idx) => (idx === i ? v : n)) });
  const removeNote = (i: number) => setBucket({ notes: bucket.notes.filter((_, idx) => idx !== i) });

  return (
    <Slide title="Brainstorm">
      <SectionCard title="Key Points">
        <div className="space-y-2">
          {bucket.notes.map((n, i) => (
            <div className="flex gap-2" key={i}>
              <input value={n} onChange={(e) => setNote(i, e.target.value)} placeholder={`Point ${i + 1}`} className="flex-1 rounded-md border border-slate-300 px-2 py-1.5" />
              <button onClick={() => removeNote(i)} className="px-2 py-1.5 text-sm rounded-md border">Remove</button>
            </div>
          ))}
          <button onClick={addNote} className="px-3 py-1.5 rounded-md border text-sm">Add point</button>
        </div>
      </SectionCard>
    </Slide>
  );
}

function TablesSlide() {
  type Table = { name: string; rows: Row[] };
  const [bucket, setBucket] = useBucket<{ tables: Table[] }>({ tables: [{ name: "", rows: [{ id: crypto.randomUUID?.() || "1", col: "id", pk: true, fk: false }] }] });
  const setName = (idx: number, name: string) => setBucket({ tables: bucket.tables.map((t, i) => (i === idx ? { ...t, name } : t)) });
  const setRows = (idx: number, rows: Row[]) => setBucket({ tables: bucket.tables.map((t, i) => (i === idx ? { ...t, rows } : t)) });

  return (
    <Slide title="Simple Tables">
      <SectionCard title="Design Tables">
        <div className="space-y-3">
          {bucket.tables.map((t, i) => (
            <SimpleTableCard key={i} tableIndex={i} table={t} onChangeName={setName} onChangeRows={setRows} />
          ))}
          <button className="px-3 py-1.5 rounded-md border text-sm" onClick={() => setBucket({ tables: [...bucket.tables, { name: "", rows: [] }] })}>Add table</button>
        </div>
      </SectionCard>
    </Slide>
  );
}

export default function ExampleApp() {
  // Centered Title Slide (hero style)
  const TitleSlide = () => (
    <div className="py-8">
      <div className="text-center mb-8">
        <div className="text-sm uppercase tracking-widest text-emerald-700 font-semibold">MISY 261 - Fall 2025</div>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">Business Information Systems</h1>
        <div className="mt-6 mx-auto h-1 w-36 bg-emerald-700 rounded-full" />
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wide">Course Schedule</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold">Week</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold">Date</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold">Day</th>
                <th className="border border-slate-300 px-4 py-2 text-center font-semibold">Topic</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold">Presentation Link</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold">YouTube Link</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">1</td>
                <td className="border border-slate-300 px-3 py-2 text-center">27-Aug</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Syllabus Review</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">2</td>
                <td className="border border-slate-300 px-3 py-2 text-center">29-Aug</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Business Processes - ERP</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Monday</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Labor Day Holiday</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">3</td>
                <td className="border border-slate-300 px-3 py-2 text-center">3-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Introduction to Database</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://claude.ai/public/artifacts/d6a280f3-a186-4add-8b6e-b90b9abc6d1e" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">4</td>
                <td className="border border-slate-300 px-3 py-2 text-center">5-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Introduction to Database: Table Design, Primary Keys, Data Types</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://aliaoc899.github.io/Session-3-Slides/" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://youtu.be/7vJvlM04ScI" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Video
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">5</td>
                <td className="border border-slate-300 px-3 py-2 text-center">8-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Introduction to Database: Table Design, Primary Keys, Data Types</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://aliaoc899.github.io/misy261-Day-5/" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://youtu.be/G7hXF8hZJxM" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Video
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">6</td>
                <td className="border border-slate-300 px-3 py-2 text-center">10-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Introduction to Database: Table Design, Primary Keys, Data Types</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://aliaoc899.github.io/misy261-Day-5/" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://youtu.be/K-14u7X4AMo" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Video
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">7</td>
                <td className="border border-slate-300 px-3 py-2 text-center">12-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Access - Part 1: Introduction to Database and Query Design</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://aliaoc899.github.io/misy261-Day-7" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://youtu.be/bSbinHpCIHM" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Video
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">8</td>
                <td className="border border-slate-300 px-3 py-2 text-center">15-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Access - Part 1: Introduction to Database and Query Design</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://aliaoc899.github.io/misy261-Day-7" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://youtu.be/awnMaYoFPaY" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Video
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">9</td>
                <td className="border border-slate-300 px-3 py-2 text-center">17-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Access - Part 2: Criteria, Filtering the Query Results</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://aliaoc899.github.io/https-aliaoc899.github.io-misy261-Access-Part2" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://youtu.be/h8TZhnvtVJI" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Video
                  </a>
                </td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">10</td>
                <td className="border border-slate-300 px-3 py-2 text-center">19-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Access: Create Calculated Fields</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">11</td>
                <td className="border border-slate-300 px-3 py-2 text-center">22-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Access: Practice Lab – Part 1, Part 2</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">12</td>
                <td className="border border-slate-300 px-3 py-2 text-center">24-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Access: Total Queries</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">13</td>
                <td className="border border-slate-300 px-3 py-2 text-center">26-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Access: Practice Lab</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">14</td>
                <td className="border border-slate-300 px-3 py-2 text-center">29-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Access: Total Queries with Format function and Created fields</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">15</td>
                <td className="border border-slate-300 px-3 py-2 text-center">1-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Access: Practice Lab</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">16</td>
                <td className="border border-slate-300 px-3 py-2 text-center">3-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Access: Practice Lab - Midterm Review</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border border-slate-300 px-3 py-2 text-center">17</td>
                <td className="border border-slate-300 px-3 py-2 text-center">6-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Midterm Exam 1: Access Query Design</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">18</td>
                <td className="border border-slate-300 px-3 py-2 text-center">8-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Excel: Functions & Basics</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 text-center">19</td>
                <td className="border border-slate-300 px-3 py-2 text-center">10-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Blue Hen Re-Coop Day; Classes Suspended</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">20</td>
                <td className="border border-slate-300 px-3 py-2 text-center">13-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Excel: IF, VLOOKUP, Data Validation</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">21</td>
                <td className="border border-slate-300 px-3 py-2 text-center">15-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Excel: Data Cleaning</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">22</td>
                <td className="border border-slate-300 px-3 py-2 text-center">17-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Excel: Data Analytics (PivotTables)</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">23</td>
                <td className="border border-slate-300 px-3 py-2 text-center">20-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Excel: Data Analytics</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">24</td>
                <td className="border border-slate-300 px-3 py-2 text-center">22-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Excel: Practice lab</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">25</td>
                <td className="border border-slate-300 px-3 py-2 text-center">24-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Excel: Data Analytics</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">26</td>
                <td className="border border-slate-300 px-3 py-2 text-center">27-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Excel: Data Analytics</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">27</td>
                <td className="border border-slate-300 px-3 py-2 text-center">29-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Tableau: Bar/Pie/Map/Treemaps</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">28</td>
                <td className="border border-slate-300 px-3 py-2 text-center">31-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Tableau: Dual Axis, Line, Bubble Charts</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">29</td>
                <td className="border border-slate-300 px-3 py-2 text-center">3-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Tableau: Practice Lab</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">30</td>
                <td className="border border-slate-300 px-3 py-2 text-center">5-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Tableau: Parameters & Filters</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">31</td>
                <td className="border border-slate-300 px-3 py-2 text-center">7-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Tableau: Calculated Fields, Reference Lines</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">32</td>
                <td className="border border-slate-300 px-3 py-2 text-center">10-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Tableau: Practice Lab + Assignment Posted</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">33</td>
                <td className="border border-slate-300 px-3 py-2 text-center">12-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Tableau & Excel: Exam Review 1</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">34</td>
                <td className="border border-slate-300 px-3 py-2 text-center">14-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Tableau & Excel: Exam Review 1</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-yellow-50">
                <td className="border border-slate-300 px-3 py-2 text-center">35</td>
                <td className="border border-slate-300 px-3 py-2 text-center">17-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Midterm Exam 2: Tableau & Excel Data Analytics</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">36</td>
                <td className="border border-slate-300 px-3 py-2 text-center">19-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">37</td>
                <td className="border border-slate-300 px-3 py-2 text-center">21-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Fall Break</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Fall Break</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Fall Break</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">38</td>
                <td className="border border-slate-300 px-3 py-2 text-center">1-Dec</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">39</td>
                <td className="border border-slate-300 px-3 py-2 text-center">3-Dec</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">40</td>
                <td className="border border-slate-300 px-3 py-2 text-center">5-Dec</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">41</td>
                <td className="border border-slate-300 px-3 py-2 text-center">8-Dec</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const slides = [
    { key: "title", title: "Start", render: () => <TitleSlide /> },
  ];

  return (
    <SlideApp
      title={TITLE}
      subtitle={SUBTITLE}
      course={COURSE}
      section="Presentation Template"
      slides={slides}
      storageKey="slidekit_example"
      identitySessionKey={IDENTITY_SESSION_KEY}
      onReset={() => {
        try { sessionStorage.removeItem("slidekit_session_salt"); } catch {}
        try { sessionStorage.removeItem(IDENTITY_SESSION_KEY); } catch {}
      }}
      buildRecord={({ meta, buckets, order }) => ({ meta, order, data: buckets })}
    />
  );
}

// -----------------------------
// Download Slide — export JSON and printable summary
// -----------------------------
function DownloadSlide() {
  // small helper to ensure latest debounced writes likely finished
  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  const buildRecord = async () => {
    // Wait a tick to let debounced localStorage writes flush
    await delay(350);
    const buckets = (() => {
      try {
        const raw = localStorage.getItem("slidekit_example");
        return (raw && JSON.parse(raw)) || {};
      } catch {
        return {} as any;
      }
    })();
    const identity = (() => {
      try {
        const raw = sessionStorage.getItem("slidekit_example_identity_session");
        return (raw && JSON.parse(raw)) || null;
      } catch {
        return null;
      }
    })();
    const date = new Date().toLocaleDateString();
    const ts = new Date().toLocaleString();
    const salt = (() => {
      const KEY = "slidekit_session_salt";
      try {
        const ex = sessionStorage.getItem(KEY);
        if (ex) return ex;
        let out = "";
        try {
          const arr = new Uint32Array(3);
          crypto.getRandomValues(arr);
          out = Array.from(arr).map((n) => n.toString(36)).join("");
        } catch {
          out = Math.random().toString(36).slice(2);
        }
        out = out.slice(0, 12);
        sessionStorage.setItem(KEY, out);
        return out;
      } catch {
        return Math.random().toString(36).slice(2, 14);
      }
    })();
    const device = `${navigator.language || "en-US"}, ${Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"}, ${window.innerWidth}x${window.innerHeight}@${window.devicePixelRatio || 1}`;
    return {
      meta: { title: TITLE, course: COURSE, section: "Presentation Template", date },
      identity,
      order: ["title", "welcome", "brainstorm", "tables", "download"],
      data: buckets,
      version: 1,
      salt,
      device,
      timestamp: ts,
    };
  };

  const getIdentity = () => {
    try {
      const raw = sessionStorage.getItem(IDENTITY_SESSION_KEY);
      return (raw && JSON.parse(raw)) || null;
    } catch {
      return null;
    }
  };

  const downloadJSON = async () => {
    const idCheck = getIdentity();
    if (!idCheck?.firstName || !idCheck?.lastName || !idCheck?.section) {
      alert("Please record your name and section on the Welcome tab before downloading.");
      return;
    }
    const record = await buildRecord();
    const assignment = SUBTITLE.split(":")[0] || SUBTITLE;
    const fullName = `${record.identity?.firstName || ""} ${record.identity?.lastName || ""}`.trim();
    const docId = (await sha256Hex(JSON.stringify(record))).slice(0, 12);
    const headerLine = `${COURSE} — ${assignment} • ${fullName || "—"} • ${record.identity?.section || "—"} • ${record.timestamp}`;
    const detailsLine = `Salt: ${record.salt} • Doc ID: ${docId} • Device: ${record.device}`;
    const enriched = { ...record, headerLine, detailsLine, docId };
    const blob = new Blob([JSON.stringify(enriched, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    const safe = (s: string) => String(s || "").replace(/[^A-Za-z0-9-_]+/g, "_").slice(0, 80);
    const name = `${safe(COURSE)}_${safe(assignment)}_${safe(fullName || "student")}_${safe(record.identity?.section || "section")}_${safe(new Date().toLocaleDateString())}.json`;
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Enhanced summary with identity and device header
  async function sha256Hex(s: string): Promise<string> {
    try {
      const enc = new TextEncoder();
      const buf = await crypto.subtle.digest("SHA-256", enc.encode(s));
      const arr = Array.from(new Uint8Array(buf));
      return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch {
      let h = 0;
      for (let i = 0; i < s.length; i++) { h = ((h << 5) - h) + s.charCodeAt(i); h |= 0; }
      return Math.abs(h).toString(16).padStart(12, "0");
    }
  }
  function sessionSalt(): string {
    const KEY = "slidekit_session_salt";
    try {
      const ex = sessionStorage.getItem(KEY);
      if (ex) return ex;
      let out = "";
      try {
        const arr = new Uint32Array(3);
        crypto.getRandomValues(arr);
        out = Array.from(arr).map((n) => n.toString(36)).join("");
      } catch {
        out = Math.random().toString(36).slice(2);
      }
      out = out.slice(0, 12);
      sessionStorage.setItem(KEY, out);
      return out;
    } catch {
      return Math.random().toString(36).slice(2, 14);
    }
  }

  const downloadSummary2 = async () => {
    const idCheck = getIdentity();
    if (!idCheck?.firstName || !idCheck?.lastName || !idCheck?.section) {
      alert("Please record your name and section on the Welcome tab before downloading.");
      return;
    }
    const record = await buildRecord();
    const salt = record.salt || sessionSalt();
    const device = record.device || `${navigator.language || "en-US"}, ${Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"}, ${window.innerWidth}x${window.innerHeight}@${window.devicePixelRatio || 1}`;
    const assignment = SUBTITLE.split(":")[0] || SUBTITLE;
    const fullName = `${record.identity?.firstName || ""} ${record.identity?.lastName || ""}`.trim();
    const timestamp = record.timestamp || new Date().toLocaleString();
    const docId = (await sha256Hex(JSON.stringify({ record, salt, device }))).slice(0, 12);
    const headerLine = `${COURSE} — ${assignment} • ${fullName || "—"} • ${record.identity?.section || "—"} • ${timestamp}`;
    const detailsLine = `Salt: ${salt} • Doc ID: ${docId} • Device: ${device}`;
    const safe = (s: string) => String(s || "").replace(/[^A-Za-z0-9-_]+/g, "_").slice(0, 80);
    const filenameBase = `${safe(COURSE)}_${safe(assignment)}_${safe(fullName || "student")}_${safe(record.identity?.section || "section")}_${safe(new Date().toLocaleDateString())}`;

    // Build organized sections from buckets
    const notes: string[] = Array.isArray((record as any)?.data?.brainstorm?.notes)
      ? (record as any).data.brainstorm.notes
      : [];
    const tables: any[] = Array.isArray((record as any)?.data?.tables?.tables)
      ? (record as any).data.tables.tables
      : [];

    const notesHtml = notes.length
      ? `<ol class="list-decimal pl-6">${notes
          .map((n) => `<li>${escapeHtml(String(n || "")).replace(/\n/g, "<br>")}</li>`)
          .join("")}</ol>`
      : `<div class="muted">No brainstorm notes recorded.</div>`;

    const tableCards = tables
      .map((t, i) => {
        const name = (t && t.name) ? String(t.name) : `Table ${i + 1}`;
        const rows: any[] = Array.isArray(t?.rows) ? t.rows : [];
        const rowsHtml = rows.length
          ? rows
              .map(
                (r: any) => `<tr>
                  <td>${escapeHtml(String(r?.col ?? "")) || "&mdash;"}</td>
                  <td class="center">${r?.pk ? "✓" : "—"}</td>
                  <td class="center">${r?.fk ? "✓" : "—"}</td>
                </tr>`
              )
              .join("")
          : `<tr><td colspan="3" class="muted">No fields</td></tr>`;
        return `<div class="card">
          <div class="card-title">${escapeHtml(name)}</div>
          <table class="grid">
            <thead><tr><th>Field</th><th>PK</th><th>FK</th></tr></thead>
            <tbody>${rowsHtml}</tbody>
          </table>
        </div>`;
      })
      .join("");

    const html = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>${filenameBase}</title>
      <style>
        @media print { @page { margin: 16mm; } }
        body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#0f172a;padding:32px;line-height:1.6;background:#f8fafc}
        h1{font-size:28px;margin:0 0 2px}
        h2{font-size:20px;margin:0 0 8px;color:#0b1324}
        .sub{color:#0b1324;font-weight:700;margin-bottom:6px}
        .muted{color:#64748b}
        .card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin:14px 0;page-break-inside:avoid}
        .card-title{font-weight:700;margin-bottom:8px}
        .chip{display:inline-block;background:#e2e8f0;border-radius:9999px;padding:2px 10px;margin-top:6px;color:#334155}
        .list-decimal{counter-reset:item}
        table.grid{width:100%;border-collapse:separate;border-spacing:0;}
        table.grid th, table.grid td{border-top:1px solid #e2e8f0;padding:8px 10px;font-size:14px}
        table.grid thead th{background:#f1f5f9;border-top:0;color:#0b1324;text-align:left}
        table.grid td.center, table.grid th.center{text-align:center}
      </style></head><body>
      <h1>${escapeHtml(TITLE)}</h1>
      <h2 class=\"sub\">${escapeHtml(SUBTITLE)}</h2>
      <div>${escapeHtml(headerLine)}</div>
      <div class=\"muted\">${escapeHtml(detailsLine)}</div>
      <div class=\"chip\">Submission Summary</div>
      
      <div class=\"card\">
        <div class=\"card-title\">Brainstorm Notes</div>
        ${notesHtml}
      </div>
      <div class=\"card\">
        <div class=\"card-title\">Tables</div>
        ${tableCards || '<div class="muted">No tables designed.</div>'}
      </div>
      <script>setTimeout(function(){ try{ window.print(); }catch(e){} }, 200);</script>
      </body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "summary.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const downloadSummary = async () => {
    const record = await buildRecord();
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>${TITLE} — Summary</title>
      <style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;color:#0f172a;padding:32px;line-height:1.6}
      h1{font-size:28px;margin:0 0 8px} h2{font-size:18px;margin:18px 0 6px}
      code,pre{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;display:block;white-space:pre-wrap}
      .muted{color:#64748b} .row{margin-top:6px}
      </style></head><body>
      <h1>${TITLE}</h1>
      <div class="muted">${COURSE} • Presentation Template • ${new Date().toLocaleDateString()}</div>
      <h2>Identity</h2>
      <div class="row"><b>Name:</b> ${(record.identity?.firstName || "")} ${(record.identity?.lastName || "")}</div>
      <div class="row"><b>Section:</b> ${record.identity?.section || "—"}</div>
      <h2>Data</h2>
      <pre>${escapeHtml(JSON.stringify(record.data, null, 2))}</pre>
      </body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
      const a = document.createElement("a");
      a.href = url;
      a.download = "summary.html";
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  function escapeHtml(s: string) {
    return String(s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c] || c));
  }

  const idNow = getIdentity();
  const canDownload = !!(idNow?.firstName && idNow?.lastName && idNow?.section);

  return (
    <div className="text-center py-16 max-w-3xl mx-auto">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-2">All set — nice work!</h2>
      
      {!canDownload && (
        <div className="mt-4 text-rose-700 bg-rose-50 border border-rose-200 inline-block px-4 py-2 rounded-lg">
          Please record your first name, last name, and section on the Welcome tab before downloading.
        </div>
      )}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={downloadSummary2} disabled={!canDownload} className={`px-6 py-3 rounded-xl text-white font-semibold shadow-sm ${canDownload ? "bg-slate-900 hover:bg-slate-800" : "bg-slate-400 cursor-not-allowed"}`}>Download PDF</button>
        <button onClick={downloadJSON} disabled={!canDownload} className={`px-6 py-3 rounded-xl text-white font-semibold shadow-sm ${canDownload ? "bg-emerald-600 hover:bg-emerald-700" : "bg-emerald-400 cursor-not-allowed"}`}>Download JSON Data</button>
      </div>
    </div>
  );
}
