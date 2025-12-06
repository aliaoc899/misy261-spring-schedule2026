import React from "react";
import { SlideApp, Slide, SectionCard, useBucket, SimpleTableCard, Row } from "./lib/slidekit.tsx";

// Function to download table as PDF
const downloadTableAsPDF = () => {
  // Create a new window with the table content for printing
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  // Table data matching the exact content from the actual table
  const tableRows = [
    ["Session", "Date", "Day", "Topic", "Presentation Link", "YouTube Link", "Homework"],
    ["1", "27-Aug", "Wed", "Syllabus Review", `<a href="./Syllabus- MISY 261-Fall 2025.pdf" target="_blank">Syllabus</a>`, "-", "-"],
    ["2", "29-Aug", "Fri", "Business Processes - ERP", "-", "-", "-"],
    ["-", "-", "Monday", "Labor Day Holiday", "-", "-", "-"],
    ["3", "3-Sep", "Wed", "Introduction to Database", `<a href="https://claude.ai/public/artifacts/d6a280f3-a186-4add-8b6e-b90b9abc6d1e" target="_blank">Link</a>`, "-", "-"],
    ["4", "5-Sep", "Fri", "Introduction to Database: Table Design, Primary Keys, Data Types", `<a href="https://aliaoc899.github.io/Session-3-Slides/" target="_blank">Link</a>`, `<a href="https://youtu.be/7vJvlM04ScI" target="_blank">Video</a>`, "-"],
    ["5", "8-Sep", "Mon", "Introduction to Database: Table Design, Primary Keys, Data Types", `<a href="https://aliaoc899.github.io/misy261-Day-5/" target="_blank">Link</a>`, `<a href="https://youtu.be/G7hXF8hZJxM" target="_blank">Video</a>`, "-"],
    ["6", "10-Sep", "Wed", "Introduction to Database: Table Design, Primary Keys, Data Types", `<a href="https://aliaoc899.github.io/misy261-Day-5/" target="_blank">Link</a>`, `<a href="https://youtu.be/K-14u7X4AMo" target="_blank">Video</a>`, `<a href="https://aliaoc899.github.io/homework-v3" target="_blank">Homework 1</a>`],
    ["7", "12-Sep", "Fri", "Access - Part 1: Introduction to Database and Query Design", `<a href="https://aliaoc899.github.io/misy261-Day-7" target="_blank">Link</a>`, `<a href="https://youtu.be/bSbinHpCIHM" target="_blank">Video</a>`, "-"],
    ["8", "15-Sep", "Mon", "Access - Part 1: Introduction to Database and Query Design", `<a href="https://aliaoc899.github.io/misy261-Day-7" target="_blank">Link</a>`, `<a href="https://youtu.be/awnMaYoFPaY" target="_blank">Video</a>`, "-"],
    ["9", "17-Sep", "Wed", "Access - Part 2: Criteria, Filtering the Query Results", `<a href="https://aliaoc899.github.io/https-aliaoc899.github.io-misy261-Access-Part2" target="_blank">Link</a>`, `<a href="https://youtu.be/h8TZhnvtVJI" target="_blank">Video</a>`, "-"],
    ["10", "19-Sep", "Fri", "Access - Part 2: Criteria, Filtering the Query Results", `<a href="https://aliaoc899.github.io/https-aliaoc899.github.io-misy261-Access-Part2-2/" target="_blank">Link</a>`, `<a href="https://youtu.be/yDeOE5cTvKk" target="_blank">Video</a>`, `<a href="https://aliaoc899.github.io/misy261-Day-10-practice" target="_blank">Homework 2</a>`],
    ["11", "22-Sep", "Mon", "Access: Create Calculated Fields and Extract From Date Field, Format Function", `<a href="https://aliaoc899.github.io/misy261-Day-10-CreateCalculatedFields/" target="_blank">Slides</a>`, `<a href="https://www.youtube.com/watch?v=SGu63RWrQu0" target="_blank">Video</a>`, "-"],
    ["12", "24-Sep", "Wed", "Access: Total Queries (Sum, Count, Average)", `<a href="https://aliaoc899.github.io/misy261-Day-12-TotalQueries/" target="_blank">Slides</a>`, `<a href="https://www.youtube.com/watch?v=wS2nSuQKSLo" target="_blank">Video</a>`, "-"],
    ["13", "26-Sep", "Fri", "Access: Total Queries (Sum, Count, Average)", `<a href="https://aliaoc899.github.io/misy261-Day-12-TotalQueries/" target="_blank">Slides</a>`, `<a href="https://www.youtube.com/watch?v=P0BhynX-W8A" target="_blank">Video</a>`, "Homework 3"],
    ["14", "29-Sep", "Mon", "Access: Practice Lab - Melbourne Housing", "-", `<a href="https://www.youtube.com/watch?v=Qvu7gtRqn38" target="_blank">Video</a>`, "-"],
    ["15", "1-Oct", "Wed", "Access: Practice Lab - Melbourne Housing", "-", "-", "-"],
    ["16", "3-Oct", "Fri", "Access: Practice Lab - Midterm Review - Travel Light", "-", `<a href="https://www.youtube.com/watch?v=oNr2pA9OuMs" target="_blank">Video</a>`, "-"],
    ["17", "6-Oct", "Mon", "Midterm Exam 1: Access Query Design", "-", "-", "-"],
    ["18", "8-Oct", "Wed", "Tableau - App Instalation and Product Key Instructions", "-", "-", "-"],
    ["19", "10-Oct", "Fri", "Blue Hen Re-Coop Day; Classes Suspended", "-", "-", "-"],
  ["20", "13-Oct", "Mon", "Introduction to Data Visualization in Tableau : Bar/Pie/Map/Treemaps", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary-part2.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/GcdvaVvncWA" target="_blank">Video</a>`, "-"],
    ["21", "15-Oct", "Wed", "Tableau: Dual Axis, Line, Bubble Charts", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/-Un07YuUjfw" target="_blank">Video</a>`, "-"],
  ["22", "17-Oct", "Fri", "Tableau: Chart Design and Dashboard Design", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary-part2.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/TCpvFJxU_yA" target="_blank">Video</a>`, "Homework 4"],
    ["23", "20-Oct", "Mon", "Tableau: Calculated Fields, Parameters & Filters", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary-part3.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/Fgb4Fdci0-8" target="_blank">Video</a>`, "-"],
    ["24", "22-Oct", "Wed", "Tableau: Calculated Fields, Reference Lines", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary-part3.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/CazgJFFRyIU" target="_blank">Video</a>`, "-"],
    ["25", "24-Oct", "Fri", "Tableau: Dashboard Design", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/hotel-management-dashboard.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/naS5VKVtz_I" target="_blank">Video</a>`, "Homework 5"],
    ["26", "27-Oct", "Mon", "Tableau: Dashboard Design", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/hotel-management-dashboard.html" target="_blank">Slides</a>`, "-", "-"],
    ["27", "29-Oct", "Wed", "Excel: Data Cleaning", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/data-cleaning-lookup-practice.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/X5Y7AZ-cMws" target="_blank">Video</a>`, "-"],
    ["28", "31-Oct", "Fri", "Excel: Data Cleaning", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/hospital-admissions-practice.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/qHqxfRbOUrA" target="_blank">Video</a>`, "-"],
    ["29", "3-Nov", "Mon", "Data Cleaning and Preparation", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/hospital-admissions-practice.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/ihf17HrgI-4" target="_blank">Video</a>`, "-"],
    ["30", "5-Nov", "Wed", "Excel: Pivot Tables", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/hospital-admissions-pivot.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/JySnGxFNkAo" target="_blank">Video</a>`, "-"],
    ["31", "7-Nov", "Fri", "Homework 6 - Data Cleaning", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/housing-prices-practice.html" target="_blank">Slides</a>`, "-", "-"],
    ["32", "10-Nov", "Mon", "Excel: Data Analytics", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/bird-strikes-practice.html" target="_blank">Slides</a>`, `<a href="https://youtu.be/NAoGKEnF1xw" target="_blank">Video</a>`, "-"],
    ["33", "12-Nov", "Wed", "Tableau & Excel: Exam Review 1", "-", `<a href="https://youtu.be/JLSQ5G06ZME" target="_blank">Video</a>`, "-"],
    ["34", "14-Nov", "Fri", "Tableau & Excel: Exam Review 1", `<a href="https://aliaoc899.github.io/presentationTemplate-V2/hospital-admissions-tableau-practice.html" target="_blank">Slides</a>`, "-", "-"],
    ["35", "17-Nov", "Mon", "Midterm Exam 2: Tableau & Excel Data Analytics", "-", "-", "-"],
    ["36", "19-Nov", "Wed", "Final Project", "-", "-", "-"],
    ["37", "21-Nov", "Fri", "Final Project", "-", "-", "-"],
    ["-", "-", "Mon", "Fall Break", "-", "-", "-"],
    ["-", "-", "Wed", "Fall Break", "-", "-", "-"],
    ["-", "-", "Fri", "Fall Break", "-", "-", "-"],
    ["38", "1-Dec", "Mon", "Final Project", "-", "-", "-"],
    ["39", "3-Dec", "Wed", "Final Project", "-", "-", "-"],
    ["40", "5-Dec", "Fri", "Final Project", "-", "-", "-"],
    ["41", "8-Dec", "Mon", "Final Project", "-", "-", "-"]
  ];

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>MISY261 Course Schedule</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #047857; text-align: center; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ccc; padding: 8px; text-align: left; font-size: 12px; }
        th { background-color: #f1f5f9; font-weight: bold; text-align: center; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .week-col, .date-col, .day-col { text-align: center; }
        .topic-col { text-align: left; max-width: 300px; }
        a { color: #2563eb; text-decoration: underline; }
        a:hover { color: #1d4ed8; }
        @media print {
          body { margin: 0; }
          table { page-break-inside: auto; font-size: 10px; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          a { color: #2563eb !important; }
          th, td { padding: 4px; }
        }
      </style>
    </head>
    <body>
      <h1>MISY261 - Fall 2025<br>Business Information Systems</h1>
      <table>
        <thead>
          <tr>
            ${tableRows[0].map((header, index) => 
              `<th class="${index === 3 ? 'topic-col' : ''}">${header}</th>`
            ).join('')}
          </tr>
        </thead>
        <tbody>
          ${tableRows.slice(1).map(row => 
            `<tr>${row.map((cell, index) => {
              let className = '';
              if (index === 0) className = 'week-col';
              else if (index === 1) className = 'date-col';
              else if (index === 2) className = 'day-col';
              else if (index === 3) className = 'topic-col';
              return `<td class="${className}">${cell}</td>`;
            }).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

// Shared constants for the deck
const COURSE = "MISY261";
const TITLE = "MISY261: Business Information Systems";
const SUBTITLE = "";

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

// Helper function to determine row styling and icon based on topic
const getRowStyling = (topic: string) => {
  const topicLower = topic.toLowerCase();
  
  // Exam rows - Yellow background
  if (topicLower.includes('exam') || topicLower.includes('midterm')) {
    return { bg: 'bg-yellow-50', icon: '📝', type: 'exam' };
  }
  
  // Homework rows - Light purple background
  if (topicLower.includes('homework')) {
    return { bg: 'bg-purple-50', icon: '📝', type: 'homework' };
  }
  
  // Review sessions - Light amber background
  if (topicLower.includes('review')) {
    return { bg: 'bg-amber-50', icon: '🔍', type: 'review' };
  }
  
  // Practice/Lab sessions - Light green background
  if (topicLower.includes('practice') || topicLower.includes('lab')) {
    return { bg: 'bg-green-50', icon: '🧪', type: 'practice' };
  }
  
  // Tableau sessions - Light blue background
  if (topicLower.includes('tableau')) {
    return { bg: 'bg-blue-50', icon: '📊', type: 'tableau' };
  }
  
  // Excel sessions - Light teal background
  if (topicLower.includes('excel') || topicLower.includes('pivot')) {
    return { bg: 'bg-teal-50', icon: '📈', type: 'excel' };
  }
  
  // Access sessions - Light pink background
  if (topicLower.includes('access')) {
    return { bg: 'bg-pink-50', icon: '🗄️', type: 'access' };
  }
  
  // Database sessions - Light indigo background
  if (topicLower.includes('database')) {
    return { bg: 'bg-indigo-50', icon: '🗃️', type: 'database' };
  }
  
  // Holiday/Break rows - Light gray background
  if (topicLower.includes('holiday') || topicLower.includes('break') || topicLower.includes('suspended')) {
    return { bg: 'bg-slate-100', icon: '🏖️', type: 'break' };
  }
  
  // Default lecture sessions - White background
  return { bg: '', icon: '📚', type: 'lecture' };
};

export default function ExampleApp() {
  // Font size control state
  const [fontSize, setFontSize] = React.useState<'small' | 'medium' | 'large'>('medium');

  const fontSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  // Centered Title Slide (hero style)
  const TitleSlide = () => (
    <div className="py-8">
      <div className="text-center mb-8">
        <div className="text-2xl uppercase tracking-widest text-emerald-700 font-semibold">MISY261 - Fall 2025</div>
        <h1 className="mt-2 text-4xl font-extrabold text-slate-900">Business Information Systems</h1>
        <div className="mt-4">
          <a href="https://lerner.udel.edu/faculty-staff-directory/ali-simaei" 
             className="text-blue-600 hover:text-blue-800 underline text-lg font-medium" 
             target="_blank" rel="noopener noreferrer"
             aria-label="View instructor profile for Ali Simaei">
            Instructor Profile
          </a>
        </div>
        <div className="mt-6 mx-auto h-1 w-36 bg-emerald-700 rounded-full" />
      </div>
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h2 className="text-sm font-medium text-slate-600 uppercase tracking-wide mb-2">Course Schedule</h2>
            {/* Color Legend */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1 px-2 py-1 bg-indigo-50 rounded border border-indigo-200">
                <span>🗃️</span>
                <span>Database</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-pink-50 rounded border border-pink-200">
                <span>🗄️</span>
                <span>Access</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 rounded border border-blue-200">
                <span>📊</span>
                <span>Tableau</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-teal-50 rounded border border-teal-200">
                <span>📈</span>
                <span>Excel</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-green-50 rounded border border-green-200">
                <span>🧪</span>
                <span>Practice</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded border border-amber-200">
                <span>🔍</span>
                <span>Review</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded border border-yellow-200">
                <span>📝</span>
                <span>Exam</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-50 rounded border border-purple-200">
                <span>📝</span>
                <span>Homework</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Font Size Controls */}
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5" role="group" aria-label="Font size controls">
              <span className="text-xs text-slate-600 font-medium">Font:</span>
              <button 
                onClick={() => setFontSize('small')}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${fontSize === 'small' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
                aria-label="Small font size"
                aria-pressed={fontSize === 'small'}
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('medium')}
                className={`px-2 py-1 rounded text-sm font-medium transition-colors ${fontSize === 'medium' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
                aria-label="Medium font size"
                aria-pressed={fontSize === 'medium'}
              >
                A
              </button>
              <button 
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 rounded text-base font-medium transition-colors ${fontSize === 'large' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'}`}
                aria-label="Large font size"
                aria-pressed={fontSize === 'large'}
              >
                A
              </button>
            </div>

            <button 
              onClick={downloadTableAsPDF}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2"
              aria-label="Download course schedule as PDF"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className={`w-full border-collapse border border-slate-300 ${fontSizeClasses[fontSize]}`} role="table" aria-label="MISY261 course schedule with sessions, dates, topics, and resources">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold" scope="col">Session</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold" scope="col">Date</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold" scope="col">Day</th>
                <th className="border border-slate-300 px-4 py-2 text-center font-semibold" scope="col">Topic</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold" scope="col">Presentation Link</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold" scope="col">YouTube Link</th>
                <th className="border border-slate-300 px-3 py-2 text-center font-semibold" scope="col">Homework</th>
              </tr>
            </thead>
            <tbody>
              <tr tabIndex={0} role="row" className="focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">1</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">27-Aug</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">Syllabus Review</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="./Syllabus- MISY 261-Fall 2025.pdf" 
                     className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1" 
                     target="_blank" rel="noopener noreferrer"
                     download
                     aria-label="Download syllabus PDF for session 1">
                    Syllabus
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No video available">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">2</td>
                <td className="border border-slate-300 px-3 py-2 text-center">29-Aug</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Business Processes - ERP</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">3</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">3-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗃️ Introduction to Database</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="https://claude.ai/public/artifacts/d6a280f3-a186-4add-8b6e-b90b9abc6d1e" 
                     className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1" 
                     target="_blank" rel="noopener noreferrer"
                     aria-label="View presentation for session 3: Introduction to Database">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No video available">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">4</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">5-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗃️ Introduction to Database: Table Design, Primary Keys, Data Types</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="https://aliaoc899.github.io/Session-3-Slides/" 
                     className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1" 
                     target="_blank" rel="noopener noreferrer"
                     aria-label="View presentation slides for session 4: Introduction to Database">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="https://youtu.be/7vJvlM04ScI" 
                     className="text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1" 
                     target="_blank" rel="noopener noreferrer"
                     aria-label="Watch YouTube video for session 4: Introduction to Database">
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">5</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">8-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗃️ Introduction to Database: Table Design, Primary Keys, Data Types</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">6</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">10-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗃️ Introduction to Database: Table Design, Primary Keys, Data Types</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="https://aliaoc899.github.io/misy261-Day-5/" 
                     className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1" 
                     target="_blank" rel="noopener noreferrer"
                     aria-label="View presentation slides for session 6">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="https://youtu.be/K-14u7X4AMo" 
                     className="text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1" 
                     target="_blank" rel="noopener noreferrer"
                     aria-label="Watch YouTube video for session 6">
                    🎥 Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="https://aliaoc899.github.io/homework-v3" 
                     className="text-purple-600 hover:text-purple-800 underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-1 font-medium" 
                     target="_blank" rel="noopener noreferrer"
                     aria-label="View Homework 1 assignment">
                    📝 Homework 1
                  </a>
                </td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">7</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">12-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access - Part 1: Introduction to Database and Query Design</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="https://aliaoc899.github.io/misy261-Day-7" 
                     className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1" 
                     target="_blank" rel="noopener noreferrer"
                     aria-label="View presentation for session 7: Access Part 1">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a href="https://youtu.be/bSbinHpCIHM" 
                     className="text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1" 
                     target="_blank" rel="noopener noreferrer"
                     aria-label="Watch YouTube video for session 7">
                    🎥 Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">8</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">15-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access - Part 1: Introduction to Database and Query Design</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">9</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">17-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access - Part 2: Criteria, Filtering the Query Results</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">10</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">19-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access - Part 2: Criteria, Filtering the Query Results</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://aliaoc899.github.io/https-aliaoc899.github.io-misy261-Access-Part2-2/" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Link
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://youtu.be/yDeOE5cTvKk" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a href="https://aliaoc899.github.io/misy261-Day-10-practice" 
                     className="text-blue-600 hover:text-blue-800 underline text-sm" 
                     target="_blank" rel="noopener noreferrer">
                    Homework 2
                  </a>
                </td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">11</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">22-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access: Create Calculated Fields and Extract From Date Field, Format Function</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/misy261-Day-10-CreateCalculatedFields/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://www.youtube.com/watch?v=SGu63RWrQu0" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">12</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">24-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access: Total Queries</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/misy261-Day-12-TotalQueries/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://www.youtube.com/watch?v=wS2nSuQKSLo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">13</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">26-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access: Total Queries</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/misy261-Day-12-TotalQueries/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://www.youtube.com/watch?v=P0BhynX-W8A" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">Homework 3</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-green-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">14</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">29-Sep</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🧪 Access: Practice Lab - Melbourne Housing</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No slides available">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a 
                    href="https://www.youtube.com/watch?v=Qvu7gtRqn38" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1"
                    aria-label="Watch YouTube video for session 14: Practice Lab">
                    🎥 Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">15</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">1-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access: Practice Lab - Melbourne Housing</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-pink-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">16</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">3-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🗄️ Access: Practice Lab - Midterm Review - Travel Light</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://www.youtube.com/watch?v=oNr2pA9OuMs" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">17</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">6-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold" role="cell">📝 Midterm Exam 1: Access Query Design</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No slides available">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No video available">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">18</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">8-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📊 Tableau - App Instalation and Product Key Instructions</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">20</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">13-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📊 Introduction to Data Visualization in Tableau : Bar/Pie/Map/Treemaps</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary-part2.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    aria-label="View presentation slides for session 20: Tableau Data Visualization"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a 
                    href="https://youtu.be/GcdvaVvncWA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1"
                    aria-label="Watch YouTube video for session 20"
                  >
                    🎥 Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">21</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">15-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📊 Tableau: Dual Axis, Line, Bubble Charts</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/-Un07YuUjfw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">22</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">17-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📊 Tableau: Chart Design and Dashboard Design</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary-part2.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/TCpvFJxU_yA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">Homework 4</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">23</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">20-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📊 Tableau: Calculated Fields, Parameters & Filters</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary-part3.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/Fgb4Fdci0-8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">24</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">22-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📊 Tableau: Calculated Fields, Reference Lines</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/tableau-master-summary-part3.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/CazgJFFRyIU" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">25</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">24-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📊 Tableau: Dashboard Design</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/hotel-management-dashboard.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/naS5VKVtz_I" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">Homework 5</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-blue-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">26</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">27-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📊 Tableau: Dashboard Design</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/hotel-management-dashboard.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-teal-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">27</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">29-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📈 Excel: Data Cleaning</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/data-cleaning-lookup-practice.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/X5Y7AZ-cMws" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-teal-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">28</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">31-Oct</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📈 Excel: Data Cleaning</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/hospital-admissions-practice.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/qHqxfRbOUrA" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-teal-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">29</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">3-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📈 Data Cleaning and Preparation</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/hospital-admissions-practice.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/ihf17HrgI-4" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-teal-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">30</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">5-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📈 Excel: Pivot Tables</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/hospital-admissions-pivot.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    aria-label="View presentation slides for session 30: Excel Pivot Tables"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a 
                    href="https://youtu.be/JySnGxFNkAo" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1"
                    aria-label="Watch YouTube video for session 30"
                  >
                    🎥 Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-purple-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">31</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">7-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Fri</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📝 Homework 6 - Data Cleaning</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/housing-prices-practice.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    aria-label="View presentation slides for Homework 6"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No video available">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-teal-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">32</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">10-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Mon</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">📈 Excel: Data Analytics</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/bird-strikes-practice.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    aria-label="View presentation slides for session 32: Excel Data Analytics"
                  >
                    Slides
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">
                  <a 
                    href="https://youtu.be/NAoGKEnF1xw" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1"
                    aria-label="Watch YouTube video for session 32"
                  >
                    🎥 Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No homework assigned">-</td>
              </tr>
              <tr tabIndex={0} role="row" className="bg-amber-50 focus:outline-none focus:ring-2 focus:ring-emerald-500">
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">33</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">12-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell">Wed</td>
                <td className="border border-slate-300 px-4 py-2" role="cell">🔍 Tableau & Excel: Exam Review 1</td>
                <td className="border border-slate-300 px-3 py-2 text-center" role="cell" aria-label="No slides available">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://youtu.be/JLSQ5G06ZME" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-800 underline"
                  >
                    Video
                  </a>
                </td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">34</td>
                <td className="border border-slate-300 px-3 py-2 text-center">14-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2">Tableau & Excel: Exam Review 1</td>
                <td className="border border-slate-300 px-3 py-2 text-center">
                  <a 
                    href="https://aliaoc899.github.io/presentationTemplate-V2/hospital-admissions-tableau-practice.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Slides
                  </a>
                </td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">36</td>
                <td className="border border-slate-300 px-3 py-2 text-center">19-Nov</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Fall Break</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Fri</td>
                <td className="border border-slate-300 px-4 py-2 font-semibold">Fall Break</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">39</td>
                <td className="border border-slate-300 px-3 py-2 text-center">3-Dec</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Wed</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
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
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
              </tr>
              <tr>
                <td className="border border-slate-300 px-3 py-2 text-center">41</td>
                <td className="border border-slate-300 px-3 py-2 text-center">8-Dec</td>
                <td className="border border-slate-300 px-3 py-2 text-center">Mon</td>
                <td className="border border-slate-300 px-4 py-2">Final Project</td>
                <td className="border border-slate-300 px-3 py-2 text-center">-</td>
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
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-5xl mx-auto px-4 py-8">
        <TitleSlide />
      </main>
    </div>
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
