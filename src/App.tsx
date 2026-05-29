import React, { useState, useEffect, useRef } from 'react';
import { ScheduleItem, TimeConflict } from './types';
import { ScheduleForm } from './components/ScheduleForm';
import { SchedulePreview } from './components/SchedulePreview';
import { ConflictModal } from './components/ConflictModal';
import { SuggestionModal } from './components/SuggestionModal';
import { ExportModal } from './components/ExportModal';
import { PrintLayout } from './components/PrintLayout';
import { suggestAvailableSlots, timeToMinutes } from './utils/timeUtils';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { CalendarRange } from 'lucide-react';

export default function App() {
  // Central schedules state loaded from Local Storage
  const [schedules, setSchedules] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('arts_festival_schedules');
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to local storage automatically
  useEffect(() => {
    localStorage.setItem('arts_festival_schedules', JSON.stringify(schedules));
  }, [schedules]);

  // Edit item state
  const [editItem, setEditItem] = useState<ScheduleItem | null>(null);

  // Event Details State loaded from Local Storage
  const [eventName, setEventName] = useState(() => localStorage.getItem('arts_festival_event_name') || 'ARTS FESTIVAL');
  const [venue, setVenue] = useState(() => localStorage.getItem('arts_festival_venue') || 'MAIN ARENA');
  const [date, setDate] = useState(() => localStorage.getItem('arts_festival_date') || new Date().toISOString().split('T')[0]);

  // Sync Event Details to local storage
  useEffect(() => {
    localStorage.setItem('arts_festival_event_name', eventName);
  }, [eventName]);

  useEffect(() => {
    localStorage.setItem('arts_festival_venue', venue);
  }, [venue]);

  useEffect(() => {
    localStorage.setItem('arts_festival_date', date);
  }, [date]);

  // Split-pane resizing states
  const [leftPaneWidth, setLeftPaneWidth] = useState(380);
  const [isDragging, setIsDragging] = useState(false);
  const startDragXRef = useRef(0);
  const startWidthRef = useRef(0);

  // Conflict modal states
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [pendingItem, setPendingItem] = useState<Omit<ScheduleItem, 'id'> | ScheduleItem | null>(null);
  const [activeConflict, setActiveConflict] = useState<TimeConflict | null>(null);

  // Suggest time assistant modal states
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);
  const [suggestedSlots, setSuggestedSlots] = useState<string[]>([]);
  const [suggestParams, setSuggestParams] = useState({
    day: 'Day 1',
    category: '',
    duration: 30,
    stage: '',
  });

  // Export states
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportMetadata, setExportMetadata] = useState({
    eventName: 'ARTS FESTIVAL SCHEDULE',
    venue: 'MAIN ARENA',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    dayNumber: 'ALL DAYS',
  });

  // Declarative override state for Suggestion Slot time selection
  const [overrideStartingTime, setOverrideStartingTime] = useState<string | null>(null);

  // Mouse drag handlers for custom split pane resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startDragXRef.current = e.clientX;
    startWidthRef.current = leftPaneWidth;
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - startDragXRef.current;
      const newWidth = Math.max(320, Math.min(500, startWidthRef.current + deltaX));
      setLeftPaneWidth(newWidth);
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Create new schedule item
  const handleAddSchedule = (item: Omit<ScheduleItem, 'id'>) => {
    const conflict = detectConflict(item, schedules);
    if (conflict) {
      setPendingItem(item);
      setActiveConflict(conflict);
      setIsConflictModalOpen(true);
    } else {
      const newItem: ScheduleItem = {
        ...item,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      };
      setSchedules((prev) => [...prev, newItem]);
    }
  };

  // Update schedule item
  const handleUpdateSchedule = (item: ScheduleItem) => {
    const conflict = detectConflict(item, schedules, item.id);
    if (conflict) {
      setPendingItem(item);
      setActiveConflict(conflict);
      setIsConflictModalOpen(true);
    } else {
      setSchedules((prev) => prev.map((s) => (s.id === item.id ? item : s)));
      setEditItem(null);
    }
  };

  // Conflict resolution handlers
  const handleProceedConflict = () => {
    if (!pendingItem) return;

    if ('id' in pendingItem) {
      // It is an edit update
      const updatedItem: ScheduleItem = {
        ...pendingItem,
        isConflict: true,
      };
      setSchedules((prev) => prev.map((s) => (s.id === updatedItem.id ? updatedItem : s)));
      setEditItem(null);
    } else {
      // It is a new schedule add
      const newItem: ScheduleItem = {
        ...pendingItem,
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        isConflict: true,
      };
      setSchedules((prev) => [...prev, newItem]);
    }

    // Reset states
    setPendingItem(null);
    setActiveConflict(null);
    setIsConflictModalOpen(false);
  };

  const handleCancelConflict = () => {
    setPendingItem(null);
    setActiveConflict(null);
    setIsConflictModalOpen(false);
  };

  // Duplicate handler
  const handleDuplicate = (item: ScheduleItem) => {
    // Generate a clean program copy name
    const matches = item.programName.match(/\(Copy\s*(\d*)\)$/i);
    let newName = '';
    if (matches) {
      const index = parseInt(matches[1], 10) || 1;
      newName = item.programName.replace(/\(Copy\s*\d*\)$/i, `(Copy ${index + 1})`);
    } else {
      newName = `${item.programName} (Copy)`;
    }

    const duplicatedItem: ScheduleItem = {
      ...item,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
      programName: newName,
      // Duplicate should check conflicts too
      isConflict: false, // Reset conflict initially and re-check
    };

    const conflict = detectConflict(duplicatedItem, schedules);
    if (conflict) {
      setPendingItem(duplicatedItem);
      setActiveConflict(conflict);
      setIsConflictModalOpen(true);
    } else {
      setSchedules((prev) => [...prev, duplicatedItem]);
    }
  };

  // Delete handler
  const handleDelete = (id: string) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    if (editItem && editItem.id === id) {
      setEditItem(null);
    }
  };

  // Reset all schedules and event settings data
  const handleResetData = () => {
    setSchedules([]);
    setEventName('ARTS FESTIVAL');
    setVenue('MAIN ARENA');
    setDate(new Date().toISOString().split('T')[0]);
  };

  // Excel bulk import handler
  const handleImportSchedules = (items: Omit<ScheduleItem, 'id'>[]) => {
    const importItems = items.map((item) => ({
      ...item,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
    }));
    setSchedules((prev) => [...prev, ...importItems]);
  };

  // Suggest Time handler
  const handleTriggerSuggest = (day: string, category: string, duration: number, stage: string) => {
    const slots = suggestAvailableSlots(day, category, duration, stage, schedules);
    setSuggestedSlots(slots);
    setSuggestParams({ day, category, duration, stage });
    setIsSuggestModalOpen(true);
  };

  const handleSelectSlotTime = (time: string) => {
    // We update the editItem or pass it back to the form
    if (editItem) {
      setEditItem({
        ...editItem,
        startingTime: time,
      });
    } else {
      setOverrideStartingTime(time);
    }
    setIsSuggestModalOpen(false);
  };

  // Helper utility to detect conflicts (for internal routing)
  const detectConflict = (
    incoming: Omit<ScheduleItem, 'id'> | ScheduleItem,
    existingSchedules: ScheduleItem[],
    excludeId?: string
  ): TimeConflict | null => {
    const sMins = timeToMinutes(incoming.startingTime);
    const dMins = incoming.duration;

    if (sMins === -1 || dMins <= 0) return null;

    for (const ext of existingSchedules) {
      if (excludeId && ext.id === excludeId) continue;
      if (ext.day !== incoming.day) continue;

      const extSMins = timeToMinutes(ext.startingTime);
      const extDMins = ext.duration;

      if (extSMins === -1 || extDMins <= 0) continue;

      // Check overlap
      const endInc = sMins + dMins;
      const endExt = extSMins + extDMins;
      const overlap = sMins < endExt && extSMins < endInc;

      if (overlap) {
        if (ext.category.toLowerCase().trim() === incoming.category.toLowerCase().trim()) {
          return { type: 'category', existing: ext, incoming };
        }
        if (ext.stage.toLowerCase().trim() === incoming.stage.toLowerCase().trim()) {
          return { type: 'stage', existing: ext, incoming };
        }
      }
    }
    return null;
  };

  // Trigger export format modal
  const handleOpenExportModal = () => {
    // Try to guess defaults based on filtered items or current state
    const days = Array.from(new Set(schedules.map(s => s.day)));
    const dayStr = days.length === 1 ? days[0] : 'ALL DAYS';
    
    // Format date in a beautiful printable string e.g. "October 12, 2026"
    const formattedDate = date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '';

    setExportMetadata({
      eventName: eventName,
      venue: venue.toUpperCase(),
      date: formattedDate,
      dayNumber: dayStr.toUpperCase(),
    });
    setIsExportModalOpen(true);
  };

  const handleExportExecute = (format: 'pdf' | 'jpg') => {
    setIsExportModalOpen(false);

    // Give time for layout to synchronize before render
    setTimeout(() => {
      const element = document.getElementById('printable-schedule');
      if (!element) {
        alert('Print layout container not found.');
        return;
      }

      // Render high resolution screenshot canvas using html2canvas
      html2canvas(element, {
        scale: 2, // High clarity
        useCORS: true,
        backgroundColor: '#FFFFFF',
      }).then((canvas) => {
        const cleanName = exportMetadata.eventName.replace(/[^a-z0-9]/gi, '_').toLowerCase();

        if (format === 'jpg') {
          // Export as JPG
          const link = document.createElement('a');
          link.download = `${cleanName}_schedule.jpg`;
          link.href = canvas.toDataURL('image/jpeg', 0.95);
          link.click();
        } else {
          // Export as A4 PDF
          const imgData = canvas.toDataURL('image/jpeg', 0.95);
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
          });

          const pdfHeight = 297; // A4 standard size in mm

          // Preserve ratio
          const imgWidth = 210;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          // Add first page
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pdfHeight;

          // Pagination loop
          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
          }

          pdf.save(`${cleanName}_schedule.pdf`);
        }
      }).catch(err => {
        console.error(err);
        alert('Error rendering schedule document.');
      });
    }, 100);
  };

  return (
    <div className="app-container">
      {/* Blocker during resizing drag */}
      {isDragging && <div className="dragging-blocker" />}

      {/* Top logo bar */}
      <header className="top-nav">
        <div className="top-nav-logo">
          <CalendarRange size={16} style={{ color: '#4D90FE' }} />
          <span>Arts Program Schedule Builder</span>
        </div>
        <div className="top-nav-actions" style={{ fontSize: '11px', color: '#B3B3B3', display: 'flex', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4CAF50' }}></span>
            <span>Local Sync Active</span>
          </div>
          <div style={{ borderLeft: '1px solid #3C3C3C', height: '14px', paddingLeft: '8px' }}>
            Total Items: <strong style={{ color: '#FFF' }}>{schedules.length}</strong>
          </div>
        </div>
      </header>

      {/* Workspace panel split */}
      <main className="workspace">
        <div style={{ width: `${leftPaneWidth}px`, display: 'flex', flexShrink: 0 }}>
          <ScheduleForm
            onAddSchedule={handleAddSchedule}
            onUpdateSchedule={handleUpdateSchedule}
            editItem={editItem}
            onClearEdit={() => setEditItem(null)}
            onTriggerSuggest={handleTriggerSuggest}
            startingTimeOverride={overrideStartingTime}
            onResetOverride={() => setOverrideStartingTime(null)}
            eventName={eventName}
            onChangeEventName={setEventName}
            venue={venue}
            onChangeVenue={setVenue}
            date={date}
            onChangeDate={setDate}
            onResetData={handleResetData}
          />
        </div>

        {/* Vertical dragging resize handle */}
        <div
          className={`resizer ${isDragging ? 'dragging' : ''}`}
          onMouseDown={handleMouseDown}
        />

        <div className="pane-right">
          <SchedulePreview
            schedules={schedules}
            onEdit={(item) => setEditItem(item)}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onImportSchedules={handleImportSchedules}
            onOpenExportModal={handleOpenExportModal}
          />
        </div>
      </main>

      {/* Conflict Dialog Modal */}
      <ConflictModal
        isOpen={isConflictModalOpen}
        conflict={activeConflict}
        onProceed={handleProceedConflict}
        onCancel={handleCancelConflict}
      />

      {/* Suggestion Slots Dialog Modal */}
      <SuggestionModal
        isOpen={isSuggestModalOpen}
        slots={suggestedSlots}
        day={suggestParams.day}
        category={suggestParams.category}
        stage={suggestParams.stage}
        duration={suggestParams.duration}
        onSelectSlot={handleSelectSlotTime}
        onClose={() => setIsSuggestModalOpen(false)}
      />

      {/* Export Format Dialog Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onExport={handleExportExecute}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* Off-screen Document print engine */}
      <PrintLayout
        schedules={schedules}
        eventName={eventName}
        venue={venue.toUpperCase()}
        date={date ? new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
        dayNumber={exportMetadata.dayNumber}
      />
    </div>
  );
}
