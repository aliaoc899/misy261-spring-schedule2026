import React from "react";

// -----------------------------
// Types
// -----------------------------
export type SlideDef = {
  key: string; // stable per slide
  title: string; // shown in tabs
  render: () => React.ReactNode; // called when slide active; use useBucket inside
};

export type ProgressInfo = { current: number; total: number; percent: number };

export type SlideAppProps = {
  title: string;
  subtitle?: string;
  course?: string;
  section?: string;
  date?: string;
  slides: SlideDef[];
  storageKey?: string; // localStorage key root
  identitySessionKey?: string; // optional sessionStorage key holding {firstName,lastName}
  progress?: (activeIndex: number, slides: SlideDef[]) => ProgressInfo;
  buildRecord?: (data: {
    meta: { title: string; course?: string; section?: string; date: string };
    buckets: Record<string, any>;
    order: string[];
  }) => any;
  onDownload?: (record: any) => void;
  onReset?: () => void; // optional hook for app-specific clearing (e.g., sessionStorage)
};

// -----------------------------
// Context for per-slide buckets
// -----------------------------
type SlideKitCtx = {
  slideKey: string;
  getBucket: (key: string) => any;
  setBucket: (key: string, value: any) => void;
  storageKey: string;
};

const SlideKitContext = React.createContext<SlideKitCtx | null>(null);

// -----------------------------
// Hook: useBucket — per-slide state with autosave + flush
// -----------------------------
export function useBucket<T extends Record<string, any>>(defaults: T) {
  const ctx = React.useContext(SlideKitContext);
  if (!ctx) throw new Error("useBucket must be used inside <SlideApp />");
  const { slideKey, getBucket, setBucket } = ctx;

  const initial = React.useMemo<T>(() => {
    const existing = getBucket(slideKey);
    return ({ ...(defaults as any), ...(existing || {}) }) as T;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideKey]);

  const [state, setState] = React.useState<T>(initial);

  // Debounced persist and flush-on-unmount
  const tRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    if (tRef.current) window.clearTimeout(tRef.current);
    tRef.current = window.setTimeout(() => setBucket(slideKey, { ...state, __updatedAt: Date.now() }), 250);
    return () => {
      if (tRef.current) window.clearTimeout(tRef.current);
      setBucket(slideKey, { ...state, __updatedAt: Date.now() });
    };
    // Persist when state changes meaningfully
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(state)]);

  return [state, setState] as const;
}

