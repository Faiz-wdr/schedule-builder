import React, { useState, useMemo, useRef } from 'react';
import { ScheduleItem, ImportSummary, TimeConflict } from '../types';
import { timeToMinutes, detectConflict, minutesToTime } from '../utils/timeUtils';
import { ImportSummaryModal } from './ImportSummaryModal';
import * as XLSX from 'xlsx';
import { 
  Search, Filter, FileDown, 
  Upload, Trash2, Edit2, Copy, AlertCircle
} from 'lucide-react';

interface SchedulePreviewProps {
  schedules: ScheduleItem[];
  onEdit: (item: ScheduleItem) => void;
  onDuplicate: (item: ScheduleItem) => void;
  onDelete: (id: string) => void;
  onImportSchedules: (items: Omit<ScheduleItem, 'id'>[], overwriteConflicts?: boolean) => void;
  onOpenExportModal: (activeOrder: 'time' | 'stage' | 'category') => void;
}

const getCategoryStyle = (category: string) => {
  const cat = category.toLowerCase().trim();
  switch (cat) {
    case 'lower primary':
      return { color: '#FF5F56', backgroundColor: 'rgba(255, 95, 86, 0.12)', border: '1px solid rgba(255, 95, 86, 0.25)' };
    case 'upper primary':
      return { color: '#FFB020', backgroundColor: 'rgba(255, 176, 32, 0.12)', border: '1px solid rgba(255, 176, 32, 0.25)' };
    case 'high school':
      return { color: '#F1C40F', backgroundColor: 'rgba(241, 196, 15, 0.12)', border: '1px solid rgba(241, 196, 15, 0.25)' };
    case 'junior':
      return { color: '#4CAF50', backgroundColor: 'rgba(76, 175, 80, 0.12)', border: '1px solid rgba(76, 175, 80, 0.25)' };
    case 'higher secondary':
      return { color: '#4D90FE', backgroundColor: 'rgba(77, 144, 254, 0.12)', border: '1px solid rgba(77, 144, 254, 0.25)' };
    case 'senior':
      return { color: '#BB86FC', backgroundColor: 'rgba(187, 134, 252, 0.12)', border: '1px solid rgba(187, 134, 252, 0.25)' };
    case 'campus':
      return { color: '#FF79C6', backgroundColor: 'rgba(255, 121, 198, 0.12)', border: '1px solid rgba(255, 121, 198, 0.25)' };
    default:
      return { color: '#B3B3B3', backgroundColor: 'rgba(179, 179, 179, 0.12)', border: '1px solid rgba(179, 179, 179, 0.25)' };
  }
};

