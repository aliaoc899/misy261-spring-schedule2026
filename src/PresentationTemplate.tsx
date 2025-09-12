import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/** -----------------------------
 *  PRESENTATION TEMPLATE
 *  Reusable template for creating interactive presentations
 *  
 *  TO CUSTOMIZE:
 *  1. Update presentationConfig below
 *  2. Replace slide components with your content
 *  3. Modify slides array with your slide structure
 * ------------------------------*/

// Configuration - UPDATE THIS FOR EACH PRESENTATION
const presentationConfig = {
  title: "Presentation Title",
  subtitle: "Add your subtitle", 
  author: "Presenter Name",
  course: "COURSE",
  section: "Section (Optional)",
  theme: {
    primary: "blue", // blue, green, purple, red, etc.
    accent: "slate"
  }
};

// Slide Props Type
type SlideProps = {
  title: string;
  children: React.ReactNode;
};

// Presentation Data Type
type PresentationData = {
  title: string;
  subtitle: string;
  author: string;
  date: string;
  course: string;
  section?: string;
};

/** -----------------------------
 *  Reusable Slide Component
 * ------------------------------*/
const Slide = ({ title, children }: SlideProps) => {
  const primaryColor = `${presentationConfig.theme.primary}-700`;
  
  return (
    <div className="slide-content min-h-[60vh] flex flex-col">
      <h2 className={`text-2xl font-bold mb-6 text-${primaryColor}`}>{title}</h2>
      <div className="flex-1">{children}</div>
    </div>
  );
};

/** -----------------------------
 *  SLIDE TEMPLATES - CUSTOMIZE THESE
 * ------------------------------*/

// Title Slide Template
const TitleSlide = ({ data }: { data: PresentationData }) => {
  const primaryColor = `${presentationConfig.theme.primary}-700`;
  const primaryBg = `${presentationConfig.theme.primary}-600`;
  
  return (
    <div className="text-center py-16 max-w-4xl mx-auto">
      <div className={`text-sm uppercase tracking-widest text-${primaryColor} font-semibold mb-4`}>
        {data.course}
      </div>
      <h1 className="text-5xl font-extrabold mb-4 text-slate-900">{data.title}</h1>
      <div className="text-slate-600 text-xl mb-8">{data.subtitle}</div>
      <div className={`mx-auto w-32 h-2 bg-${primaryBg} rounded-full mb-8`} />
      <div className="text-slate-700">
        <div className="text-lg font-medium">{data.author}</div>
        {data.section && <div className="text-md">Section: {data.section}</div>}
        <div className="text-md">{data.date}</div>
      </div>
      <div className={`mt-8 bg-${presentationConfig.theme.primary}-50 rounded-xl p-6`}>
        <h3 className="text-lg font-semibold mb-3">Overview</h3>
        <p className="text-slate-600">
          {/* CUSTOMIZE: Add your presentation overview here */}
          Add your presentation overview and learning objectives here.
        </p>
      </div>
    </div>
  );
};

// Content Slide Template - CUSTOMIZE
const ExampleContentSlide = () => (
  <Slide title="Content Slide Example">
    <div className="text-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-slate-700">Replace this with your content</h3>
      <p className="text-slate-500">
        This is a placeholder slide. Create your own slide components and replace this.
      </p>
    </div>
  </Slide>
);

// Placeholder Slide Template - CUSTOMIZE
const PlaceholderSlide = () => (
  <Slide title="Add Your Content">
    <div className="text-center p-8 bg-white rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-semibold mb-4 text-slate-700">Customize this slide</h3>
      <p className="text-slate-500">
        Replace with your slide content and functionality.
      </p>
    </div>
  </Slide>
);

