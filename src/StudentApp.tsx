import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** -----------------------------
 *  Types
 * ------------------------------*/
export type Row = { id: string; col: string; pk: boolean; fk: boolean };

type SimpleTableCardProps = {
  tableIndex: number;
  table: { name: string; rows: Row[] };
  onChangeName: (idx: number, name: string) => void;
  onChangeRows: (idx: number, rows: Row[]) => void;
};

type TabDataShape = {
  welcome?: {
    studentName: string;
    classSection: string;
    identityLocked: boolean;
    __updatedAt: number;
  };
  analyze?: {
    workshops: { dup: boolean; red: boolean; inc: boolean; id: boolean };
    registrations: { dup: boolean; red: boolean; inc: boolean; id: boolean };
    __updatedAt: number;
  };
  propose?: {
    workshops: string[];
    registrations: string[];
    solutions: string[];
    __updatedAt: number;
  };
  apply_design?: {
    pName: string;
    iName: string;
    wName: string;
    rName: string;
    pRows: Row[];
    iRows: Row[];
    wRows: Row[];
    rRows: Row[];
    summaries: {
      attendeeFields: string;
      attendeePK: string;
      instructorFields: string;
      workshopFields: string;
      workshopPK: string;
      regFields: string;
      regPK: string;
    };
    __updatedAt: number;
  };
  m2m_redesign?: {
    tables: { name: string; rows: Row[] }[];
    __updatedAt: number;
  };
  [k: string]: any;
};

/** -----------------------------
 *  Utilities
 * ------------------------------*/
const newRow = (): Row => ({
  id: (typeof crypto !== "undefined" && (crypto as any).randomUUID?.()) || String(Math.random()),
  col: "",
  pk: false,
  fk: false,
});

function safeOpenWindow(url: string, name?: string, features?: string): Window | null {
  try {
    if (typeof window === "undefined" || typeof window.open !== "function") return null;
    const w = window.open(url, name, features);
    return w || null;
  } catch {
    return null;
  }
}
function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c] || c);
}
function prettyCsv(s: string) {
  return String(s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .join(", ") || "—";
}
function escapeCsv(s: string) {
  return String(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map(escapeHtml)
    .join(", ");
}
function shortCsv(rows: string[][], maxRows: number, maxCols: number) {
  try {
    if (!Array.isArray(rows) || !rows.length) return [] as string[][];
    const sliced = rows.slice(0, maxRows).map((r) => r.slice(0, maxCols));
    return sliced;
  } catch {
    return [] as string[][];
  }
}
async function sha256Hex(s: string): Promise<string> {
  try {
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest("SHA-256", enc.encode(s));
    const arr = Array.from(new Uint8Array(buf));
    return arr.map((b) => b.toString(16).padStart(2, "0")).join("");
  } catch {
    let h = 0;
    for (let i = 0; i < s.length; i++) (h = ((h << 5) - h) + s.charCodeAt(i)), (h |= 0);
    return Math.abs(h).toString(16).padStart(8, "0");
  }
}
/** Hardened CSV parser: supports quotes, commas, and escaped quotes */
function parseCsv(text: string): string[][] {
  const out: string[][] = [];
  const lines = String(text || "").trim().split(/\r?\n/);
  for (const line of lines) {
    const cells: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
        continue;
      }
      if (c === '"') {
        inQ = !inQ;
        continue;
      }
      if (c === "," && !inQ) {
        cells.push(cur);
        cur = "";
        continue;
      }
      cur += c;
    }
    cells.push(cur);
    // trim trailing empties consistently
    out.push(cells.map((c) => c.trim()));
  }
  return out;
}

/** -----------------------------
 *  Shared UI Shell
 * ------------------------------*/
function Slide({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{title}</h2>
      {subtitle ? <p className="text-slate-600 mb-4">{subtitle}</p> : null}
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-slate-200 rounded-xl p-4">
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

/** -----------------------------
 *  Reusable Card for M2M tables (stable row IDs)
 * ------------------------------*/
export const SimpleTableCard = React.memo(function SimpleTableCard({
  tableIndex,
  table,
  onChangeName,
  onChangeRows,
}: SimpleTableCardProps) {
  const setRow = (rowId: string, patch: Partial<Row>) => {
    const next = table.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r));
    onChangeRows(tableIndex, next);
  };
  const togglePKExclusive = (rowId: string, checked: boolean) => {
    const next = table.rows.map((r) => (r.id === rowId ? { ...r, pk: checked } : { ...r, pk: false }));
    onChangeRows(tableIndex, next);
  };

  return (
    <div className="border rounded-xl p-3 bg-white">
      <div className="font-semibold mb-1">Table {tableIndex + 1}</div>
      <label className="block text-sm mb-2">
        <span className="text-slate-600">Table name</span>
        <input
          value={table.name ?? ""}
          onChange={(e) => onChangeName(tableIndex, e.target.value)}
          placeholder="e.g., Customers"
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5"
        />
      </label>
      <div className="rounded-lg border border-slate-200">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-2 py-1 text-xs text-slate-600">
          <div>Field</div>
          <div className="text-center">PK</div>
          <div className="text-center">FK</div>
        </div>
        {table.rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-2 py-1 border-t border-slate-100"
          >
            <input
              value={row.col ?? ""}
              onChange={(e) => setRow(row.id, { col: e.target.value })}
              placeholder="e.g., CustomerID"
              className="rounded-md border border-slate-300 text-sm px-2 py-1"
            />
            <input
              id={`pk-${tableIndex}-${row.id}`}
              type="checkbox"
              checked={!!row.pk}
              onChange={(e) => togglePKExclusive(row.id, e.target.checked)}
            />
            <input
              id={`fk-${tableIndex}-${row.id}`}
              type="checkbox"
              checked={!!row.fk}
              onChange={(e) => setRow(row.id, { fk: e.target.checked })}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between items-center text-sm text-slate-600">
        <div>
          Summary: {table.rows.map((r) => r.col).filter(Boolean).join(", ") || "—"}
        </div>
        <button
          type="button"
          onClick={() => onChangeRows(tableIndex, [...table.rows, newRow()])}
          className="px-2 py-1 rounded-md border text-xs"
        >
          Add row
        </button>
      </div>
    </div>
  );
});

/** -----------------------------
 *  Debounced, flush-on-unmount bucket hook
 * ------------------------------*/
function useSyncedBucket<T extends Record<string, any>>(
  tabKey: keyof TabDataShape,
  defaults: T,
  loadTabData: (k: keyof TabDataShape) => any,
  saveTabData: (k: keyof TabDataShape, d: any) => void,
  delay = 250
) {
  const initial = React.useMemo(
    () => Object.assign({}, defaults, loadTabData(tabKey)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tabKey]
  );
  const [state, setState] = useState<T>(initial);

  const tRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => saveTabData(tabKey, { ...state }), delay);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
      saveTabData(tabKey, { ...state });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state)]);

  return [state, setState] as const;
}

/** -----------------------------
 *  Main App
 * ------------------------------*/
