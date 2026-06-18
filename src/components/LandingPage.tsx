import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  AlertTriangle,
  CheckCircle,
  UploadCloud,
  Download,
  ChevronDown,
  Zap,
  Settings,
  Layers,
  FileSpreadsheet,
  Menu,
  X,
  ArrowRight,
  Sparkles,
  MousePointer,
  HelpCircle,
  Search
} from 'lucide-react';

interface LandingPageProps {
  onStartApp: () => void;
}

export function LandingPage({ onStartApp }: LandingPageProps) {
  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active view tab state (Different Views Section)
  const [activeViewTab, setActiveViewTab] = useState<'time' | 'stage' | 'category'>('time');

  // Conflict Resolution Demonstration State
  const [conflictResolved, setConflictResolved] = useState(false);

  // Auto-loop conflict resolution simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setConflictResolved((prev) => !prev);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Mock Dashboard States (Interactive Preview)
  const [mockPrograms, setMockPrograms] = useState([
    { id: 1, name: 'Senior Elocution', category: 'Lower Primary', stage: 'Stage 1', time: '09:00 AM', duration: 45, isConflict: false },
    { id: 2, name: 'Classical Dance', category: 'High School', stage: 'Stage 2', time: '09:00 AM', duration: 60, isConflict: false },
    { id: 3, name: 'Drama Competition', category: 'Junior', stage: 'Stage 1', time: '10:00 AM', duration: 90, isConflict: true },
    { id: 4, name: 'Folk Song Solo', category: 'Senior', stage: 'Stage 1', time: '10:00 AM', duration: 30, isConflict: true },
    { id: 5, name: 'Instrumental Music', category: 'Campus', stage: 'Stage 3', time: '11:00 AM', duration: 45, isConflict: false },
  ]);
  const [isImporting, setIsImporting] = useState(false);
  const [imported, setImported] = useState(false);
  const [solvingState, setSolvingState] = useState(false);

  const handleMockImport = () => {
    if (isImporting || imported) return;
    setIsImporting(true);
    setTimeout(() => {
      setMockPrograms((prev) => [
        ...prev,
        { id: 6, name: 'Mime Show (Imported)', category: 'High School', stage: 'Stage 3', time: '09:00 AM', duration: 45, isConflict: false },
        { id: 7, name: 'Oppana (Imported)', category: 'Senior', stage: 'Stage 2', time: '11:00 AM', duration: 60, isConflict: false },
      ]);
      setIsImporting(false);
      setImported(true);
    }, 1200);
  };

  const handleMockSolveConflicts = () => {
    if (solvingState) return;
    setSolvingState(true);
    setTimeout(() => {
      setMockPrograms((prev) =>
        prev.map((prog) => {
          if (prog.id === 4) {
            // Shift Folk Song Solo to Stage 3 to resolve the conflict
            return { ...prog, stage: 'Stage 3', time: '10:00 AM', isConflict: false };
          }
          if (prog.id === 3) {
            return { ...prog, isConflict: false };
          }
          return prog;
        })
      );
      setSolvingState(false);
    }, 1000);
  };

  const resetMockDashboard = () => {
    setMockPrograms([
      { id: 1, name: 'Senior Elocution', category: 'Lower Primary', stage: 'Stage 1', time: '09:00 AM', duration: 45, isConflict: false },
      { id: 2, name: 'Classical Dance', category: 'High School', stage: 'Stage 2', time: '09:00 AM', duration: 60, isConflict: false },
      { id: 3, name: 'Drama Competition', category: 'Junior', stage: 'Stage 1', time: '10:00 AM', duration: 90, isConflict: true },
      { id: 4, name: 'Folk Song Solo', category: 'Senior', stage: 'Stage 1', time: '10:00 AM', duration: 30, isConflict: true },
      { id: 5, name: 'Instrumental Music', category: 'Campus', stage: 'Stage 3', time: '11:00 AM', duration: 45, isConflict: false },
    ]);
    setImported(false);
  };

  // FAQ Expanded index state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Can I import Excel schedules?',
      a: 'Yes! You can instantly upload Excel spreadsheets or tabular data via standard CSV imports. Our smart parser processes the headings and maps columns dynamically.',
    },
    {
      q: 'Can I export schedules?',
      a: 'Absolutely. Schedule Builder allows you to export your organized event rosters as high-fidelity print-ready PDFs, MS Excel Spreadsheets (.xlsx), or high-contrast image formats suitable for display boards.',
    },
    {
      q: 'Is this built for arts festivals only?',
      a: 'No, while originally created to streamline a massive school arts festival with 120+ categories, any multi-stage, multi-venue events—like conferences, tournaments, school programs, or exhibitions—can adapt the workflow.',
    },
    {
      q: 'Does it detect scheduling conflicts?',
      a: 'Yes. The system automatically cross-references venues (stages), timings, and participant categories in real-time, highlighting overlaps and clashes instantly to keep event coordination completely stress-free.',
    },
  ];

  return (
    <div className="w-screen h-screen overflow-y-auto overflow-x-hidden bg-[#0A0A0A] text-[#FAFAFA] scroll-smooth font-sans">

      {/* GLOWING AMBIENT BACKGROUNDS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute top-[-200px] left-[20%] w-[500px] h-[500px] rounded-full radial-glow opacity-60"></div>
        <div className="absolute top-[-100px] right-[25%] w-[400px] h-[400px] rounded-full radial-glow opacity-50"></div>
        <div className="absolute top-[300px] left-[40%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[100px]"></div>
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 w-full z-50 border-b border-white/5 bg-[#0A0A0A]/70 backdrop-blur-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-transform group-hover:scale-105">
              <Calendar className="w-4 h-4 text-black stroke-[2.5]" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-white to-emerald-400 bg-clip-text text-transparent">
              Schedule Builder
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a href="#views" className="hover:text-white transition-colors">Use Cases</a>
            <a href="#origin" className="hover:text-white transition-colors">Blog</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href="#demo"
              className="px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
            >
              View Demo
            </a>
            <button
              onClick={onStartApp}
              className="px-5 py-2 text-sm font-semibold rounded-lg bg-emerald-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:bg-emerald-400 hover:shadow-[0_0_25px_rgba(34,197,94,0.45)] transition-all duration-200"
            >
              Build Schedule
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-b border-white/5 bg-[#0C0C0C] px-4 py-6 flex flex-col gap-4"
            >
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white text-base py-2 border-b border-white/5"
              >
                Features
              </a>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white text-base py-2 border-b border-white/5"
              >
                Demo
              </a>
              <a
                href="#views"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white text-base py-2 border-b border-white/5"
              >
                Use Cases
              </a>
              <a
                href="#origin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white text-base py-2 border-b border-white/5"
              >
                Blog
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-300 hover:text-white text-base py-2 border-b border-white/5"
              >
                FAQ
              </a>
              <div className="flex flex-col gap-3 pt-4">
                <a
                  href="#demo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 text-center font-medium text-zinc-300 border border-white/10 rounded-lg hover:text-white"
                >
                  Watch Demo
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onStartApp();
                  }}
                  className="w-full py-2.5 text-center font-semibold bg-emerald-500 text-black rounded-lg shadow-md hover:bg-emerald-400"
                >
                  Build Schedule
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">

        {/* Floating Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none hidden md:block select-none overflow-hidden">
          {/* Calendar Icon Floating */}
          <motion.div
            animate={{ y: [0, -12, 0], rotate: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute top-[10%] left-[8%] w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg"
          >
            <Calendar className="w-5 h-5" />
          </motion.div>

          {/* Clock Icon Floating */}
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-[28%] right-[8%] w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg"
          >
            <Clock className="w-6 h-6" />
          </motion.div>

          {/* Stage/Map Icon Floating */}
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-[20%] left-[10%] w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg"
          >
            <MapPin className="w-5 h-5" />
          </motion.div>

          {/* Users Icon Floating */}
          <motion.div
            animate={{ y: [0, 15, 0], rotate: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay: 1.5 }}
            className="absolute bottom-[35%] right-[12%] w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg"
          >
            <Users className="w-5 h-5" />
          </motion.div>

          {/* Trophy Icon Floating */}
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 5.5, ease: "easeInOut", delay: 2 }}
            className="absolute top-[48%] left-[4%] w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg"
          >
            <Trophy className="w-6 h-6" />
          </motion.div>
        </div>

        {/* Small badge */}
        {/* <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          Built During a Real Arts Program
        </motion.div> */}

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.08]"
        >
          Build Event Schedules Without <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-emerald-400 via-emerald-500 to-green-600 bg-clip-text text-transparent text-glow">
            Spreadsheet Chaos
          </span>
        </motion.h1>

        {/* Sub Heading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-zinc-300 font-medium max-w-3xl mx-auto mt-6"
        >
          Plan competitions, assign venues, detect conflicts and generate multiple schedule formats in minutes.
        </motion.p>

        {/* Description */}
        {/* <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mt-4 leading-relaxed"
        >
          Originally built to manage 120+ competitions across multiple stages and categories during a large arts festival. Now available for anyone who wants a smarter scheduling workflow.
        </motion.p> */}

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onStartApp}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-[1.02] shadow-[0_0_30px_rgba(34,197,94,0.25)] transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            Build Schedule
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#demo"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold bg-zinc-900 text-white border border-white/10 hover:border-white/20 hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
          >
            Watch Demo
          </a>
        </motion.div>

        {/* Below Hero: Large Interactive Application Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          id="demo"
          className="relative max-w-5xl mx-auto mt-20 p-2.5 rounded-2xl bg-white/5 border border-white/10 glassmorphism shadow-[0_0_80px_rgba(34,197,94,0.08)] overflow-hidden"
        >
          {/* Subtle glow border */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-emerald-500/20 via-transparent to-white/5 opacity-50 z-0"></div>

          {/* MOCK DASHBOARD INTERFACE */}
          <div className="relative rounded-xl bg-[#0F0F0F] border border-white/5 text-left overflow-hidden z-10 flex flex-col h-[480px]">

            {/* Top Toolbar (App Header Mock) */}
            <div className="px-4 py-2 bg-zinc-900 border-b border-white/5 flex items-center justify-between flex-shrink-0 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span className="font-bold text-white text-xs">Schedule Builder</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Local Sync Active</span>
                </div>
                <div className="border-l border-white/10 h-3.5 pl-3">
                  Total Items: <strong className="text-white">{mockPrograms.length}</strong>
                </div>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="flex-1 overflow-hidden flex text-xs">

              {/* Left Pane (Mock Schedule Form) */}
              <div className="w-[240px] border-r border-white/5 bg-zinc-950/40 flex flex-col flex-shrink-0 overflow-y-auto">

                {/* Event Settings Header */}
                <div className="px-3.5 py-2 border-b border-white/5 bg-zinc-950/80 font-bold text-zinc-300 uppercase tracking-wider text-[9px]">
                  Event Settings
                </div>
                <div className="p-3 flex flex-col gap-2.5 border-b border-white/5 bg-black/10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold">Event Name</span>
                    <input type="text" readOnly value="Annual Arts Festival" className="bg-zinc-900 border border-white/5 rounded px-2 py-1 text-white text-[11px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">Venue</span>
                      <input type="text" readOnly value="Main Auditorium" className="bg-zinc-900 border border-white/5 rounded px-2 py-1 text-white text-[11px]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">Date</span>
                      <input type="text" readOnly value="2026-06-18" className="bg-zinc-900 border border-white/5 rounded px-2 py-1 text-white text-[11px]" />
                    </div>
                  </div>
                </div>

                {/* Create Schedule Header */}
                <div className="px-3.5 py-2 border-b border-white/5 bg-zinc-950/80 font-bold text-zinc-300 uppercase tracking-wider text-[9px]">
                  Create Event Schedule
                </div>
                <div className="p-3 flex flex-col gap-2.5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[9px] text-zinc-500 uppercase font-semibold">Program Name</span>
                    <input type="text" readOnly value="Folk Song Solo" className="bg-zinc-900 border border-white/5 rounded px-2 py-1 text-white text-[11px]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">Category</span>
                      <select disabled className="bg-zinc-900 border border-white/5 rounded px-1.5 py-1 text-white text-[11px] appearance-none">
                        <option>Senior</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">Stage</span>
                      <select disabled className="bg-zinc-900 border border-white/5 rounded px-1.5 py-1 text-white text-[11px] appearance-none">
                        <option>Stage 1</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">Starting Time</span>
                      <input type="text" readOnly value="10:00 AM" className="bg-zinc-900 border border-white/5 rounded px-2 py-1 text-white text-[11px]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] text-zinc-500 uppercase font-semibold">Reporting Time</span>
                      <input type="text" readOnly value="09:30 AM" className="bg-zinc-900 border border-white/5 rounded px-2 py-1 text-white text-[11px]" />
                    </div>
                  </div>

                  <button disabled className="mt-1 w-full border border-dashed border-emerald-500/30 text-emerald-400 py-1 rounded text-[10px] font-medium flex items-center justify-center gap-1.5 bg-emerald-500/5">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    Suggest Time Slot
                  </button>

                  <div className="flex gap-2 pt-2 border-t border-white/5 mt-1">
                    <button type="button" disabled className="flex-1 bg-zinc-900 border border-white/5 py-1 rounded text-[11px] text-zinc-400">Reset</button>
                    <button type="button" disabled className="flex-2 bg-emerald-500 text-black py-1 rounded text-[11px] font-bold">Add Item</button>
                  </div>
                </div>
              </div>

              {/* Right Pane (Mock Schedule Preview Table) */}
              <div className="flex-1 flex flex-col overflow-hidden bg-zinc-950/10">

                {/* Search / Filters Toolbar */}
                <div className="px-3 py-2 bg-zinc-900/80 border-b border-white/5 flex items-center justify-between gap-3 flex-shrink-0 flex-wrap text-[11px]">
                  <div className="flex items-center gap-2 flex-1 max-w-[150px]">
                    <Search className="w-3 h-3 text-zinc-500" />
                    <input type="text" readOnly placeholder="Search programs..." className="bg-zinc-900 border border-white/5 rounded px-2 py-0.5 w-full text-[11px] text-zinc-300" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleMockImport}
                      disabled={imported}
                      className={`px-2 py-1 rounded border text-[11px] font-medium flex items-center gap-1.5 transition-all ${imported
                        ? 'border-zinc-800 text-zinc-650 bg-zinc-900/40 cursor-default'
                        : 'border-white/10 text-zinc-300 bg-zinc-900 hover:bg-zinc-800'
                        }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      {isImporting ? 'Parsing CSV...' : imported ? 'CSV Imported' : 'Import Excel'}
                    </button>

                    {mockPrograms.some(p => p.isConflict) && (
                      <motion.button
                        onClick={handleMockSolveConflicts}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="px-2 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] font-semibold flex items-center gap-1.5 hover:bg-red-500/20 transition-all animate-pulse"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        {solvingState ? 'Resolving...' : 'Fix 2 Clashes'}
                      </motion.button>
                    )}

                    <button
                      onClick={() => alert('Demo Feature: In the actual app, this exports standard Excel formats instantly.')}
                      className="px-2 py-1 rounded bg-emerald-500 text-black text-[11px] font-bold flex items-center gap-1.5 hover:bg-emerald-400 transition-all"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export File
                    </button>
                    {imported && (
                      <button onClick={resetMockDashboard} className="text-zinc-500 hover:text-zinc-300 underline text-[11px] ml-1">
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Dense Table View */}
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-left border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-zinc-900 text-zinc-500 border-b border-white/5 font-bold uppercase tracking-wider sticky top-0 z-10">
                        <th className="px-2.5 py-2 text-center w-14">Actions</th>
                        <th className="px-2.5 py-2 w-12">Day</th>
                        <th className="px-2.5 py-2 w-24">Category</th>
                        <th className="px-2.5 py-2">Program Name</th>
                        <th className="px-2.5 py-2 w-16">Starting</th>
                        <th className="px-2.5 py-2 w-16">Reporting</th>
                        <th className="px-2.5 py-2 w-14">Duration</th>
                        <th className="px-2.5 py-2 w-14">Stage</th>
                        <th className="px-2.5 py-2 text-center w-14">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <AnimatePresence>
                        {mockPrograms.map((prog) => (
                          <motion.tr
                            key={prog.id}
                            layout
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="hover:bg-white/2 transition-colors group cursor-pointer"
                          >
                            <td className="px-2.5 py-2.5 text-center">
                              <div className="flex items-center justify-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                <span className="w-4.5 h-4.5 rounded hover:bg-white/5 flex items-center justify-center text-zinc-400"><Settings className="w-3 h-3" /></span>
                                <span className="w-4.5 h-4.5 rounded hover:bg-white/5 flex items-center justify-center text-zinc-400"><Download className="w-3 h-3" /></span>
                              </div>
                            </td>
                            <td className="px-2.5 py-2.5 text-zinc-450">Day 1</td>
                            <td className="px-2.5 py-2.5">
                              <span className="px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider border" style={{
                                color: prog.category === 'Lower Primary' ? '#FF5F56' : prog.category === 'High School' ? '#F1C40F' : prog.category === 'Junior' ? '#22C55E' : prog.category === 'Senior' ? '#BB86FC' : '#FF79C6',
                                backgroundColor: prog.category === 'Lower Primary' ? 'rgba(255, 95, 86, 0.12)' : prog.category === 'High School' ? 'rgba(241, 196, 15, 0.12)' : prog.category === 'Junior' ? 'rgba(34, 197, 94, 0.12)' : prog.category === 'Senior' ? 'rgba(187, 134, 252, 0.12)' : 'rgba(255, 121, 198, 0.12)',
                                borderColor: prog.category === 'Lower Primary' ? 'rgba(255, 95, 86, 0.25)' : prog.category === 'High School' ? 'rgba(241, 196, 15, 0.25)' : prog.category === 'Junior' ? 'rgba(34, 197, 94, 0.25)' : prog.category === 'Senior' ? 'rgba(187, 134, 252, 0.25)' : 'rgba(255, 121, 198, 0.25)'
                              }}>
                                {prog.category}
                              </span>
                            </td>
                            <td className="px-2.5 py-2.5 font-bold text-white leading-tight">{prog.name}</td>
                            <td className="px-2.5 py-2.5 font-semibold text-emerald-450">{prog.time}</td>
                            <td className="px-2.5 py-2.5 text-zinc-400">
                              {prog.time === '09:00 AM' ? '08:30 AM' : prog.time === '10:00 AM' ? '09:30 AM' : '10:30 AM'}
                            </td>
                            <td className="px-2.5 py-2.5 text-zinc-300">{prog.duration}m</td>
                            <td className="px-2.5 py-2.5 font-medium text-zinc-300">Stage {prog.stage.replace(/\D/g, '')}</td>
                            <td className="px-2.5 py-2.5 text-center">
                              {prog.isConflict ? (
                                <span className="px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30 text-[9px] font-bold animate-pulse">
                                  Conflict
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                                  Normal
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

            {/* Bottom Footer Guide inside Mock */}
            <div className="px-4 py-2 bg-zinc-900 border-t border-white/5 text-[10px] text-zinc-500 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-1">
                <MousePointer className="w-3 h-3 text-zinc-400" />
                <span>Hover and select options to preview scheduler features.</span>
              </div>
              <div>
                <span>Drag resizing active</span>
              </div>
            </div>

          </div>
        </motion.div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-20 md:py-32 bg-[#080808] border-y border-white/5 relative">
        <div className="absolute top-[40%] left-[10%] w-[350px] h-[350px] rounded-full bg-red-500/5 blur-[90px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-base text-emerald-400 font-semibold uppercase tracking-wider">The Coordination Crisis</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">
              Scheduling Was Never the Real Problem
            </h3>
            <p className="text-base sm:text-lg text-zinc-400 mt-4 leading-relaxed">
              Creating a schedule sounds simple until you manage hundreds of participants, multiple venues, judges, volunteers, and overlapping categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-5xl mx-auto">

            {/* Problem Card 1 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-red-500/20 transition-all duration-300 flex items-start gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-all shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  Same Category Running Simultaneously
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Students competing in the same grade category get scheduled in two different venues at once. Resulting in immediate coordinator panic and delayed timetables.
                </p>
              </div>
            </motion.div>

            {/* Problem Card 2 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-red-500/20 transition-all duration-300 flex items-start gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-all shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  Stage Conflicts and Overlaps
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Double booking the same physical stage at 10:30 AM for both Solo Song and Drama, causing onstage friction and confused judges.
                </p>
              </div>
            </motion.div>

            {/* Problem Card 3 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-red-500/20 transition-all duration-300 flex items-start gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-all shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  Manual Schedule Revisions
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  Adjusting a single program timing requires manually updating and recalculating subsequent events across the spreadsheet, taking hours of prone-to-error checks.
                </p>
              </div>
            </motion.div>

            {/* Problem Card 4 */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-red-500/20 transition-all duration-300 flex items-start gap-5 group"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500/20 transition-all shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
                  Last-Minute Changes Causing Chaos
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                  A program duration changes from 20 to 30 minutes on event morning. Instantly, all subsequent times on that stage are wrong, breaking printing notice boards.
                </p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-base text-emerald-400 font-semibold uppercase tracking-wider">The Solution In Action</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight font-display">
            Built Around Real Event Workflows
          </h3>
        </div>

        {/* Steps Grid with Connected Glowing Line */}
        <div className="relative max-w-4xl mx-auto">
          {/* Glowing Vertical Line (Visible on Desktop) */}
          <div className="absolute left-[31px] top-6 bottom-6 w-0.5 bg-gradient-to-b from-emerald-500 via-emerald-500/40 to-transparent hidden md:block z-0"></div>

          <div className="flex flex-col gap-12 md:gap-16">

            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 relative z-10">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-[0_0_15px_rgba(34,197,94,0.25)] shrink-0">
                01
              </div>
              <div className="pt-1">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  Import Existing Schedule
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20">Fast parser</span>
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-2xl">
                  Upload your raw CSV or existing spreadsheet data containing programs, stages, and starting times. The system parses the headers and maps them within seconds.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 relative z-10">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-[0_0_15px_rgba(34,197,94,0.25)] shrink-0">
                02
              </div>
              <div className="pt-1">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  Detect Conflicts
                  <span className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-mono border border-red-500/20">Instant warnings</span>
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-2xl">
                  The scheduler automatically inspects every stage location and event time, immediately flagging overlap clashes or category overlaps where participants are split.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 relative z-10">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-[0_0_15px_rgba(34,197,94,0.25)] shrink-0">
                03
              </div>
              <div className="pt-1">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  Optimize Schedule
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded font-mono border border-blue-500/20">Drag assistant</span>
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-2xl">
                  Adjust program stages, starting slots, or competition durations. Utilize the slot assistant to instantly see conflict-free times available in the schedule matrix.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-10 relative z-10">
              <div className="w-16 h-16 rounded-full bg-zinc-900 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-xl shadow-[0_0_15px_rgba(34,197,94,0.25)] shrink-0">
                04
              </div>
              <div className="pt-1">
                <h4 className="text-xl font-bold text-white flex items-center gap-2">
                  Export Anywhere
                  <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono border border-emerald-500/20">Multi-format</span>
                </h4>
                <p className="text-sm text-zinc-400 mt-2 leading-relaxed max-w-2xl">
                  Generate beautiful formatted PDF schedules, printable board images (JPG), or raw Excel spreadsheets sorted logically by times, categories, or venues.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 md:py-32 bg-[#080808] border-y border-white/5 relative">
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-emerald-400 font-semibold uppercase tracking-wider">Features Grid</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight font-display">
              Everything Needed for Event Scheduling
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all border-glow-hover">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Conflict Detection</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Automatically checks for and prevents overlap collisions, venue double-bookings, and participant categories clashes in real-time.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all border-glow-hover">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                <UploadCloud className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">CSV Import</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Import schedules from spreadsheets. Save time by directly pasting columns and letting our parser align variables.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all border-glow-hover">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Multiple Schedule Views</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Switch layouts on the fly. Review schedules sorted by Time Wise, Stage Wise, or Category Wise perspective.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all border-glow-hover">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Export Options</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Generate high-clarity PDF handouts, spreadsheet xlsx exports, or social/board-ready JPG images instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all border-glow-hover">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Duration Management</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Calculates starting and ending timeline coordinates. Adjusting duration automatically computes reporting times.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all border-glow-hover">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Mobile Friendly</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Works perfectly on phones and tablets. Event staff and judges can check schedule layouts from any smartphone.
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all border-glow-hover">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Real-Time Updates</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Make changes and observe instant timeline recalculations without having to refresh pages or reload profiles.
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-2xl bg-zinc-900/30 border border-white/5 hover:border-white/10 transition-all border-glow-hover">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 mb-4 shrink-0">
                <Settings className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold text-white">Simple Interface</h4>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Built for coordinators, not software engineers. Dense, clear split panels let you type inputs with speed.
              </p>
            </div>

            {/* Feature 9 - Bonus Placeholder (Callout Style) */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/20 to-zinc-900/20 border border-emerald-500/10 flex flex-col justify-between">
              <div>
                <Sparkles className="w-5 h-5 text-emerald-400 mb-3" />
                <h4 className="text-sm font-bold text-white">Need a custom feature?</h4>
                <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed">
                  Our scheduler is designed around real workflows. More automated optimizations are on the way.
                </p>
              </div>
              <button
                onClick={onStartApp}
                className="mt-4 text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 w-fit"
              >
                Launch App Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* DIFFERENT VIEWS SECTION */}
      <section id="views" className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-base text-emerald-400 font-semibold uppercase tracking-wider">Tailored Perspectives</h2>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">
            Different Teams Need Different Perspectives
          </h3>
        </div>

        {/* View toggles & expanding cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">

          {/* View Card 1: Time Wise */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 h-[380px] bg-zinc-950 relative overflow-hidden group ${activeViewTab === 'time' ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(34,197,94,0.08)]' : 'border-white/5 hover:border-white/10'
              }`}
            onMouseEnter={() => setActiveViewTab('time')}
          >
            <div className="z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase font-bold">Coordinator View</span>
                <Clock className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-white">Time Wise View</h4>
              <p className="text-sm text-zinc-400 mt-2">
                Perfect for coordinators managing the full event timeline. Gives a sequential list of all programs running across all stages.
              </p>
            </div>

            {/* Mockup Preview Area */}
            <div className="relative h-44 rounded-xl bg-zinc-900 border border-white/5 overflow-hidden flex flex-col p-2.5 mt-4 group-hover:border-white/10 transition-all">
              <div className="text-[9px] font-bold text-zinc-500 mb-1 border-b border-white/5 pb-1 flex justify-between">
                <span>CHRONOLOGICAL ORDER</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <div className="flex flex-col gap-1.5 overflow-hidden mt-1 text-[10px]">
                <div className="flex justify-between items-center bg-white/2 p-1.5 rounded border border-white/5">
                  <span className="font-bold text-white">09:00 AM — Folk Dance</span>
                  <span className="text-zinc-500">Stage 1</span>
                </div>
                <div className="flex justify-between items-center bg-white/2 p-1.5 rounded border border-white/5">
                  <span className="font-bold text-white">09:15 AM — Light Music</span>
                  <span className="text-zinc-500">Stage 2</span>
                </div>
                <div className="flex justify-between items-center bg-white/2 p-1.5 rounded border border-white/5 opacity-60">
                  <span className="font-bold text-white">10:00 AM — Recitation</span>
                  <span className="text-zinc-500">Stage 1</span>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* View Card 2: Stage Wise */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 h-[380px] bg-zinc-950 relative overflow-hidden group ${activeViewTab === 'stage' ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(34,197,94,0.08)]' : 'border-white/5 hover:border-white/10'
              }`}
            onMouseEnter={() => setActiveViewTab('stage')}
          >
            <div className="z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase font-bold">Stage Manager View</span>
                <MapPin className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-white">Stage Wise View</h4>
              <p className="text-sm text-zinc-400 mt-2">
                Ideal for stage managers, volunteers, and sound engineers. Separates and filters events strictly by stage columns.
              </p>
            </div>

            {/* Mockup Preview Area */}
            <div className="relative h-44 rounded-xl bg-zinc-900 border border-white/5 overflow-hidden flex flex-col p-2.5 mt-4 group-hover:border-white/10 transition-all">
              <div className="text-[9px] font-bold text-zinc-500 mb-1 border-b border-white/5 pb-1 flex justify-between">
                <span>FILTERED BY VENUE</span>
                <span className="text-zinc-400">STAGE 1</span>
              </div>
              <div className="flex flex-col gap-1.5 overflow-hidden mt-1 text-[10px]">
                <div className="bg-emerald-500/5 p-2 rounded border border-emerald-500/20">
                  <div className="font-bold text-white flex justify-between">
                    <span>Folk Dance (Solo)</span>
                    <span className="text-emerald-400 font-mono">09:00 AM</span>
                  </div>
                  <span className="text-[9px] text-zinc-400">Duration: 45m</span>
                </div>
                <div className="bg-zinc-800/50 p-2 rounded border border-white/5">
                  <div className="font-bold text-white flex justify-between">
                    <span>Recitation Senior</span>
                    <span className="text-zinc-500 font-mono">10:00 AM</span>
                  </div>
                  <span className="text-[9px] text-zinc-400">Duration: 30m</span>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

          {/* View Card 3: Category Wise */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 h-[380px] bg-zinc-950 relative overflow-hidden group ${activeViewTab === 'category' ? 'border-emerald-500/40 shadow-[0_0_30px_rgba(34,197,94,0.08)]' : 'border-white/5 hover:border-white/10'
              }`}
            onMouseEnter={() => setActiveViewTab('category')}
          >
            <div className="z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-emerald-400 font-mono tracking-widest uppercase font-bold">Participant View</span>
                <Users className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-white">Category Wise View</h4>
              <p className="text-sm text-zinc-400 mt-2">
                Focused schedules for specific category teams and participants (e.g. Higher Secondary, Junior). Keeps competitor clashes zero.
              </p>
            </div>

            {/* Mockup Preview Area */}
            <div className="relative h-44 rounded-xl bg-zinc-900 border border-white/5 overflow-hidden flex flex-col p-2.5 mt-4 group-hover:border-white/10 transition-all">
              <div className="text-[9px] font-bold text-zinc-500 mb-1 border-b border-white/5 pb-1 flex justify-between">
                <span>FILTERED BY CATEGORY</span>
                <span className="text-zinc-400">JUNIOR</span>
              </div>
              <div className="flex flex-col gap-1.5 overflow-hidden mt-1 text-[10px]">
                <div className="flex justify-between items-center bg-white/2 p-1.5 rounded border border-white/5">
                  <span className="font-bold text-white">Drama Competition</span>
                  <span className="text-emerald-400 font-mono">Stage 1</span>
                </div>
                <div className="flex justify-between items-center bg-white/2 p-1.5 rounded border border-white/5">
                  <span className="font-bold text-white">Elocution Contest</span>
                  <span className="text-zinc-500 font-mono">Stage 2</span>
                </div>
                <div className="flex justify-between items-center bg-white/2 p-1.5 rounded border border-white/5 opacity-60">
                  <span className="font-bold text-white">Guitar Classical</span>
                  <span className="text-zinc-500 font-mono">Stage 3</span>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-zinc-900 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* CONFLICT DETECTION SECTION */}
      <section className="py-20 md:py-32 bg-[#080808] border-y border-white/5 relative">
        <div className="absolute top-[30%] right-[10%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">

            <div>
              <h2 className="text-base text-emerald-400 font-semibold uppercase tracking-wider">Real-Time Collision Guard</h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight leading-tight">
                Find Problems Before <br />
                Event Day
              </h3>
              <p className="text-base text-zinc-400 mt-5 leading-relaxed">
                Manually verifying that a particular speaker or group category isn&apos;t double-booked is exhausting. Schedule Builder parses overlap logic on every single entry change.
              </p>

              <div className="mt-8 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                    <X className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Venue Clash Check</h5>
                    <p className="text-xs text-zinc-400 mt-0.5">Alerts if Stage 1 is occupied by two overlapping events at the same hour.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">Category Conflict Prevention</h5>
                    <p className="text-xs text-zinc-400 mt-0.5">Blocks scheduling Primary level children in two separate halls simultaneously.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Conflict Example Box */}
            <div className="p-6 sm:p-8 rounded-2xl bg-zinc-950 border border-white/5 relative overflow-hidden flex flex-col gap-6 shadow-2xl">

              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs text-zinc-500 uppercase tracking-widest font-semibold">Conflict Logic Engine</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-zinc-400">Simulation Status:</span>
                  <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider ${conflictResolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                    {conflictResolved ? 'Resolved' : 'Clash Active'}
                  </span>
                </div>
              </div>

              {/* Dynamic Animated Timeline Layout */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 flex flex-col gap-4 h-64 justify-center relative overflow-hidden">
                <div className="absolute top-2 left-2 text-[9px] text-zinc-500 uppercase font-mono tracking-widest">STAGE 1 TIMELINE</div>

                {/* Visual Tracks */}
                <div className="flex flex-col gap-5 relative">

                  {/* Program Card A */}
                  <motion.div
                    layout
                    className="p-3.5 rounded-lg border bg-zinc-900 border-white/15 w-full max-w-[280px] mx-auto shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white">Senior Elocution</span>
                      <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">10:00 AM</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">Duration: 45 Mins | Stage 1</div>
                  </motion.div>

                  {/* Conflicting / Resolved Card B */}
                  <motion.div
                    layout
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    animate={{
                      y: conflictResolved ? 0 : 0,
                      borderColor: conflictResolved ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)',
                      backgroundColor: conflictResolved ? 'rgba(34, 197, 94, 0.04)' : 'rgba(239, 68, 68, 0.04)',
                      x: conflictResolved ? 20 : 0
                    }}
                    className="p-3.5 rounded-lg border w-full max-w-[280px] mx-auto shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-white">Same Stage Occupied</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider ${conflictResolved ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                        {conflictResolved ? '11:00 AM' : '10:00 AM'}
                      </span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-1">
                      Duration: 60 Mins | {conflictResolved ? 'Stage 2 (Shifted)' : 'Stage 1'}
                    </div>
                  </motion.div>

                  {/* Red overlapping glowing bridge (Visible when NOT resolved) */}
                  {!conflictResolved && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-y-0 right-8 w-2 bg-red-500/80 rounded blur-xs animate-pulse"
                    ></motion.div>
                  )}
                </div>

              </div>

              {/* Status Alert Banner */}
              <AnimatePresence mode="wait">
                {conflictResolved ? (
                  <motion.div
                    key="resolved"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
                    <span>
                      <strong>Conflict Resolved!</strong> Stage 2 reallocated. Overlap warning cleared.
                    </span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="conflict"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-center gap-2 animate-pulse"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>
                      <strong>Conflict Detected:</strong> Two programs scheduled on the same stage at the same time.
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

          </div>
        </div>
      </section>

      {/* ORIGIN STORY SECTION */}
      <section id="origin" className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-5xl mx-auto">

          {/* Timeline illustration (Left side) */}
          <div className="order-2 lg:order-1 flex flex-col gap-6 relative p-6 bg-zinc-950 border border-white/5 rounded-2xl">
            <div className="absolute top-2 right-4 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">REAL CASE TIMELINE</div>

            <div className="relative pl-8 border-l border-white/10 flex flex-col gap-8">

              <div className="relative">
                <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 block">Day -1 (10:00 PM)</span>
                <h5 className="text-sm font-bold text-white mt-0.5">Manual Spreadsheet Lockup</h5>
                <p className="text-xs text-zinc-400 mt-1">
                  Managing 120+ student competitions across stages. A simple duration change breaks the subsequent 10 items. Panic sets in.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 block">Day -1 (11:30 PM)</span>
                <h5 className="text-sm font-bold text-white mt-0.5">First Schedule Builder Built</h5>
                <p className="text-xs text-zinc-400 mt-1">
                  A prototype script written under urgency to parse program categories, flag overlaps instantly, and output print boards.
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[38px] top-1.5 w-4 h-4 rounded-full bg-zinc-700/20 border-2 border-zinc-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                </div>
                <span className="text-[10px] font-bold text-zinc-500 block">Event Day (08:00 AM)</span>
                <h5 className="text-sm font-bold text-white mt-0.5">Smooth, Conflict-Free Execution</h5>
                <p className="text-xs text-zinc-400 mt-1">
                  Schedule printed cleanly on massive billboards. Last-minute changes re-parsed and exported in under 2 minutes.
                </p>
              </div>

            </div>
          </div>

          {/* Text content (Right side) */}
          <div className="order-1 lg:order-2">
            <h2 className="text-base text-emerald-400 font-semibold uppercase tracking-wider">The Origin Story</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight font-display">
              Built One Night Before an Event
            </h3>

            <div className="text-sm text-zinc-400 mt-6 flex flex-col gap-4 leading-relaxed">
              <p>
                This project started during the preparation of a large arts program with more than 120 competitions across two days.
              </p>
              <p>
                The schedule already existed, but repeated conflicts and manual checking were delaying the entire process. A quick solution was needed.
              </p>
              <p>
                So **Schedule Builder** was created to import schedules, identify problems instantly, and generate multiple schedule formats within minutes. What started as an internal tool became one of the most useful systems used during the event.
              </p>
            </div>

            <button
              onClick={onStartApp}
              className="mt-8 px-6 py-3 rounded-lg bg-zinc-900 border border-white/10 hover:border-emerald-500/20 text-white font-semibold text-sm transition-all flex items-center gap-2 group"
            >
              Start Planning Event
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className="py-20 md:py-32 bg-[#080808] border-y border-white/5 relative">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">

          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-emerald-400 font-semibold uppercase tracking-wider">Performance Engine</h2>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mt-3 tracking-tight">
              Built With Modern Web Technologies
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">

            {/* Tech 1 */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-white/10 hover:bg-zinc-900/60 transition-all">
              <span className="text-lg font-bold text-white">React</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Component Architecture</span>
            </div>

            {/* Tech 2 */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-white/10 hover:bg-zinc-900/60 transition-all">
              <span className="text-lg font-bold text-white">Vite</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Fast HMR Bundler</span>
            </div>

            {/* Tech 3 */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-white/10 hover:bg-zinc-900/60 transition-all">
              <span className="text-lg font-bold text-white">Tailwind CSS</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Utility First Styling</span>
            </div>

            {/* Tech 4 */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-white/10 hover:bg-zinc-900/60 transition-all">
              <span className="text-lg font-bold text-white">Framer Motion</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Fluid Animations</span>
            </div>

            {/* Tech 5 */}
            <div className="p-5 rounded-xl bg-zinc-900/40 border border-white/5 flex flex-col items-center justify-center gap-2 hover:border-white/10 hover:bg-zinc-900/60 transition-all col-span-2 md:col-span-1">
              <span className="text-lg font-bold text-white">Vercel</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">Edge Deployment</span>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="py-20 md:py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 max-w-5xl mx-auto">

          <div>
            <h2 className="text-base text-emerald-400 font-semibold uppercase tracking-wider">Common Inquiries</h2>
            <h3 className="text-3xl font-extrabold text-white mt-3 tracking-tight font-display">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-zinc-400 mt-4 leading-relaxed">
              Have questions about data mapping, exporting options, or festival scalability? Here are responses to common queries.
            </p>
            <div className="mt-6 text-zinc-500 text-xs flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-emerald-500" />
              <span>Need further assistance? Check the GitHub repo.</span>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-white/5 bg-zinc-950 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-5 py-4 text-left font-bold text-sm text-white flex justify-between items-center hover:bg-white/2 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-200 shrink-0 ${expandedFaq === index ? 'rotate-180 text-emerald-400' : ''
                      }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 md:py-36 relative overflow-hidden bg-zinc-950 border-t border-white/5">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full radial-glow opacity-30 pointer-events-none select-none z-0"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Ready to Build Better <br />
            Event Schedules?
          </h2>
          <p className="text-base text-zinc-400 max-w-xl mx-auto mt-6 leading-relaxed">
            Stop manually checking spreadsheets and start focusing on your event. Solve overlapping times and export layouts instantly.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm mx-auto">
            <button
              onClick={onStartApp}
              className="w-full px-8 py-4 rounded-xl font-bold bg-emerald-500 text-black hover:bg-emerald-400 hover:scale-[1.02] shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all duration-200"
            >
              Build Schedule
            </button>
            <a
              href="#demo"
              className="w-full px-8 py-4 rounded-xl font-bold bg-zinc-900 text-white border border-white/10 hover:border-white/20 transition-all"
            >
              View Demo
            </a>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">

          <div className="flex flex-col items-center md:items-start gap-2 text-center md:text-left">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center shadow-md">
                <Calendar className="w-3.5 h-3.5 text-black stroke-[2.5]" />
              </div>
              <span className="font-bold text-white tracking-tight">Schedule Builder</span>
            </div>
            {/* <p className="text-[11px] text-zinc-500 mt-1 max-w-xs leading-normal">
              Built from a real-world problem during a large arts festival.
            </p> */}
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs font-semibold text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#origin" className="hover:text-white transition-colors">Blog</a>
            <a href="#demo" className="hover:text-white transition-colors">Demo</a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1.5"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.48 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </a>
          </div>

          <div className="text-[11px] text-zinc-500">
            © 2026 Schedule Builder
          </div>

        </div>
      </footer>

    </div>
  );
}