export const SchedulePreview: React.FC<SchedulePreviewProps> = ({
  schedules,
  onEdit,
  onDuplicate,
  onDelete,
  onImportSchedules,
  onOpenExportModal,
}) => {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [dayFilter, setDayFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stageFilter, setStageFilter] = useState('All');

  // Sorting Layout
  const [sortBy, setSortBy] = useState<'time' | 'stage' | 'category'>('time');

  // Interactive Excel Import States
  const [importSummary, setImportSummary] = useState<ImportSummary | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete Confirmation Modal States
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Derive filter list options dynamically from schedules
  const dayOptions = useMemo(() => {
    const days = schedules.map(s => s.day).filter(Boolean);
    return ['All', ...Array.from(new Set(days)).sort((a, b) => {
      const numA = parseInt(a.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.replace(/\D/g, '')) || 0;
      return numA - numB;
    })];
  }, [schedules]);

  const categoryOptions = useMemo(() => {
    const cats = schedules.map(s => s.category).filter(Boolean);
    return ['All', ...Array.from(new Set(cats)).sort()];
  }, [schedules]);

  const stageOptions = useMemo(() => {
    const stages = schedules.map(s => s.stage).filter(Boolean);
    return ['All', ...Array.from(new Set(stages)).sort()];
  }, [schedules]);

  // Handle Excel parsing using xlsx
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON row objects
        const rawRows = XLSX.utils.sheet_to_json<any>(worksheet);

        if (rawRows.length === 0) {
          alert('Excel file is empty.');
          return;
        }

        // Fuzzy match headers case-insensitively
        const findValue = (row: any, keys: string[]): string => {
          for (const key of Object.keys(row)) {
            if (keys.includes(key.toLowerCase().trim())) {
              return String(row[key]);
            }
          }
          return '';
        };

        const validItems: Omit<ScheduleItem, 'id'>[] = [];
        const conflictingItems: (Omit<ScheduleItem, 'id'> & { conflictTypes: ('category' | 'stage')[] })[] = [];
        const conflictsFound: TimeConflict[] = [];

        // Track items inside this batch for self-conflicts
        const tempSchedules = [...schedules];

        rawRows.forEach((row, index) => {
          const dayVal = findValue(row, ['day', 'day number', 'date day']);
          const catVal = findValue(row, ['category', 'genre']);
          const progVal = findValue(row, ['program name', 'program', 'event', 'event name']);
          const repVal = findValue(row, ['reporting time', 'reporting']);
          const startVal = findValue(row, ['starting time', 'starting', 'start time', 'start']);
          const durVal = findValue(row, ['duration', 'duration (minutes)', 'duration (min)', 'length']);
          const stageVal = findValue(row, ['stage', 'venue', 'location']);
          const remarkVal = findValue(row, ['remarks', 'remark', 'notes', 'note']);

          // Skip if essential fields are missing
          if (!catVal || !progVal || !startVal || !stageVal) {
            console.warn(`Row ${index + 1} skipped: missing essential information.`);
            return;
          }

          // Parse duration
          let durationNum = parseInt(durVal, 10);
          if (isNaN(durationNum) || durationNum <= 0) {
            durationNum = 30; // fallback
          }

          // Parse start and reporting times
          const startMin = timeToMinutes(startVal);
          if (startMin === -1) {
            console.warn(`Row ${index + 1} skipped: invalid starting time "${startVal}".`);
            return;
          }
          const formattedStart = minutesToTime(startMin);

          let formattedReport = formattedStart;
          if (repVal) {
            const repMin = timeToMinutes(repVal);
            if (repMin !== -1) {
              formattedReport = minutesToTime(repMin);
            }
          } else {
            // Default 30 mins prior
            formattedReport = minutesToTime(Math.max(0, startMin - 30));
          }

          const parsedItem: Omit<ScheduleItem, 'id'> = {
            day: dayVal || 'Day 1',
            category: catVal.trim(),
            programName: progVal.trim(),
            reportingTime: formattedReport,
            startingTime: formattedStart,
            duration: durationNum,
            stage: stageVal.trim(),
            remarks: remarkVal ? remarkVal.trim() : undefined,
          };

          // Check conflict
          const conflict = detectConflict(parsedItem, tempSchedules);
          if (conflict) {
            conflictingItems.push({
              ...parsedItem,
              conflictTypes: [conflict.type],
            });
            conflictsFound.push(conflict);
          } else {
            validItems.push(parsedItem);
          }

          // Push into tempSchedules to detect cascading conflicts inside the imported batch
          const mockItemWithId: ScheduleItem = {
            ...parsedItem,
            id: `temp-${index}`,
            isConflict: !!conflict,
          };
          tempSchedules.push(mockItemWithId);
        });

        // Set summary
        setImportSummary({
          total: rawRows.length,
          conflicts: conflictsFound,
          validItems,
          conflictingItems,
        });

        setIsImportModalOpen(true);
      } catch (err) {
        console.error(err);
        alert('Failed to parse Excel file. Please ensure it is a valid format.');
      }
    };
    reader.readAsBinaryString(file);
    // Reset file input value so upload can be triggered again
    if (e.target) e.target.value = '';
  };

  const handleImportConfirmAll = () => {
    if (!importSummary) return;
    
    // Combine valid items and conflict items (marking conflict items)
    const allImportItems: Omit<ScheduleItem, 'id'>[] = [
      ...importSummary.validItems,
      ...importSummary.conflictingItems.map(item => ({
        day: item.day,
        category: item.category,
        programName: item.programName,
        reportingTime: item.reportingTime,
        startingTime: item.startingTime,
        duration: item.duration,
        stage: item.stage,
        remarks: item.remarks,
        isConflict: true, // Flag as conflict
      })),
    ];

    onImportSchedules(allImportItems);
    setIsImportModalOpen(false);
    setImportSummary(null);
  };

  // Live filter, search, and sort logic
  const processedSchedules = useMemo(() => {
    let filtered = [...schedules];

    // Search
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(s => s.programName.toLowerCase().includes(query));
    }

    // Filter by Day
    if (dayFilter !== 'All') {
      filtered = filtered.filter(s => s.day === dayFilter);
    }

    // Filter by Category
    if (categoryFilter !== 'All') {
      filtered = filtered.filter(s => s.category === categoryFilter);
    }

    // Filter by Stage
    if (stageFilter !== 'All') {
      filtered = filtered.filter(s => s.stage === stageFilter);
    }

    // Sorting
    filtered.sort((a, b) => {
      // Parse days (e.g. "Day 1" -> 1, "Day 10" -> 10)
      const dayA = parseInt(a.day.replace(/\D/g, '')) || 0;
      const dayB = parseInt(b.day.replace(/\D/g, '')) || 0;

      const timeA = timeToMinutes(a.startingTime);
      const timeB = timeToMinutes(b.startingTime);

      if (sortBy === 'time') {
        if (dayA !== dayB) return dayA - dayB;
        return timeA - timeB;
      } else if (sortBy === 'stage') {
        const stageA = parseInt(a.stage) || 0;
        const stageB = parseInt(b.stage) || 0;
        if (stageA !== stageB) return stageA - stageB;
        if (dayA !== dayB) return dayA - dayB;
        return timeA - timeB;
      } else {
        const catOrder = ['lower primary', 'upper primary', 'high school', 'junior', 'higher secondary', 'senior', 'campus'];
        const idxA = catOrder.indexOf(a.category.toLowerCase().trim());
        const idxB = catOrder.indexOf(b.category.toLowerCase().trim());
        
        const priorityA = idxA !== -1 ? idxA : 999;
        const priorityB = idxB !== -1 ? idxB : 999;
        
        if (priorityA !== priorityB) return priorityA - priorityB;
        if (dayA !== dayB) return dayA - dayB;
        return timeA - timeB;
      }
    });

    return filtered;
  }, [schedules, searchTerm, dayFilter, categoryFilter, stageFilter, sortBy]);

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <div className="pane pane-right preview-container">
      {/* Search and filter toolbar */}
      <div className="preview-toolbar">
        <div className="toolbar-filters">
          <div className="search-input-wrapper">
            <Search size={13} className="search-icon" />
            <input
              type="text"
              placeholder="Search program name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={12} style={{ color: '#B3B3B3' }} />
            <select
              value={dayFilter}
              onChange={(e) => setDayFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Days</option>
              {dayOptions.filter(d => d !== 'All').map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {categoryOptions.filter(c => c !== 'All').map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Stages</option>
              {stageOptions.filter(s => s !== 'All').map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderLeft: '1px solid #3C3C3C', paddingLeft: '8px' }}>
            <span style={{ fontSize: '10px', color: '#B3B3B3', fontWeight: 600 }}>ORDER:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="filter-select"
              style={{ minWidth: '110px', height: '28px', fontSize: '11px', backgroundColor: 'var(--surface-color)', color: '#FFF' }}
            >
              <option value="time">Time Based</option>
              <option value="stage">Stage Wise</option>
              <option value="category">Category Wise</option>
            </select>
          </div>
        </div>

        <div className="toolbar-actions">
          {/* Hidden file input */}
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelImport}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-success"
            style={{ height: '28px', padding: '0 10px' }}
          >
            <Upload size={13} />
            Import Excel
          </button>

          <button
            onClick={() => onOpenExportModal(sortBy)}
            className="btn btn-primary"
            style={{ height: '28px', padding: '0 10px' }}
            disabled={schedules.length === 0}
          >
            <FileDown size={13} />
            Export File
          </button>
        </div>
      </div>

      {/* Main Table view */}
      <div className="table-wrapper">
        {processedSchedules.length > 0 ? (
          <table className="schedule-table">
            <thead>
              <tr>
                <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
                <th style={{ width: '70px' }}>Day</th>
                <th style={{ width: '100px' }}>Category</th>
                <th style={{ width: '220px' }}>Program Name</th>
                <th style={{ width: '90px' }}>Starting</th>
                <th style={{ width: '90px' }}>Reporting</th>
                <th style={{ width: '80px' }}>Duration</th>
                <th style={{ width: '100px' }}>Stage</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {processedSchedules.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="action-btns" style={{ justifyContent: 'center' }}>
                      <button
                        onClick={() => onEdit(item)}
                        className="action-icon-btn"
                        title="Edit schedule"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => onDuplicate(item)}
                        className="action-icon-btn"
                        title="Duplicate schedule"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item.id)}
                        className="action-icon-btn delete"
                        title="Delete schedule"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                  <td style={{ color: '#B3B3B3' }}>{item.day}</td>
                  <td>
                    <span
                      style={{
                        ...getCategoryStyle(item.category),
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        padding: '3px 8px',
                        fontSize: '10px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#FFF' }}>{item.programName}</td>
                  <td style={{ fontWeight: 500 }}>{item.startingTime}</td>
                  <td style={{ color: '#B3B3B3' }}>{item.reportingTime}</td>
                  <td>{item.duration}m</td>
                  <td>{item.stage}</td>
                  <td style={{ textAlign: 'center' }}>
                    {item.isConflict ? (
                      <span className="badge badge-conflict" title="Conflict identified during operation.">
                        Conflict
                      </span>
                    ) : (
                      <span className="badge badge-normal">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">
              <AlertCircle size={40} strokeWidth={1} style={{ color: '#3C3C3C' }} />
            </div>
            <div className="empty-state-title">
              {schedules.length === 0 ? 'No schedules added yet.' : 'No matching results.'}
            </div>
            <div className="empty-state-desc">
              {schedules.length === 0 
                ? 'Create a manual schedule using the Left Panel or import schedules from a spreadsheet.' 
                : 'Clear search filters or keywords to show all schedules.'
              }
            </div>
          </div>
        )}
      </div>

      {/* consolidated excel import summary modal */}
      <ImportSummaryModal
        isOpen={isImportModalOpen}
        summary={importSummary}
        onImportAll={handleImportConfirmAll}
        onCancel={() => {
          setIsImportModalOpen(false);
          setImportSummary(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '340px' }}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: '#FF5F56', fontWeight: 600 }}>Confirm Deletion</span>
            </div>
            <div className="modal-body">
              <p style={{ color: '#B3B3B3', fontSize: '12px' }}>
                Are you sure you want to delete this schedule? This action cannot be undone.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