// Summary Slide with Download - CUSTOMIZE
const SummarySlide = () => {
  const downloadContent = () => {
    // CUSTOMIZE: Add your PDF content here
    alert("Add your PDF download content in the downloadContent function!");
  };

  return (
    <Slide title="Summary & Completion 🎉">
      <div className="text-center py-8">
        <div className="bg-green-50 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-green-800 mb-4">Presentation Complete!</h3>
          <p className="text-green-700 text-lg mb-6">
            {/* CUSTOMIZE: Update completion message */}
            Add your completion message here.
          </p>
          <button
            onClick={downloadContent}
            className={`inline-flex items-center gap-2 px-6 py-3 bg-${presentationConfig.theme.primary}-600 hover:bg-${presentationConfig.theme.primary}-700 text-white font-semibold rounded-lg transition-colors shadow-sm`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Summary
          </button>
        </div>
        
        {/* CUSTOMIZE: Add your accomplishment cards */}
        <div className="bg-slate-50 rounded-xl p-6">
          <p className="text-slate-600">
            Add your summary content and accomplishments here.
          </p>
        </div>
      </div>
    </Slide>
  );
};

/** -----------------------------
 *  Main Presentation Component
 * ------------------------------*/
export default function PresentationTemplate() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [presentationData] = useState<PresentationData>({
    title: presentationConfig.title,
    subtitle: presentationConfig.subtitle,
    author: presentationConfig.author,
    date: new Date().toLocaleDateString(),
    course: presentationConfig.course,
    section: presentationConfig.section
  });

  const tabsBarRef = useRef<HTMLDivElement>(null);

  // CUSTOMIZE: Define your slides here - replace with your content
  const slides = useMemo(() => [
    { title: "Introduction", component: <TitleSlide data={presentationData} /> },
    { title: "Content", component: <ExampleContentSlide /> },
    { title: "More Content", component: <PlaceholderSlide /> },
    { title: "Summary", component: <SummarySlide /> },
  ], [presentationData]);

  // Progress calculation
  const progress = useMemo(() => {
    const percent = Math.round(((currentSlide + 1) / slides.length) * 100);
    return { percent, current: currentSlide + 1, total: slides.length };
  }, [currentSlide, slides.length]);

  // Fullscreen functionality
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.log('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keep active tab centered in view
  useEffect(() => {
    const el = tabsBarRef.current;
    if (!el) return;
    
    const activeButton = el.querySelector(`button:nth-child(${currentSlide + 1})`) as HTMLElement;
    if (activeButton) {
      activeButton.scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center', 
        block: 'nearest' 
      });
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
      
      if (isInput) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrentSlide(prev => Math.max(0, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [slides.length]);

  const primaryColor = presentationConfig.theme.primary;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <div className={`text-sm text-${primaryColor}-700 font-semibold`}>
              {presentationData.course}
            </div>
            <div className="text-slate-900 font-bold truncate">
              {presentationData.title}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-40">
              <div className="text-xs text-slate-500 mb-1">
                Slide {progress.current} of {progress.total}
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${primaryColor}-600 transition-all duration-300`}
                  style={{ width: `${progress.percent}%` }} 
                />
              </div>
            </div>
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg bg-${primaryColor}-600 hover:bg-${primaryColor}-700 text-white transition-colors`}
              title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen"}
            >
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 1v4m0 0h-4m4 0l-5-5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <nav className="sticky top-[90px] z-10 bg-slate-50/95 backdrop-blur border-b border-slate-100 py-3">
        <div ref={tabsBarRef} className="max-w-6xl mx-auto px-4 overflow-x-auto">
          <div className="flex gap-2">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`shrink-0 inline-flex items-center gap-3 rounded-full border transition-all px-[0.8rem] py-[0.4rem] text-[0.84rem] min-w-[11.2rem] sm:min-w-[14.4rem] justify-start ${
                    isActive
                      ? `bg-${primaryColor}-600 text-white border-${primaryColor}-600 shadow-sm`
                      : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className={`inline-block w-3 h-3 rounded-full ${isActive ? "bg-white/90" : "bg-slate-300"}`} />
                  <span className="font-medium">{slide.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 pb-24">
        <div className="transition-all duration-300">
          {slides[currentSlide]?.component}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-xs text-slate-500">
              Use ← → arrow keys, Space to navigate • Press F for fullscreen
            </div>
          </div>
          
          <div className="flex-1 text-center text-sm text-slate-700 font-medium truncate">
            {slides[currentSlide]?.title} • {presentationData.date}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors"
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
            >
              Previous
            </button>
            <button
              className="px-3 py-1.5 rounded-full bg-slate-900 text-white text-sm disabled:opacity-50 hover:bg-slate-800 transition-colors"
              onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlide === slides.length - 1}
            >
              Next
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