export default function StudentApp() {
  const [tabData, setTabData] = useState<TabDataShape>({});
  const [tab, setTab] = useState(0);

  // Welcome (Tab 2)
  const [studentName, setStudentName] = useState("");
  const [classSection, setClassSection] = useState("");
  const [identityLocked, setIdentityLocked] = useState(false);

  const tabsBarRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => new Date().toLocaleDateString(), []);
  const STORAGE_VERSION = 3;
  const STORAGE_KEY_CURRENT = `misy261_homework1_v${STORAGE_VERSION}`;
  const STORAGE_KEY_LEGACY = ["misy261_homework1_v2", "misy261_homework1_v1"];
  const initialSnapshotRef = useRef<any>(null);
  const [hydrated, setHydrated] = useState(false);
  const [sessionSalt, setSessionSalt] = useState<string>("");

  // Explore (preview helper)
  const SAMPLE_CSV = `ParticipantName,ParticipantEmail,ParticipantPhone,ParticipantGender,WorkshopID,WorkshopTitle,WorkshopDate,Location,InstructorName,InstructorEmail,InstructorGender,PaymentMethod,DiscountCode,PricePaid
Aria Blake,aria.b@example.com,302-555-1091,Female,W-3001,Intro to SQL,2025-09-20,Smith Hall 205,Casey Park,casey.park@example.com,Nonbinary,Credit,SAVE10,89.10
Zoey Kim,zoey.k@example.com,302-555-1002,Female,W-3001,Intro to SQL,2025-09-20,Smith Hall 205,Casey Park,casey.park@example.com,Nonbinary,Cash,,99.00
Ethan Smith,ethan.s@example.com,302-555-1003,Male,W-3001,Intro to SQL,2025-09-20,Smith Hall 205,Casey Park,casey.park@example.com,Nonbinary,Transfer,STUDENT15,84.15
Grace Ward,grace.w@example.com,302-555-1004,Female,W-3001,Intro to SQL,2025-09-20,Smith Hall 205,Casey Park,casey.park@example.com,Nonbinary,Credit,EARLY20,79.20
Sam Patel,sam.p@example.com,302-555-1005,Male,W-3001,Intro to SQL,2025-09-20,Smith Hall 205,Casey Park,casey.park@example.com,Nonbinary,Credit,,99.00
Mia Lopez,mia.l@example.com,302-555-1006,Female,W-3002,Data Modeling 101,2025-09-21,Smith Hall 207,Jordan Lee,jordan.lee@example.com,Male,Credit,SAVE10,116.10
Leo Chang,leo.c@example.com,302-555-1007,Male,W-3002,Data Modeling 101,2025-09-21,Smith Hall 207,Jordan Lee,jordan.lee@example.com,Male,Transfer,,129.00
Nora Davis,nora.d@example.com,302-555-1008,Female,W-3002,Data Modeling 101,2025-09-21,Smith Hall 207,Jordan Lee,jordan.lee@example.com,Male,Credit,STUDENT15,109.65
Riley Chen,riley.c@example.com,302-555-1092,Nonbinary,W-3002,Data Modeling 101,2025-09-21,Smith Hall 207,Jordan Lee,jordan.lee@example.com,Male,Cash,EARLY20,103.20
Zoey Kim,zoey.k@example.com,302-555-1002,Female,W-3002,Data Modeling 101,2025-09-21,Smith Hall 207,Jordan Lee,jordan.lee@example.com,Male,Credit,,129.00
Amir Rahman,amir.r@example.com,302-555-1009,Male,W-3003,Dashboards with BI,2025-09-22,Online,Jamie Chen,jamie.chen@example.com,Female,Credit,SAVE10,134.10
Priya Shah,priya.s@example.com,302-555-1010,Female,W-3003,Dashboards with BI,2025-09-22,Online,Jamie Chen,jamie.chen@example.com,Female,Transfer,,149.00
Ben Ortiz,ben.o@example.com,302-555-1011,Male,W-3003,Dashboards with BI,2025-09-22,Online,Jamie Chen,jamie.chen@example.com,Female,Cash,STUDENT15,126.65
Ava Nguyen,ava.n@example.com,302-555-1012,Female,W-3003,Dashboards with BI,2025-09-22,Online,Jamie Chen,jamie.chen@example.com,Female,Credit,EARLY20,119.20
Ethan Smith,ethan.s@example.com,302-555-1003,Male,W-3003,Dashboards with BI,2025-09-22,Online,Jamie Chen,jamie.chen@example.com,Female,Credit,,149.00
Grace Ward,grace.w@example.com,302-555-1004,Female,W-3004,Advanced SQL,2025-10-05,Smith Hall 210,Casey Park,casey.park@example.com,Nonbinary,Credit,SAVE10,143.10
Sam Patel,sam.p@example.com,302-555-1005,Male,W-3004,Advanced SQL,2025-10-05,Smith Hall 210,Casey Park,casey.park@example.com,Nonbinary,Transfer,STUDENT15,135.15
Mia Lopez,mia.l@example.com,302-555-1006,Female,W-3004,Advanced SQL,2025-10-05,Smith Hall 210,Casey Park,casey.park@example.com,Nonbinary,Cash,,159.00
Leo Chang,leo.c@example.com,302-555-1007,Male,W-3004,Advanced SQL,2025-10-05,Smith Hall 210,Casey Park,casey.park@example.com,Nonbinary,Credit,EARLY20,127.20
Nora Davis,nora.d@example.com,302-555-1008,Female,W-3004,Advanced SQL,2025-10-05,Smith Hall 210,Casey Park,casey.park@example.com,Nonbinary,Credit,,159.00
,,, ,W-3005,Data Ethics,2025-10-12,Smith Hall 208,Jordan Lee,jordan.lee@example.com,Male,,,
,,, ,W-3006,Python for Data,2025-10-20,Online,Casey Park,casey.park@example.com,Nonbinary,,,
,,, ,W-3007,Data Visualization,2025-10-25,Online,Jamie Chen,jamie.chen@example.com,Female,,,
,,, ,W-3008,Intro to SQL,2025-10-28,Smith Hall 105,Jordan Lee,jordan.lee@example.com,Male,,,
,,, ,W-3009,Data Modeling 101,2025-11-02,Smith Hall 220,Casey Park,casey.park@example.com,Nonbinary,,,
,,, ,W-3010,Python for Data,2025-11-10,Smith Hall 115,Jamie Chen,jamie.chen@example.com,Female,,,`;
  const [csvText, setCsvText] = useState(SAMPLE_CSV);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [expNotes, setExpNotes] = useState("");

  // Analyze (Tab 4) — global flags derived from that tab
  const [obsDupRows, setObsDupRows] = useState(false);
  const [obsRedundancy, setObsRedundancy] = useState(false);
  const [obsInconsistency, setObsInconsistency] = useState(false);
  const [obsNoIDs, setObsNoIDs] = useState(false);

  // Propose (Tab 5)
  const [solutions, setSolutions] = useState<string[]>([]);
  const [solWorkshops, setSolWorkshops] = useState<string[]>([]);
  const [solRegistrations, setSolRegistrations] = useState<string[]>([]);
  useEffect(() => setSolutions([...solWorkshops, ...solRegistrations]), [solWorkshops, solRegistrations]);

  // Apply (Tab 6) – summaries for Review/PDF
  const [attendeeFields, setAttendeeFields] = useState("");
  const [attendeePK, setAttendeePK] = useState("");
  const [instructorFields, setInstructorFields] = useState("");
  const [workshopFields, setWorkshopFields] = useState("");
  const [workshopPK, setWorkshopPK] = useState("");
  const [regFields, setRegFields] = useState("");
  const [regPK, setRegPK] = useState("");

  // --- autosave (debounced) to localStorage snapshot
  const saveTimeoutRef = useRef<number | undefined>(undefined);
  const snapshot = {
    studentName,
    classSection,
    csvText,
    csvPreview,
    expNotes,
    obsDupRows,
    obsRedundancy,
    obsInconsistency,
    obsNoIDs,
    solutions,
    attendeeFields,
    attendeePK,
    instructorFields,
    workshopFields,
    workshopPK,
    regFields,
    regPK,
    identityLocked,
    sessionSalt,
    tabData,
    __version: STORAGE_KEY_CURRENT,
  };

  // Save tab data helper — always stamps a version
  const saveTabData = useCallback((tabKey: keyof TabDataShape, data: any) => {
    setTabData((prev) => ({
      ...prev,
      [tabKey]: { ...(prev[tabKey] || {}), ...data, __updatedAt: Date.now() },
    }));
  }, []);

  const loadTabData = useCallback(
    (tabKey: keyof TabDataShape) => (tabData?.[tabKey] as any) || {},
    [tabData]
  );

  // Persist everything to localStorage (debounced)
  const saveSnapshot = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(snapshot));
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snapshot.studentName, snapshot.classSection, snapshot.csvText, snapshot.csvPreview, snapshot.expNotes, snapshot.obsDupRows, snapshot.obsRedundancy, snapshot.obsInconsistency, snapshot.obsNoIDs, snapshot.solutions, snapshot.attendeeFields, snapshot.attendeePK, snapshot.instructorFields, snapshot.workshopFields, snapshot.workshopPK, snapshot.regFields, snapshot.regPK, snapshot.identityLocked, snapshot.sessionSalt, snapshot.tabData]);

  useEffect(() => {
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(saveSnapshot, 400);
    return () => {
      if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    };
  }, [saveSnapshot]);

  // Migration helpers
  const addIdsToRows = (rows?: Row[] | any[]) =>
    Array.isArray(rows) ? rows.map((r: any) => ({ id: r.id || newRow().id, col: r.col || "", pk: !!r.pk, fk: !!r.fk })) : [];

  function migrateLoaded(data: any) {
    if (!data) return data;
    // add Row.id everywhere
    if (data?.tabData?.apply_design) {
      const A = data.tabData.apply_design;
      A.pRows = addIdsToRows(A.pRows);
      A.iRows = addIdsToRows(A.iRows);
      A.wRows = addIdsToRows(A.wRows);
      A.rRows = addIdsToRows(A.rRows);
    }
    if (data?.tabData?.m2m_redesign?.tables) {
      data.tabData.m2m_redesign.tables = data.tabData.m2m_redesign.tables.map((t: any) => ({
        name: t.name || "",
        rows: addIdsToRows(t.rows && t.rows.length ? t.rows : [newRow()]),
      }));
    }
    // If csvPreview empty but csvText present, rebuild preview
    if ((!data.csvPreview || !data.csvPreview.length) && data.csvText) {
      try {
        data.csvPreview = parseCsv(data.csvText);
      } catch {
        /* ignore */
      }
    }
    return data;
  }

  // Load snapshot from localStorage (supports legacy keys)
  useEffect(() => {
    const tryLoad = (key: string | null) => {
      if (!key) return false;
      const raw = localStorage.getItem(key);
      if (!raw) return false;
      try {
        const migrated = migrateLoaded(JSON.parse(raw) || {});
        const data = migrated || {};
        if (data.studentName) setStudentName(data.studentName);
        if (data.classSection) setClassSection(data.classSection);
        if (typeof data.identityLocked === "boolean") setIdentityLocked(data.identityLocked);
        if (data.csvText) setCsvText(data.csvText);
        if (data.csvPreview) setCsvPreview(data.csvPreview);
        if (data.expNotes) setExpNotes(data.expNotes);
        if (typeof data.obsDupRows === "boolean") setObsDupRows(data.obsDupRows);
        if (typeof data.obsRedundancy === "boolean") setObsRedundancy(data.obsRedundancy);
        if (typeof data.obsInconsistency === "boolean") setObsInconsistency(data.obsInconsistency);
        if (typeof data.obsNoIDs === "boolean") setObsNoIDs(data.obsNoIDs);
        if (Array.isArray(data.solutions)) setSolutions(data.solutions);
        if (data.attendeeFields) setAttendeeFields(data.attendeeFields);
        if (data.attendeePK) setAttendeePK(data.attendeePK);
        if (data.instructorFields) setInstructorFields(data.instructorFields);
        if (data.workshopFields) setWorkshopFields(data.workshopFields);
        if (data.workshopPK) setWorkshopPK(data.workshopPK);
        if (data.regFields) setRegFields(data.regFields);
        if (data.regPK) setRegPK(data.regPK);
        if (data.sessionSalt) setSessionSalt(data.sessionSalt);
        if (data.tabData) setTabData(data.tabData);
        return true;
      } catch {
        return false;
      }
    };
    if (!tryLoad(STORAGE_KEY_CURRENT)) {
      for (const k of STORAGE_KEY_LEGACY) if (tryLoad(k)) break;
    }
    // ensure preview exists if not loaded
    if (!csvPreview?.length && csvText) setCsvPreview(parseCsv(csvText));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After hydration capture initial snapshot (for Reset)
  useEffect(() => {
    if (!hydrated) return;
    if (initialSnapshotRef.current) return;
    initialSnapshotRef.current = JSON.parse(JSON.stringify(snapshot));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, saveSnapshot]);

  // session salt
  useEffect(() => {
    if (!sessionSalt) {
      try {
        const rnd = crypto.getRandomValues(new Uint32Array(2));
        const salt = Array.prototype.slice
          .call(rnd)
          .map((n: number) => n.toString(36))
          .join("");
        setSessionSalt(salt);
      } catch {
        setSessionSalt(String(Math.random()).slice(2));
      }
    }
  }, [sessionSalt]);

  // Preview loader
  const loadPreview = () => setCsvPreview(parseCsv(csvText));

  // Progress (don’t count Review as always done)
  const progress = useMemo(() => {
    const analyzeDone =
      (tabData.analyze?.workshops?.dup ||
        tabData.analyze?.workshops?.red ||
        tabData.analyze?.workshops?.inc ||
        tabData.analyze?.workshops?.id ||
        tabData.analyze?.registrations?.dup ||
        tabData.analyze?.registrations?.red ||
        tabData.analyze?.registrations?.inc ||
        tabData.analyze?.registrations?.id) || false;

    const proposeDone = !!(tabData.propose?.solutions?.length);

    const apply = tabData.apply_design?.summaries || {};
    const applyDone =
      !!(
        apply.attendeePK ||
        apply.workshopPK ||
        apply.regPK ||
        apply.attendeeFields ||
        apply.workshopFields ||
        apply.regFields
      );

    const m2mDone = !!(tabData.m2m_redesign?.tables && tabData.m2m_redesign.tables.some(t => (t.name || t.rows?.some((r: Row)=>r.col))));

    const welcomeDone = !!(studentName && classSection);

    const stepMap: Record<string, boolean> = {
      Welcome: welcomeDone,
      Explore: csvPreview.length > 0 || !!expNotes,
      Analyze: analyzeDone,
      Propose: proposeDone,
      "Apply (4 tables)": applyDone,
      "M2M Redesign": m2mDone,
      Review: welcomeDone && (analyzeDone || applyDone || m2mDone), // only when there’s something to review
    };
    const done = Object.values(stepMap).filter(Boolean).length;
    const total = Object.keys(stepMap).length;
    return { stepMap, percent: Math.round((done / total) * 100) };
  }, [studentName, classSection, csvPreview, expNotes, tabData]);

  // Keep active tab in view
  useEffect(() => {
    const el = tabsBarRef.current;
    if (!el) return;
    const active = el.querySelector(`[data-tab='${tab}']`) as HTMLElement | null;
    try {
      if (active && typeof (active as any).scrollIntoView === "function") {
        active.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
      }
    } catch {}
  }, [tab]);

  // Arrow-key nav (don’t interfere with typing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable = !!(
        (target && (target as HTMLElement).isContentEditable) ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select"
      );
      if (isEditable) return;
      if (e.key === "ArrowLeft") setTab((t) => Math.max(0, t - 1));
      else if (e.key === "ArrowRight") setTab((t) => Math.min(tabs.length - 1, t + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Reset
  const onResetAll = () => {
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    try {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
      STORAGE_KEY_LEGACY.forEach((k) => localStorage.removeItem(k));
      if (initialSnapshotRef.current) {
        try {
          localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(initialSnapshotRef.current));
        } catch {}
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
      STORAGE_KEY_LEGACY.forEach((k) => localStorage.removeItem(k));
    }
    setTab(0);
    setStudentName("");
    setClassSection("");
    setIdentityLocked(false);
    setSessionSalt("");
    setCsvText(SAMPLE_CSV);
    setCsvPreview([]);
    setExpNotes("");

    setObsDupRows(false);
    setObsRedundancy(false);
    setObsInconsistency(false);
    setObsNoIDs(false);
    setSolutions([]);
    setSolWorkshops([]);
    setSolRegistrations([]);

    setAttendeeFields("");
    setAttendeePK("");
    setInstructorFields("");
    setWorkshopFields("");
    setWorkshopPK("");
    setRegFields("");
    setRegPK("");

    setTabData({});
  };

  /** Build a single record from tabData for Review + PDF */
  const record = useMemo(() => {
    const welcome = loadTabData("welcome") || {};
    const analyze = loadTabData("analyze") || {};
    const propose = loadTabData("propose") || {};
    const apply = loadTabData("apply_design") || {};
    const m2m = loadTabData("m2m_redesign") || {};

    const meta = {
      studentName: welcome.studentName ?? studentName,
      classSection: welcome.classSection ?? classSection,
      today,
    };

    const explore = { csvPreview, expNotes };

    const analyzeFlags = {
      workshops: analyze.workshops || { dup: false, red: false, inc: false, id: false },
      registrations: analyze.registrations || { dup: false, red: false, inc: false, id: false },
    };

    const proposeSelections = {
      workshops: propose.workshops || [],
      registrations: propose.registrations || [],
      solutions: propose.solutions || solutions || [],
    };

    const applyTables = {
      pName: apply.pName || "Table 1",
      iName: apply.iName || "Table 2",
      wName: apply.wName || "Table 3",
      rName: apply.rName || "Table 4",
      pRows: Array.isArray(apply.pRows) ? apply.pRows : [],
      iRows: Array.isArray(apply.iRows) ? apply.iRows : [],
      wRows: Array.isArray(apply.wRows) ? apply.wRows : [],
      rRows: Array.isArray(apply.rRows) ? apply.rRows : [],
      summaries: apply.summaries || {
        attendeeFields,
        attendeePK,
        instructorFields,
        workshopFields,
        workshopPK,
        regFields,
        regPK,
      },
    };

    const m2mTables = Array.isArray(m2m.tables) ? m2m.tables : [];

    return {
      meta,
      explore,
      analyze: analyzeFlags,
      propose: proposeSelections,
      apply: applyTables,
      m2m: { tables: m2mTables },
      raw: { tabData },
    };
  }, [
    tabData,
    loadTabData,
    studentName,
    classSection,
    today,
    csvPreview,
    expNotes,
    solutions,
    attendeeFields,
    attendeePK,
    instructorFields,
    workshopFields,
    workshopPK,
    regFields,
    regPK,
  ]);

  /** Guarded download — now passes the compiled record */
  const isFullName = (s?: string) => /^[A-Za-z][\w'-]+(\s+[A-Za-z][\w'-]+)+$/.test(String(s || "").trim());
  const onDownloadClick = () => {
    if (!isFullName(record.meta.studentName)) {
      alert("To download, go to 2. Welcome and enter your full name.");
      return;
    }
    if (!record.meta.classSection) {
      alert("To download, go to 2. Welcome and select your section.");
      return;
    }
    if (!identityLocked && !(tabData.welcome?.identityLocked)) {
      alert('To download, go to 2. Welcome and click "Record Name & Section" to lock your identity.');
      return;
    }
    downloadSummary({ record, sessionSalt });
  };

  /** Tabs */
  const tabs = useMemo(
    () => [
      { title: "Title", node: <TitleSlide /> },
      {
        title: "Welcome",
        node: (
          <Welcome
            studentName={studentName}
            setStudentName={setStudentName}
            classSection={classSection}
            setClassSection={setClassSection}
            today={today}
            identityLocked={identityLocked}
            setIdentityLocked={setIdentityLocked}
            saveTabData={saveTabData}
            loadTabData={loadTabData}
          />
        ),
      },
      {
        title: "Explore",
        node: (
          <Explore
            csvText={csvText}
            setCsvText={setCsvText}
            csvPreview={csvPreview}
            loadPreview={loadPreview}
            expNotes={expNotes}
            setExpNotes={setExpNotes}
          />
        ),
      },
      {
        title: "Analyze",
        node: (
          <Analyze
            csvPreview={csvPreview}
            loadTabData={loadTabData}
            saveTabData={saveTabData}
            reflectGlobal={{
              setObsDupRows,
              setObsRedundancy,
              setObsInconsistency,
              setObsNoIDs,
            }}
          />
        ),
      },
      {
        title: "Propose",
        node: (
          <Propose
            loadTabData={loadTabData}
            saveTabData={saveTabData}
            solWorkshops={solWorkshops}
            setSolWorkshops={setSolWorkshops}
            solRegistrations={solRegistrations}
            setSolRegistrations={setSolRegistrations}
          />
        ),
      },
      {
        title: "Apply (4 tables)",
        node: (
          <ApplyDesign
            saveTabData={saveTabData}
            loadTabData={loadTabData}
            setSummaries={{
              setAttendeeFields,
              setAttendeePK,
              setInstructorFields,
              setWorkshopFields,
              setWorkshopPK,
              setRegFields,
              setRegPK,
            }}
          />
        ),
      },
      {
        title: "M2M Redesign",
        node: <M2MRedesign saveTabData={saveTabData} loadTabData={loadTabData} />,
      },
      { title: "Review", node: <Review record={record} /> },
      { title: "Finish and Download Submission", node: <ThankYou onDownload={onDownloadClick} /> },
    ],
    [
      studentName,
      classSection,
      today,
      identityLocked,
      csvText,
      csvPreview,
      expNotes,
      solWorkshops,
      solRegistrations,
      record,
      saveTabData,
      loadTabData,
      setAttendeeFields,
      setAttendeePK,
      setInstructorFields,
      setWorkshopFields,
      setWorkshopPK,
      setRegFields,
      setRegPK,
    ]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Black & White header and tabs */}
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-wide text-slate-500 font-semibold uppercase">MISY261</div>
            <div className="text-slate-900 font-bold">Homework 1: Workshops Registration</div>
          </div>
          <div className="w-44" aria-live="polite">
            <div className="text-xs text-slate-500 mb-1">Progress {progress.percent}%</div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-black" style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        </div>
        <div ref={tabsBarRef} className="max-w-6xl mx-auto px-2 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {tabs.map((t, i) => (
              <button
                key={i}
                data-tab={i}
                aria-current={i === tab ? "page" : undefined}
                onClick={() => setTab(i)}
                className={`shrink-0 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                  i === tab
                    ? "bg-black text-white border-black"
                    : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
                }`}
              >
                {i + 1}. {t.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 pb-28">
        {/* Ensures content is always inside a slide container */}
        <div className="slide-content">{tabs[tab].node}</div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-[14px] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-full bg-slate-700 hover:bg-slate-800 text-white text-sm"
              onClick={onResetAll}
              title="Start a new session"
            >
              Reset
            </button>
            <div className="text-xs text-slate-500">Use ← → keys to navigate</div>
          </div>
          <div className="flex-1 text-center text-sm text-slate-700 font-medium truncate">
            {tab + 1}. {tabs[tab].title} • {today}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-full bg-black text-white text-sm disabled:opacity-50"
              onClick={() => setTab((t) => Math.max(0, t - 1))}
              disabled={tab === 0}
            >
              Back
            </button>
            <button
              className="px-3 py-1.5 rounded-full bg-black text-white text-sm disabled:opacity-50"
              onClick={() => setTab((t) => Math.min(tabs.length - 1, t + 1))}
              disabled={tab === tabs.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/** -----------------------------
 *  Slides
 * ------------------------------*/
function TitleSlide() {
  return (
    <Slide title="MISY261: Business Information Systems" subtitle="Homework 1: Data Management and Data Modeling">
      <SectionCard title="Overview">
        <p className="text-slate-700">
          Work through the slides to explore the flat data, analyze issues, propose improvements, design tables (PK/FK),
          and submit a structured summary PDF.
        </p>
      </SectionCard>
    </Slide>
  );
}

/** -----------------------------
 *  Tab 2 — Welcome
 * ------------------------------*/
function Welcome({
  studentName,
  setStudentName,
  classSection,
  setClassSection,
  today,
  identityLocked,
  setIdentityLocked,
  saveTabData,
  loadTabData,
}: {
  studentName: string;
  setStudentName: (v: string) => void;
  classSection: string;
  setClassSection: (v: string) => void;
  today: string;
  identityLocked: boolean;
  setIdentityLocked: (v: boolean) => void;
  saveTabData: (tabKey: keyof TabDataShape, data: any) => void;
  loadTabData: (tabKey: keyof TabDataShape) => any;
}) {
  const [bucket, setBucket] = useSyncedBucket(
    "welcome",
    { studentName: "", classSection: "", identityLocked: false },
    loadTabData,
    saveTabData
  );

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  // seed sub-fields
  useEffect(() => {
    const name = bucket.studentName || studentName || "";
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      setFirst(parts[0]);
      setLast(parts.slice(1).join(" "));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // combine back to full name
  useEffect(() => {
    const full = [first, last].map((s) => s.trim()).filter(Boolean).join(" ");
    setStudentName(full);
    setBucket((b) => ({ ...b, studentName: full, classSection: classSection || b.classSection, identityLocked }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [first, last, classSection, identityLocked]);

  return (
    <Slide title="Welcome" subtitle={`Date: ${today}`}>
      {!identityLocked ? (
        <SectionCard title="Identify Yourself">
          <div className="grid md:grid-cols-2 gap-4">
            <label className="block">
              <div className="text-sm text-slate-600 mb-1">First name</div>
              <input
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
                placeholder="First"
              />
            </label>
            <label className="block">
              <div className="text-sm text-slate-600 mb-1">Last name</div>
              <input
                value={last}
                onChange={(e) => setLast(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
                placeholder="Last"
              />
            </label>
            <label className="block md:col-span-2">
              <div className="text-sm text-slate-600 mb-1">Section</div>
              <select
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-base"
              >
                <option value="">Select section…</option>
                <option value="017 - 11:30">017 - 11:30</option>
                <option value="010 - 12:40">010 - 12:40</option>
                <option value="011 - 1:50">011 - 1:50</option>
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                const full = [first, last].map((s) => s.trim()).filter(Boolean).join(" ");
                if (full.split(/\s+/).length < 2 || !classSection) return;
                setStudentName(full);
                setIdentityLocked(true);
                setBucket((b) => ({ ...b, studentName: full, classSection, identityLocked: true }));
                saveTabData("welcome", { studentName: full, classSection, identityLocked: true });
              }}
              disabled={first.trim().length < 2 || last.trim().length < 2 || !classSection}
              className="px-5 py-2.5 rounded-lg bg-black text-white disabled:opacity-50"
            >
              Record Name & Section
            </button>
            <div className="mt-2 text-xs text-slate-600 text-center">
              Once recorded, you cannot change these here. Your PDF will include a unique verification code, session
              salt, and basic device info.
            </div>
          </div>
        </SectionCard>
      ) : (
        <SectionCard title="Recorded Identity">
          <div className="text-lg font-semibold">{studentName}</div>
          <div className="text-slate-700">
            Section: <b>{classSection}</b>
          </div>
          <div className="text-xs text-slate-500 mt-1">Locked for this browser. Use a fresh session to change.</div>
        </SectionCard>
      )}
    </Slide>
  );
}

/** -----------------------------
 *  Tab 3 — Explore (preview-only)
 * ------------------------------*/
function Explore({
  csvText,
  setCsvText,
  csvPreview,
  loadPreview,
  expNotes,
  setExpNotes,
}: {
  csvText: string;
  setCsvText: (v: string) => void;
  csvPreview: string[][];
  loadPreview: () => void;
  expNotes: string;
  setExpNotes: (v: string) => void;
}) {
  useEffect(() => {
    if (!csvPreview?.length) loadPreview();
  }, []); // eslint-disable-line

  const { workshops, registrations } = useMemo(() => {
    const res = { workshops: [] as string[][], registrations: [] as string[][] };
    if (!csvPreview?.length) return res;
    const header = csvPreview[0];
    const idx = (name: string) => header.indexOf(name);
    const wCols = [
      "WorkshopID",
      "WorkshopTitle",
      "WorkshopDate",
      "Location",
      "InstructorName",
      "InstructorEmail",
      "InstructorGender",
    ];
    const wIdx = wCols.map(idx);
    const seen = new Set<string>();
    const wRows: string[][] = [wCols];
    for (let i = 1; i < csvPreview.length; i++) {
      const row = csvPreview[i];
      const wid = row[idx("WorkshopID")] || "";
      if (!wid || seen.has(wid)) continue;
      seen.add(wid);
      wRows.push(wIdx.map((k) => (k >= 0 ? row[k] : "")));
    }

    const rCols = [
      "ParticipantName",
      "ParticipantEmail",
      "ParticipantPhone",
      "ParticipantGender",
      "WorkshopTitle",
      "PaymentMethod",
      "DiscountCode",
      "PricePaid",
    ];
    const rIdx = rCols.map(idx);
    const rRows: string[][] = [rCols];
    let count = 0;
    let skippedFirst = false;
    for (let i = 1; i < csvPreview.length && count < 20; i++) {
      const row = csvPreview[i];
      const pname = row[idx("ParticipantName")] || "";
      if (!pname) continue;
      if (!skippedFirst) {
        skippedFirst = true;
        continue;
      }
      rRows.push(rIdx.map((k) => (k >= 0 ? row[k] : "")));
      count++;
    }
    res.workshops = wRows;
    res.registrations = rRows;
    return res;
  }, [csvPreview]);

  const Table = ({ rows }: { rows: string[][] }) => (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {(rows[0] || []).map((h, i) => (
              <th key={i} className="text-left px-2 py-1 border-b border-slate-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i}>
              {row.map((c, j) => (
                <td key={j} className="px-2 py-1 border-t border-slate-100 whitespace-nowrap">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Slide title="Explore: Workshops and Registrations">
      <SectionCard title="CSV Source">
        <textarea
          value={csvText}
          onChange={(e) => setCsvText(e.target.value)}
          className="w-full h-32 rounded-md border border-slate-300 px-3 py-2"
        />
        <button onClick={loadPreview} className="px-3 py-1.5 rounded-md border bg-white text-slate-900">
          Load Preview
        </button>
      </SectionCard>
      <SectionCard title="Workshops">
        {workshops.length ? <Table rows={workshops} /> : <div className="text-sm text-slate-500">No data</div>}
      </SectionCard>
      <SectionCard title="Registrations">
        {registrations.length ? <Table rows={registrations} /> : <div className="text-sm text-slate-500">No data</div>}
      </SectionCard>
      <SectionCard title="Observations">
        <textarea
          value={expNotes}
          onChange={(e) => setExpNotes(e.target.value)}
          className="w-full h-24 rounded-md border border-slate-300 px-3 py-2"
          placeholder="Write a few notes you notice about the data…"
        />
      </SectionCard>
    </Slide>
  );
}

/** -----------------------------
 *  Tab 4 — Analyze
 * ------------------------------*/
function Analyze({
  csvPreview,
  loadTabData,
  saveTabData,
  reflectGlobal,
}: {
  csvPreview: string[][];
  loadTabData: (tabKey: keyof TabDataShape) => any;
  saveTabData: (tabKey: keyof TabDataShape, data: any) => void;
  reflectGlobal: {
    setObsDupRows: (b: boolean) => void;
    setObsRedundancy: (b: boolean) => void;
    setObsInconsistency: (b: boolean) => void;
    setObsNoIDs: (b: boolean) => void;
  };
}) {
  const [bucket, setBucket] = useSyncedBucket(
    "analyze",
    {
      workshops: { dup: false, red: false, inc: false, id: false },
      registrations: { dup: false, red: false, inc: false, id: false },
    },
    loadTabData,
    saveTabData
  );

  const w = bucket.workshops;
  const r = bucket.registrations;

  // reflect to global flags (OR across tables)
  useEffect(() => {
    reflectGlobal.setObsDupRows(w.dup || r.dup);
    reflectGlobal.setObsRedundancy(w.red || r.red);
    reflectGlobal.setObsInconsistency(w.inc || r.inc);
    reflectGlobal.setObsNoIDs(w.id || r.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, r]);

  // Derived tables for context
  const { workshops, registrations, examples } = useMemo(() => {
    const res = {
      workshops: [] as string[][],
      registrations: [] as string[][],
      examples: { wInstructor: "", wInstructorCount: 0, rParticipant: "", rParticipantCount: 0 },
    } as const as any;
    if (!csvPreview?.length) return res;
    const header = csvPreview[0];
    const idx = (name: string) => header.indexOf(name);
    const wCols = [
      "WorkshopID",
      "WorkshopTitle",
      "WorkshopDate",
      "Location",
      "InstructorName",
      "InstructorEmail",
      "InstructorGender",
    ];
    const wIdx = wCols.map(idx);
    const seen = new Set<string>();
    const wRows: string[][] = [wCols];
    for (let i = 1; i < csvPreview.length; i++) {
      const row = csvPreview[i];
      const wid = row[idx("WorkshopID")] || "";
      if (!wid || seen.has(wid)) continue;
      seen.add(wid);
      wRows.push(wIdx.map((k) => (k >= 0 ? row[k] : "")));
    }
    // ex: instructor frequency
    const instIdx = idx("InstructorName");
    if (instIdx >= 0) {
      const counts: Record<string, number> = {};
      for (let i = 1; i < csvPreview.length; i++) {
        const n = (csvPreview[i][instIdx] || "").trim();
        if (!n) continue;
        counts[n] = (counts[n] || 0) + 1;
      }
      let topName = "";
      let topCount = 0;
      for (const [n, c] of Object.entries(counts)) if (c > topCount) (topName = n), (topCount = c);
      res.examples.wInstructor = topName;
      res.examples.wInstructorCount = topCount;
    }
    // registrations view
    const rCols = [
      "ParticipantName",
      "ParticipantEmail",
      "ParticipantPhone",
      "ParticipantGender",
      "WorkshopTitle",
      "PaymentMethod",
      "DiscountCode",
      "PricePaid",
    ];
    const rIdx = rCols.map(idx);
    const rRows: string[][] = [rCols];
    let count = 0;
    for (let i = 1; i < csvPreview.length && count < 20; i++) {
      const row = csvPreview[i];
      const pname = row[idx("ParticipantName")] || "";
      if (!pname) continue;
      rRows.push(rIdx.map((k) => (k >= 0 ? row[k] : "")));
      count++;
    }
    // ex: top participant
    const pIdx = idx("ParticipantName");
    if (pIdx >= 0) {
      const counts: Record<string, number> = {};
      for (let i = 1; i < csvPreview.length; i++) {
        const n = (csvPreview[i][pIdx] || "").trim();
        if (!n) continue;
        counts[n] = (counts[n] || 0) + 1;
      }
      let topName = "";
      let topCount = 0;
      for (const [n, c] of Object.entries(counts)) if (c > topCount) (topName = n), (topCount = c);
      res.examples.rParticipant = topName;
      res.examples.rParticipantCount = topCount;
    }
    res.workshops = wRows;
    res.registrations = rRows;
    return res;
  }, [csvPreview]);

  const Table = ({ rows }: { rows: string[][] }) => (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {(rows[0] || []).map((h, i) => (
              <th key={i} className="text-left px-2 py-1 border-b border-slate-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i}>
              {row.map((c, j) => (
                <td key={j} className="px-2 py-1 border-t border-slate-100 whitespace-nowrap">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const setW = (patch: Partial<typeof w>) => setBucket((b) => ({ ...b, workshops: { ...b.workshops, ...patch } }));
  const setR = (patch: Partial<typeof r>) => setBucket((b) => ({ ...b, registrations: { ...b.registrations, ...patch } }));

  return (
    <Slide title="Analyze each table">
      <SectionCard title="Workshops">
        {csvPreview?.length ? <Table rows={shortCsv(csvPreview, 10, 8)} /> : <div className="text-sm text-slate-500">No data</div>}
        <ul className="space-y-2 text-slate-700 mt-3">
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={w.id} onChange={(e) => setW({ id: e.target.checked })} />
            <span>Identity confusion — cannot tell if two rows refer to the same <b>instructor</b> across workshops (e.g., {examples?.wInstructor || "an instructor"} appears {examples?.wInstructorCount || "multiple"}×)</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={w.dup} onChange={(e) => setW({ dup: e.target.checked })} />
            <span>Anomaly — same Workshop scheduled with unexpected differences (e.g., location change)</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={w.inc} onChange={(e) => setW({ inc: e.target.checked })} />
            <span>Inconsistency — instructor name/email variants</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={w.red} onChange={(e) => setW({ red: e.target.checked })} />
            <span>Redundancy — InstructorName/InstructorEmail repeated across many workshops</span>
          </li>
        </ul>
      </SectionCard>

      <SectionCard title="Registrations">
        {csvPreview?.length ? <Table rows={shortCsv(csvPreview, 10, 8)} /> : <div className="text-sm text-slate-500">No data</div>}
        <ul className="space-y-2 text-slate-700 mt-3">
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={r.id} onChange={(e) => setR({ id: e.target.checked })} />
            <span>Identity confusion — using only <b>WorkshopTitle</b> makes it unclear which workshop a participant is registered in</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={r.dup} onChange={(e) => setR({ dup: e.target.checked })} />
            <span>Anomaly — same participant, different phone/email</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={r.inc} onChange={(e) => setR({ inc: e.target.checked })} />
            <span>Inconsistency — name/email variants</span>
          </li>
          <li className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" checked={r.red} onChange={(e) => setR({ red: e.target.checked })} />
            <span>Redundancy — participant contact details repeated across registrations</span>
          </li>
        </ul>
      </SectionCard>
    </Slide>
  );
}

/** -----------------------------
 *  Tab 5 — Propose
 * ------------------------------*/
function Propose({
  loadTabData,
  saveTabData,
  solWorkshops,
  setSolWorkshops,
  solRegistrations,
  setSolRegistrations,
}: {
  loadTabData: (tabKey: keyof TabDataShape) => any;
  saveTabData: (tabKey: keyof TabDataShape, data: any) => void;
  solWorkshops: string[];
  setSolWorkshops: (v: string[]) => void;
  solRegistrations: string[];
  setSolRegistrations: (v: string[]) => void;
}) {
  const [bucket, setBucket] = useSyncedBucket(
    "propose",
    { workshops: [] as string[], registrations: [] as string[], solutions: [] as string[] },
    loadTabData,
    saveTabData
  );

  // hydrate into top-level lists once (keeps your existing header/record logic)
  useEffect(() => {
    if (Array.isArray(bucket.workshops)) setSolWorkshops(bucket.workshops);
    if (Array.isArray(bucket.registrations)) setSolRegistrations(bucket.registrations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const solutions = [...solWorkshops, ...solRegistrations];
    setBucket((b) => ({ ...b, workshops: solWorkshops, registrations: solRegistrations, solutions }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solWorkshops, solRegistrations]);

  const workOpts = [
    "Use a unique reference so rows always point to a valid instructor",
    "Prevent misattributing rows to the wrong instructor when names/emails are similar",
    "Keep one source of truth for instructors to avoid stale values",
  ];
  const regOpts = [
    "Use a unique reference so rows always point to a valid participant",
    "Prevent misattributing rows to the wrong participant when names/emails are similar",
    "Keep one source of truth for participants to avoid stale values",
  ];
  const ToggleGroup = ({ opts, picked, setPicked }: { opts: string[]; picked: string[]; setPicked: (v: string[]) => void }) => (
    <div className="flex flex-wrap gap-2">
      {opts.map((s) => {
        const on = picked.includes(s);
        return (
          <button
            type="button"
            key={s}
            onClick={() => setPicked(on ? picked.filter((x) => x !== s) : [...picked, s])}
            className={`px-3 py-1.5 rounded-full border text-sm ${
              on ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-900 border-slate-300 hover:bg-slate-50"
            }`}
          >
            {s}
          </button>
        );
      })}
    </div>
  );

  return (
    <Slide title="Step 3 — Propose">
      <SectionCard title="Workshops — solutions">
        <ToggleGroup opts={workOpts} picked={solWorkshops} setPicked={setSolWorkshops} />
      </SectionCard>
      <SectionCard title="Registrations — solutions">
        <ToggleGroup opts={regOpts} picked={solRegistrations} setPicked={setSolRegistrations} />
      </SectionCard>
    </Slide>
  );
}

/** -----------------------------
 *  Tab 6 — Apply (4 tables)
 * ------------------------------*/
const TableCard = ({
  title,
  rows,
  setRows,
  name,
  setName,
  summarize,
}: {
  title: string;
  rows: Row[];
  setRows: (r: Row[]) => void;
  name: string;
  setName: (v: string) => void;
  summarize: (rows: Row[]) => string;
}) => {
  const setRow = (rowId: string, patch: Partial<Row>) =>
    setRows(rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)));
  const togglePKExclusive = (rowId: string, checked: boolean) =>
    setRows(rows.map((r) => (r.id === rowId ? { ...r, pk: checked } : { ...r, pk: false })));

  return (
    <div className="border rounded-xl p-3 bg-white">
      <div className="font-semibold mb-1">{title}</div>
      <label className="block text-sm mb-2">
        <span className="text-slate-600">Table name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Customers"
          className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5"
        />
      </label>
      <div className="rounded-lg border border-slate-200">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-2 py-1 text-xs text-slate-600">
          <div>Field</div>
          <div className="text-center">PK</div>
          <div className="text-center">FK</div>
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-2 py-1 border-t border-slate-100">
            <input
              value={r.col}
              onChange={(e) => setRow(r.id, { col: e.target.value })}
              placeholder="e.g., CustomerID"
              className="rounded-md border border-slate-300 text-sm px-2 py-1"
            />
            <input
              type="checkbox"
              checked={r.pk}
              onChange={(e) => togglePKExclusive(r.id, e.target.checked)}
            />
            <input
              type="checkbox"
              checked={r.fk}
              onChange={(e) => setRow(r.id, { fk: e.target.checked })}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between items-center text-sm text-slate-600">
        <div>Summary: {summarize(rows) || "—"}</div>
        <button
          type="button"
          onClick={() => setRows([...rows, newRow()])}
          className="px-2 py-1 rounded-md border text-xs"
        >
          Add row
        </button>
      </div>
    </div>
  );
};

function ApplyDesign({
  saveTabData,
  loadTabData,
  setSummaries,
}: {
  saveTabData: (tabKey: keyof TabDataShape, data: any) => void;
  loadTabData: (tabKey: keyof TabDataShape) => any;
  setSummaries: {
    setAttendeeFields: (s: string) => void;
    setAttendeePK: (s: string) => void;
    setInstructorFields: (s: string) => void;
    setWorkshopFields: (s: string) => void;
    setWorkshopPK: (s: string) => void;
    setRegFields: (s: string) => void;
    setRegPK: (s: string) => void;
  };
}) {
  const tabKey = "apply_design";
  const saved = loadTabData(tabKey);

  const makeRows = (rows?: Row[]) =>
    Array.isArray(rows) && rows.length ? rows.map((r) => ({ ...r, id: r.id || newRow().id })) : [newRow()];

  // Local working copy — keeps focus stable, only saves debounced
  const [pName, setPName] = useState(saved?.pName || "");
  const [iName, setIName] = useState(saved?.iName || "");
  const [wName, setWName] = useState(saved?.wName || "");
  const [rName, setRName] = useState(saved?.rName || "");

  const [pRows, setPRows] = useState<Row[]>(makeRows(saved?.pRows));
  const [iRows, setIRows] = useState<Row[]>(makeRows(saved?.iRows));
  const [wRows, setWRows] = useState<Row[]>(makeRows(saved?.wRows));
  const [rRows, setRRows] = useState<Row[]>(makeRows(saved?.rRows));

  const summarize = (rows: Row[]) => rows.map((r) => r.col).filter(Boolean).join(", ");
  const pkOf = (rows: Row[]) => rows.find((r) => r.pk)?.col || "";

  // Keep top-level summaries updated so Review/PDF can use them immediately
  useEffect(() => {
    const aFields = summarize(pRows);
    const aPK = pkOf(pRows);
    const iFields = summarize(iRows);
    const wFields = summarize(wRows);
    const wPK = pkOf(wRows);
    const rFields = summarize(rRows);
    const rPK = pkOf(rRows);

    setSummaries.setAttendeeFields(aFields);
    setSummaries.setAttendeePK(aPK);
    setSummaries.setInstructorFields(iFields);
    setSummaries.setWorkshopFields(wFields);
    setSummaries.setWorkshopPK(wPK);
    setSummaries.setRegFields(rFields);
    setSummaries.setRegPK(rPK);

    // Debounced save
    const payload = {
      pName,
      iName,
      wName,
      rName,
      pRows,
      iRows,
      wRows,
      rRows,
      summaries: {
        attendeeFields: aFields,
        attendeePK: aPK,
        instructorFields: iFields,
        workshopFields: wFields,
        workshopPK: wPK,
        regFields: rFields,
        regPK: rPK,
      },
    };
    const t = setTimeout(() => saveTabData(tabKey, payload), 200);
    return () => {
      clearTimeout(t);
      // flush on unmount/tab switch
      saveTabData(tabKey, payload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pName, iName, wName, rName, pRows, iRows, wRows, rRows]);

  return (
    <Slide title="Database Design">
      <SectionCard title="Instructions">
        <div className="text-sm text-slate-800">
          <ol className="list-decimal list-inside space-y-1">
            <li>Add data entities and attributes for each table</li>
            <li>Assign a primary key to each table</li>
            <li>Add the links using FK (Foreign Keys)</li>
          </ol>
        </div>
      </SectionCard>

      <div className="grid md:grid-cols-2 gap-4">
        <TableCard title="Table 1" rows={pRows} setRows={setPRows} name={pName} setName={setPName} summarize={summarize} />
        <TableCard title="Table 2" rows={iRows} setRows={setIRows} name={iName} setName={setIName} summarize={summarize} />
        <TableCard title="Table 3" rows={wRows} setRows={setWRows} name={wName} setName={setWName} summarize={summarize} />
        <TableCard title="Table 4" rows={rRows} setRows={setRRows} name={rName} setName={setRName} summarize={summarize} />
      </div>
    </Slide>
  );
}

/** -----------------------------
 *  Tab 7 — M2M Redesign (5 tables)
 * ------------------------------*/
function M2MRedesign({
  saveTabData,
  loadTabData,
}: {
  saveTabData: (tabKey: keyof TabDataShape, data: any) => void;
  loadTabData: (tabKey: keyof TabDataShape) => any;
}) {
  const tabKey = "m2m_redesign";
  const defaultData = React.useMemo(
    () => ({
      tables: Array.from({ length: 5 }, () => ({
        name: "",
        rows: [newRow()],
      })),
    }),
    []
  );

  const saved = loadTabData(tabKey) || {};
  const initial = saved && Array.isArray(saved.tables)
    ? {
        tables: saved.tables.map((t: any) => ({
          name: t.name || "",
          rows: Array.isArray(t.rows) && t.rows.length ? t.rows.map((r: any) => ({ ...r, id: r.id || newRow().id })) : [newRow()],
        })),
      }
    : defaultData;

  // local working copy (focus-safe)
  const [data, setData] = React.useState<any>(initial);

  // debounce save + flush on unmount
  const saveTimer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      saveTabData(tabKey, data);
    }, 250);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTabData(tabKey, data);
    };
  }, [data]); // eslint-disable-line

  const updateTableName = (idx: number, name: string) => {
    setData((d: any) => ({
      ...d,
      tables: d.tables.map((t: any, i: number) => (i === idx ? { ...t, name } : t)),
    }));
  };
  const updateTableRows = (idx: number, rows: Row[]) => {
    setData((d: any) => ({
      ...d,
      tables: d.tables.map((t: any, i: number) => (i === idx ? { ...t, rows } : t)),
    }));
  };

  return (
    <Slide title="Many-to-Many Redesign" subtitle="Assume a workshop can have multiple instructors, and an instructor can teach multiple workshops. Redesign using a join table.">
      <SectionCard title="Tables">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.tables.map((table: any, index: number) => (
            <SimpleTableCard
              key={index}
              tableIndex={index}
              table={table}
              onChangeName={updateTableName}
              onChangeRows={updateTableRows}
            />
          ))}
        </div>
      </SectionCard>
    </Slide>
  );
}

/** -----------------------------
 *  Review (reads unified record)
 * ------------------------------*/
function Review({ record }: { record: any }) {
  const limitedCsv = useMemo(() => shortCsv(record.explore.csvPreview, 6, 6), [record.explore.csvPreview]);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <SectionCard title={title}>{children}</SectionCard>
  );

  const Table = ({ rows }: { rows: string[][] }) => (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            {(rows[0] || []).map((h, i) => (
              <th key={i} className="text-left px-2 py-1 border-b border-slate-200">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(1).map((row, i) => (
            <tr key={i}>
              {row.map((c, j) => (
                <td key={j} className="px-2 py-1 border-t border-slate-100 whitespace-nowrap">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const A = record.apply;
  const S = A.summaries || {};

  return (
    <Slide title="Review & Submit">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Welcome */}
        <Section title="Identity (Welcome)">
          <div className="text-slate-700">
            <div>
              <b>Name:</b> {record.meta.studentName || "—"}
            </div>
            <div>
              <b>Section:</b> {record.meta.classSection || "—"}
            </div>
            <div className="text-xs text-slate-500 mt-1">Date: {record.meta.today}</div>
          </div>
        </Section>

        {/* Explore */}
        <Section title="Explore (Preview)">
          {limitedCsv?.length ? <Table rows={limitedCsv} /> : <div className="text-sm text-slate-500">No data</div>}
          {record.explore.expNotes ? (
            <div className="mt-2 text-sm text-slate-700">
              <b>Notes:</b> {record.explore.expNotes}
            </div>
          ) : null}
        </Section>

        {/* Analyze */}
        <Section title="Analyze">
          <div className="grid grid-cols-2 gap-3 text-slate-700">
            <div className="rounded border border-slate-200 p-2">
              <div className="font-semibold mb-1">Workshops</div>
              <ul className="text-sm space-y-1">
                <li>Duplicate rows: <b>{record.analyze.workshops.dup ? "YES" : "NO"}</b></li>
                <li>Redundancy: <b>{record.analyze.workshops.red ? "YES" : "NO"}</b></li>
                <li>Inconsistencies: <b>{record.analyze.workshops.inc ? "YES" : "NO"}</b></li>
                <li>No IDs: <b>{record.analyze.workshops.id ? "YES" : "NO"}</b></li>
              </ul>
            </div>
            <div className="rounded border border-slate-200 p-2">
              <div className="font-semibold mb-1">Registrations</div>
              <ul className="text-sm space-y-1">
                <li>Duplicate rows: <b>{record.analyze.registrations.dup ? "YES" : "NO"}</b></li>
                <li>Redundancy: <b>{record.analyze.registrations.red ? "YES" : "NO"}</b></li>
                <li>Inconsistencies: <b>{record.analyze.registrations.inc ? "YES" : "NO"}</b></li>
                <li>No IDs: <b>{record.analyze.registrations.id ? "YES" : "NO"}</b></li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Propose */}
        <Section title="Propose (Selected)">
          {record.propose.solutions?.length ? (
            <ul className="list-disc list-inside text-slate-700">
              {record.propose.solutions.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-slate-500">—</div>
          )}
        </Section>

        {/* Apply */}
        <Section title="Apply (4 Tables)">
          <div className="space-y-3 text-slate-700">
            <div className="rounded border border-slate-200 p-2">
              <div>
                <b>{A.pName || "Table 1"}</b> • PK: <b>{S.attendeePK || "—"}</b>
              </div>
              {S.attendeeFields ? <div className="text-sm mt-1">Fields: {prettyCsv(S.attendeeFields)}</div> : null}
            </div>
            <div className="rounded border border-slate-200 p-2">
              <div>
                <b>{A.iName || "Table 2"}</b> • PK: <b>—</b>
              </div>
              {S.instructorFields ? <div className="text-sm mt-1">Fields: {prettyCsv(S.instructorFields)}</div> : null}
            </div>
            <div className="rounded border border-slate-200 p-2">
              <div>
                <b>{A.wName || "Table 3"}</b> • PK: <b>{S.workshopPK || "—"}</b>
              </div>
              {S.workshopFields ? <div className="text-sm mt-1">Fields: {prettyCsv(S.workshopFields)}</div> : null}
            </div>
            <div className="rounded border border-slate-200 p-2">
              <div>
                <b>{A.rName || "Table 4"}</b> • PK: <b>{S.regPK || "—"}</b>
              </div>
              {S.regFields ? <div className="text-sm mt-1">Fields: {prettyCsv(S.regFields)}</div> : null}
            </div>
          </div>
        </Section>

        {/* M2M */}
        <Section title="M2M Redesign (5 Tables)">
          {record.m2m.tables?.length ? (
            <div className="space-y-3">
              {record.m2m.tables.map((t: any, idx: number) => (
                <div key={idx} className="rounded border border-slate-200 p-2 text-slate-700">
                  <div className="mb-1">
                    <b>{t.name || `Table ${idx + 1}`}</b>
                  </div>
                  {t.rows?.length ? (
                    <div className="text-sm">
                      {t.rows.map((r: Row, i: number) => (
                        <div key={r.id || i}>
                          {r.col || "—"} {r.pk ? <span className="ml-2 text-slate-900 font-semibold">[PK]</span> : null}
                          {r.fk ? <span className="ml-2 text-slate-600 font-semibold">[FK]</span> : null}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">—</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500">—</div>
          )}
        </Section>

        {/* Raw */}
        <Section title="All Recorded Tab Data (raw)">
          <pre className="text-xs bg-slate-100 rounded p-2 overflow-x-auto" style={{ maxHeight: "320px" }}>
            {JSON.stringify(record.raw.tabData, null, 2)}
          </pre>
        </Section>
      </div>
    </Slide>
  );
}

/** -----------------------------
 *  Finish
 * ------------------------------*/
function ThankYou({ onDownload }: { onDownload: () => void }) {
  return (
    <Slide title="All set — nice work!">
      <SectionCard title="Download">
        <p className="text-slate-700">You can return to review or make changes anytime.</p>
        <button onClick={onDownload} className="px-4 py-2 rounded-md bg-black text-white">
          Download PDF
        </button>
      </SectionCard>
    </Slide>
  );
}

/** -----------------------------
 *  PDF (reads unified record) — reliable print & containers
 * ------------------------------*/
async function downloadSummary({ record, sessionSalt }: { record: any; sessionSalt: string }) {
  const w = safeOpenWindow("", "_blank");
  if (!w) return;

  const now = new Date().toLocaleString();
  const title = "MISY261: Business Information Systems";
  const subtitle = "Homework 1: Data Management and Data Modeling";
  const salt = String(sessionSalt || "");
  const device = (() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "unknown-tz";
      const lang = (navigator && (navigator as any).language) || "unknown-locale";
      const res =
        window && (window as any).screen ? `${window.screen.width}x${window.screen.height}@${(window.devicePixelRatio || 1)}` : "unknown-res";
      return `${lang}, ${tz}, ${res}`;
    } catch {
      return "unknown-device";
    }
  })();

  const verifySource = JSON.stringify({
    name: record.meta.studentName || "",
    section: record.meta.classSection || "",
    time: now,
    salt,
    answers: {
      analyze: record.analyze,
      propose: record.propose?.solutions || [],
      apply: {
        attendeePK: record.apply?.summaries?.attendeePK,
        workshopPK: record.apply?.summaries?.workshopPK,
        regPK: record.apply?.summaries?.regPK,
      },
      m2mCount: record.m2m?.tables?.length || 0,
    },
  });
  const docId = await sha256Hex(verifySource).then((h) => h.slice(0, 12)).catch(() => "n/a");
  const headerLine = `MISY261 — Homework 1 • ${escapeHtml(record.meta.studentName || "")} • ${escapeHtml(
    record.meta.classSection || "—"
  )} • ${escapeHtml(now)}`;

  // Build “Apply” and “M2M” HTML blocks
  const S = record.apply?.summaries || {};
  const applyList = [
    record.apply?.pName || "Table 1",
    record.apply?.iName || "Table 2",
    record.apply?.wName || "Table 3",
    record.apply?.rName || "Table 4",
  ];
  const applyFields = [S.attendeeFields, S.instructorFields, S.workshopFields, S.regFields];
  const applyPK = [S.attendeePK, "—", S.workshopPK, S.regPK];

  const applyHtml = applyList
    .map((nm: string, i: number) => {
      return `<li><b>${escapeHtml(nm)}</b> • PK: <b>${escapeHtml(applyPK[i] || "—")}</b> — ${
        applyFields[i] ? escapeCsv(applyFields[i]) : "—"
      }</li>`;
    })
    .join("");

  const m2mHtml = (record.m2m?.tables || [])
    .map(
      (t: any, idx: number) =>
        `<li><b>${escapeHtml(t.name || `Table ${idx + 1}`)}</b><br/>` +
        (t.rows?.length
          ? t.rows
              .map(
                (r: Row) =>
                  `${escapeHtml(r.col || "—")}${r.pk ? " <b>[PK]</b>" : ""}${r.fk ? " <b>[FK]</b>" : ""}`
              )
              .join(", ")
          : "—") +
        `</li>`
    )
    .join("");

  const analyzeHtml = `
    <ul>
      <li><b>Workshops</b> — Dup: <b>${record.analyze.workshops.dup ? "YES" : "NO"}</b>, Red: <b>${record.analyze.workshops.red ? "YES" : "NO"}</b>,
      Inc: <b>${record.analyze.workshops.inc ? "YES" : "NO"}</b>, No IDs: <b>${record.analyze.workshops.id ? "YES" : "NO"}</b></li>
      <li><b>Registrations</b> — Dup: <b>${record.analyze.registrations.dup ? "YES" : "NO"}</b>, Red: <b>${record.analyze.registrations.red ? "YES" : "NO"}</b>,
      Inc: <b>${record.analyze.registrations.inc ? "YES" : "NO"}</b>, No IDs: <b>${record.analyze.registrations.id ? "YES" : "NO"}</b></li>
    </ul>
  `;

  const proposeHtml =
    (record.propose?.solutions || []).length
      ? `<ul>${(record.propose.solutions as string[]).map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>`
      : "<ul><li>—</li></ul>";

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Homework 1 Summary</title>
    <style>
      @page { size: Letter; margin: 12mm; }
      body{font-family:ui-sans-serif,system-ui,sans-serif;margin:0;font-size:12px;color:#0f172a}
      h1{font-size:18px;margin:0 0 2px}
      h2{font-size:14px;margin:0 0 8px;color:#334155}
      .meta{font-size:11px;color:#475569;margin:2px 0 10px}
      .meta small{color:#64748b}
      .grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
      .card{border:1px solid #e2e8f0;border-radius:10px;padding:8px;background:#fff;break-inside:avoid;page-break-inside:avoid}
      .title{font-weight:600;margin:0 0 6px;font-size:12px}
      table{border-collapse:collapse;width:100%}
      td,th{border:1px solid #e5e7eb;padding:3px 4px;font-size:10px;white-space:nowrap}
      ul{margin:0;padding-left:16px}
      li{margin:0}
      .muted{color:#64748b}
      *{-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    </style>
  </head><body>
    <h1>${escapeHtml(title)}</h1>
    <h2>${escapeHtml(subtitle)}</h2>
    <div class="meta">${headerLine}<br/><small>Salt: ${escapeHtml(salt)} • Doc ID: ${escapeHtml(docId)} • Device: ${escapeHtml(device)}</small></div>
    <div class="grid">
      <div class="card">
        <div class="title">Identity (Welcome)</div>
        <ul>
          <li>Name: <b>${escapeHtml(record.meta.studentName || "—")}</b></li>
          <li>Section: <b>${escapeHtml(record.meta.classSection || "—")}</b></li>
          <li class="muted">Date: ${escapeHtml(record.meta.today || "")}</li>
        </ul>
      </div>

      <div class="card">
        <div class="title">Propose (Selected)</div>
        ${proposeHtml}
      </div>

      <div class="card">
        <div class="title">Analyze</div>
        ${analyzeHtml}
      </div>

      <div class="card">
        <div class="title">Apply (4 Tables)</div>
        <ul>${applyHtml || "<li>—</li>"}</ul>
      </div>

      <div class="card" style="grid-column:1 / -1;">
        <div class="title">M2M Redesign (5 Tables)</div>
        <ul>${m2mHtml || "<li>—</li>"}</ul>
      </div>
    </div>
    <script>window.focus && window.focus(); setTimeout(()=>window.print(), 150);</script>
  </body></html>`;

  w.document.open();
  w.document.write(html);
  w.document.close();
}