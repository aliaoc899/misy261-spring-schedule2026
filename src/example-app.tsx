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
    <div className="text-center py-20">
      <div className="text-sm uppercase tracking-widest text-emerald-700 font-semibold">{COURSE}</div>
      <h1 className="mt-2 text-5xl font-extrabold text-slate-900">{TITLE}</h1>
      <p className="mt-6 text-2xl text-slate-600">{SUBTITLE}</p>
      <div className="mt-8 mx-auto h-1 w-36 bg-emerald-700 rounded-full" />
    </div>
  );

  const slides = [
    { key: "title", title: "Start", render: () => <TitleSlide /> },
    { key: "welcome", title: "Welcome", render: () => <WelcomeSlide /> },
    { key: "brainstorm", title: "Brainstorm", render: () => <BrainstormSlide /> },
    { key: "tables", title: "Tables", render: () => <TablesSlide /> },
    { key: "download", title: "Finish & Download", render: () => <DownloadSlide /> },
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