// -----------------------------
// UI Shell: Slide container + SectionCard
// -----------------------------
export function Slide({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 min-h-[60vh]">
      <h2 className="text-2xl font-extrabold text-slate-900 mb-4">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border border-slate-200 rounded-xl p-4 bg-white">
      <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

// -----------------------------
// SimpleTableCard (optional reusable UI)
// -----------------------------
export type Row = { id: string; col: string; pk: boolean; fk: boolean };

function newRow(): Row {
  const uid = (typeof crypto !== "undefined" && (crypto as any).randomUUID?.()) || Math.random().toString(36).slice(2);
  return { id: uid, col: "", pk: false, fk: false };
}

export const SimpleTableCard = React.memo(function SimpleTableCard({
  tableIndex,
  table,
  onChangeName,
  onChangeRows,
}: {
  tableIndex: number;
  table: { name: string; rows: Row[] };
  onChangeName: (idx: number, name: string) => void;
  onChangeRows: (idx: number, rows: Row[]) => void;
}) {
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
          <div key={row.id} className="grid grid-cols-[1fr_auto_auto] gap-2 items-center px-2 py-1 border-t border-slate-100">
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
        <div>Summary: {table.rows.map((r) => r.col).filter(Boolean).join(", ") || "—"}</div>
        <button type="button" onClick={() => onChangeRows(tableIndex, [...table.rows, newRow()])} className="px-2 py-1 rounded-md border text-xs">
          Add row
        </button>
      </div>
    </div>
  );
});

// -----------------------------
// SlideApp — reusable shell with tabs + progress + persistence
// -----------------------------
export function SlideApp({
  title,
  subtitle,
  course,
  section,
  date: dateProp,
  slides,
  storageKey: storageKeyProp,
  identitySessionKey,
  progress: progressFn,
  buildRecord: buildRecordFn,
  onDownload,
  onReset,
}: SlideAppProps) {
  const [active, setActive] = React.useState(0);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const tabsBarRef = React.useRef<HTMLDivElement>(null);

  // localStorage bucket storage
  const storageKey = storageKeyProp || `slidekit_${title.replace(/\s+/g, "_").toLowerCase()}`;
  const [buckets, setBuckets] = React.useState<Record<string, any>>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return (raw && JSON.parse(raw)) || {};
    } catch {
      return {};
    }
  });

  // Persist buckets (debounced)
  const saveRef = React.useRef<number | null>(null);
  const persist = React.useCallback(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(buckets));
    } catch {}
  }, [storageKey, buckets]);
  React.useEffect(() => {
    if (saveRef.current) window.clearTimeout(saveRef.current);
    saveRef.current = window.setTimeout(persist, 300);
    return () => {
      if (saveRef.current) window.clearTimeout(saveRef.current);
    };
  }, [persist]);

  const ctxValue = React.useMemo<SlideKitCtx>(
    () => ({
      slideKey: slides[active]?.key || "",
      getBucket: (k) => buckets[k],
      setBucket: (k, v) => setBuckets((prev) => ({ ...prev, [k]: v })),
      storageKey,
    }),
    [active, slides, buckets, storageKey]
  );

  // Progress
  const progress = React.useMemo<ProgressInfo>(() => {
    if (progressFn) return progressFn(active, slides);
    const current = Math.min(active + 1, Math.max(slides.length, 1));
    const total = Math.max(slides.length, 1);
    return { current, total, percent: Math.round((current / total) * 100) };
  }, [active, slides, progressFn]);

  const date = dateProp || new Date().toLocaleDateString();

  // Identity (optional) — read from sessionStorage key provided by host app
  const [identityName, setIdentityName] = React.useState<string>("");
  const refreshIdentity = React.useCallback(() => {
    if (!identitySessionKey) return setIdentityName("");
    try {
      const raw = sessionStorage.getItem(identitySessionKey);
      const obj = (raw && JSON.parse(raw)) || null;
      const name = [obj?.firstName, obj?.lastName].filter(Boolean).join(" ");
      setIdentityName(name || "");
    } catch {
      setIdentityName("");
    }
  }, [identitySessionKey]);
  React.useEffect(() => {
    refreshIdentity();
    const onFocus = () => refreshIdentity();
    const onCustom = () => refreshIdentity();
    window.addEventListener("focus", onFocus);
    window.addEventListener("identity-updated", onCustom as any);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("identity-updated", onCustom as any);
    };
  }, [refreshIdentity]);

  // Fullscreen controls
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };
  React.useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  // Tabs scroll into view for active
  React.useEffect(() => {
    const el = tabsBarRef.current;
    if (!el) return;
    const btn = el.querySelector(`button[data-tab="${active}"]`) as HTMLElement | null;
    btn?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  // Keyboard navigation
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(t?.tagName);
      if (isInput) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") setActive((v) => Math.max(0, v - 1));
      else if (["ArrowRight", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
        setActive((v) => Math.min(slides.length - 1, v + 1));
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slides.length]);

  // Build export record
  const buildRecord = React.useCallback(() => {
    const base = {
      meta: { title, course, section, date },
      buckets,
      order: slides.map((s) => s.key),
    };
    return buildRecordFn ? buildRecordFn(base) : base;
  }, [buckets, buildRecordFn, course, date, section, slides, title]);

  // Default download (HTML summary)
  const defaultDownload = React.useCallback(() => {
    const record = buildRecord();
    if (onDownload) return onDownload(record);
    const html = `<!doctype html><html><head><meta charset=\"utf-8\"/><title>${
      title || "SlideKit Export"
    }</title><style>body{font-family:ui-sans-serif,system-ui,Segoe UI,Roboto,Helvetica,Arial;line-height:1.5;padding:24px;color:#0f172a}h1{font-size:24px;margin:0 0 12px}h2{font-size:18px;margin:20px 0 8px}code,pre{background:#f1f5f9;border:1px solid #e2e8f0;border-radius:6px;padding:8px;display:block;white-space:pre-wrap;word-break:break-word}</style></head><body><h1>${
      title
    }</h1><div>${course || ""} ${section ? "• " + section : ""} • ${date}</div><h2>Record</h2><pre>${
      escapeHtml(JSON.stringify(record, null, 2))
    }</pre></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, "_blank");
    if (!w) {
      // Fallback: create a temporary link
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.replace(/\s+/g, "_")}_export.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [buildRecord, course, date, onDownload, section, title]);

  // Reset: clear buckets + localStorage for this app and optionally call hook
  const handleReset = React.useCallback(() => {
    const ok = window.confirm("Reset this presentation? All saved inputs for this deck will be cleared.");
    if (!ok) return;
    try { localStorage.removeItem(storageKey); } catch {}
    setBuckets({});
    setActive(0);
    try { onReset?.(); } catch {}
    // Full reset of in-memory state
    try { window.location.reload(); } catch {}
  }, [storageKey, onReset]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            {course ? <div className="text-sm text-slate-700 font-semibold">{course}</div> : null}
            <div className="text-slate-900 font-bold truncate">{title}</div>
            {subtitle ? <div className="text-slate-500 text-sm truncate">{subtitle}</div> : null}
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40">
              <div className="text-xs text-slate-500 mb-1">Slide {progress.current} of {progress.total}</div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${progress.percent}%` }} />
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors"
              title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" /></svg>
              )}
            </button>
            {null}
          </div>
        </div>
      </header>

      {/* Tabs - hide when there's only one slide */}
      {slides.length > 1 && (
        <nav className="sticky top-[90px] z-10 bg-slate-50/95 backdrop-blur border-b border-slate-100 py-3">
          <div ref={tabsBarRef} className="max-w-6xl mx-auto px-4 overflow-x-auto">
            <div className="flex gap-2">
              {slides.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.key}
                    data-tab={i}
                    onClick={() => setActive(i)}
                    className={`shrink-0 inline-flex items-center gap-3 rounded-full border transition-all px-[0.8rem] py-[0.4rem] text-[0.84rem] min-w-[11.2rem] sm:min-w-[14.4rem] justify-start ${
                      isActive
                        ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                        : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    <span className={`inline-block w-3 h-3 rounded-full ${isActive ? "bg-white/90" : "bg-slate-300"}`} />
                    <span className="font-medium">{s.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main */}
      <main className={`max-w-5xl mx-auto px-4 py-8 ${slides.length > 1 ? 'pb-24' : 'pb-8'}`}>
        <SlideKitContext.Provider value={ctxValue}>{slides[active]?.render()}</SlideKitContext.Provider>
      </main>

      {/* Footer - hide when there's only one slide */}
      {slides.length > 1 && (
        <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 rounded-full border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm"
                title="Clear all saved inputs and restart"
              >
                Reset
              </button>
              <div className="text-xs text-slate-500">Use ← → arrow keys • Space for next • F for fullscreen</div>
            </div>
            <div className="flex-1 text-center text-sm text-slate-700 font-medium truncate">
              {slides[active]?.title}
              {identityName ? ` • ${identityName}` : ""}
              {` • ${date}`}
            </div>
            <div className="flex items-center gap-2">
              <button
                aria-label="Previous slide"
                title="Previous (←)"
                className="p-2 rounded-full bg-slate-900 text-white disabled:opacity-50 hover:bg-slate-800 transition-colors"
                onClick={() => setActive((v) => Math.max(0, v - 1))}
                disabled={active === 0}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                aria-label="Next slide"
                title="Next (→ or Space)"
                className="p-2 rounded-full bg-slate-900 text-white disabled:opacity-50 hover:bg-slate-800 transition-colors"
                onClick={() => setActive((v) => Math.min(slides.length - 1, v + 1))}
                disabled={active === slides.length - 1}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

// -----------------------------
// Helpers
// -----------------------------
function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => (({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" } as any)[c] || c));
}
