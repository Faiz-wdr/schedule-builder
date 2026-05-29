import React, { useState, useEffect } from 'react';
import { ScheduleItem } from '../types';
import { timeToMinutes, minutesToTime } from '../utils/timeUtils';
import { Plus, Check, RotateCcw, Sparkles } from 'lucide-react';

interface ScheduleFormProps {
  onAddSchedule: (item: Omit<ScheduleItem, 'id'>) => void;
  onUpdateSchedule: (item: ScheduleItem) => void;
  editItem: ScheduleItem | null;
  onClearEdit: () => void;
  onTriggerSuggest: (day: string, category: string, duration: number, stage: string) => void;
  startingTimeOverride?: string | null;
  onResetOverride?: () => void;
  eventName: string;
  onChangeEventName: (val: string) => void;
  venue: string;
  onChangeVenue: (val: string) => void;
  date: string;
  onChangeDate: (val: string) => void;
  onResetData: () => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  onAddSchedule,
  onUpdateSchedule,
  editItem,
  onClearEdit,
  onTriggerSuggest,
  startingTimeOverride,
  onResetOverride,
  eventName,
  onChangeEventName,
  venue,
  onChangeVenue,
  date,
  onChangeDate,
  onResetData,
}) => {
  // Base states
  const [day, setDay] = useState('Day 1');
  const [category, setCategory] = useState('Lower Primary');
  const [programName, setProgramName] = useState('');
  const [reportingTime, setReportingTime] = useState('08:30');
  const [startingTime, setStartingTime] = useState('09:00');
  const [duration, setDuration] = useState<number>(30);
  const [stage, setStage] = useState('1');
  const [remarks, setRemarks] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);



  // Helper to convert AM/PM string to 24h format (HH:MM)
  const ampmTo24h = (ampmStr: string): string => {
    const mins = timeToMinutes(ampmStr);
    if (mins === -1) return '';
    const h = Math.floor(mins / 60).toString().padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  // Sync startingTimeOverride suggestions
  useEffect(() => {
    if (startingTimeOverride) {
      handleStartingTimeChange(ampmTo24h(startingTimeOverride));
      if (onResetOverride) onResetOverride();
    }
  }, [startingTimeOverride]);

  // Sync with editItem
  useEffect(() => {
    if (editItem) {
      setDay(editItem.day);
      setCategory(editItem.category);
      setProgramName(editItem.programName);
      setReportingTime(ampmTo24h(editItem.reportingTime));
      setStartingTime(ampmTo24h(editItem.startingTime));
      setDuration(editItem.duration);
      setStage(editItem.stage);
      setRemarks(editItem.remarks || '');
    } else {
      clearForm();
    }
  }, [editItem]);

  // Set default reporting time to 30 mins before starting time if starting time changes
  const handleStartingTimeChange = (newVal: string) => {
    setStartingTime(newVal);
    // Parse time
    const militaryRegex = /^(\d{1,2}):(\d{2})$/;
    const match = newVal.match(militaryRegex);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      let totalMins = hours * 60 + minutes;
      
      // Default reporting time is 30 mins prior
      totalMins = Math.max(0, totalMins - 30);
      
      const rh = Math.floor(totalMins / 60).toString().padStart(2, '0');
      const rm = (totalMins % 60).toString().padStart(2, '0');
      setReportingTime(`${rh}:${rm}`);
    }
  };

  const clearForm = () => {
    setCategory('Lower Primary');
    setProgramName('');
    setReportingTime('08:30');
    setStartingTime('09:00');
    setDuration(30);
    setStage('1');
    setRemarks('');
    onClearEdit();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category.trim() || !programName.trim() || !startingTime || !stage.trim() || duration <= 0) {
      alert('Please fill out all required fields.');
      return;
    }

    // Format times into AM/PM format
    const sMins = timeToMinutes(startingTime);
    const rMins = timeToMinutes(reportingTime);

    const formattedStart = minutesToTime(sMins);
    const formattedReport = minutesToTime(rMins);

    const itemData = {
      day,
      category: category.trim(),
      programName: programName.trim(),
      reportingTime: formattedReport,
      startingTime: formattedStart,
      duration,
      stage: stage.trim(),
      remarks: remarks.trim() || undefined,
    };

    if (editItem) {
      onUpdateSchedule({
        ...itemData,
        id: editItem.id,
      });
    } else {
      onAddSchedule(itemData);
    }
  };

  // Suggest Time handler
  const handleSuggestClick = () => {
    if (!category.trim() || !stage.trim()) {
      alert('Please select a Category and Stage first so we can find conflict-free slots.');
      return;
    }
    onTriggerSuggest(day, category.trim(), duration, stage.trim());
  };

  return (
    <div className="pane pane-left">
      {/* Event Settings Section */}
      <div className="preview-toolbar" style={{ borderRight: 'none', borderBottom: '1px solid #3C3C3C' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600 }}>Event Settings</h2>
      </div>
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid #3C3C3C', backgroundColor: 'rgba(0, 0, 0, 0.1)', flexShrink: 0 }}>
        <div className="form-group">
          <label className="form-label">Event Name</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => onChangeEventName(e.target.value)}
            placeholder="e.g. Annual Arts Festival 2026"
            className="form-input"
            style={{ height: '26px' }}
          />
        </div>
        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => onChangeVenue(e.target.value)}
              placeholder="e.g. Main Auditorium"
              className="form-input"
              style={{ height: '26px' }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => onChangeDate(e.target.value)}
              className="form-input"
              style={{ height: '26px' }}
            />
          </div>
        </div>
      </div>

      <div className="preview-toolbar" style={{ borderRight: 'none' }}>
        <h2 style={{ fontSize: '13px', fontWeight: 600 }}>
          {editItem ? 'Edit Event Schedule' : 'Create Event Schedule'}
        </h2>
        {editItem && (
          <span style={{ fontSize: '10px', color: '#FFB020', fontWeight: 500, backgroundColor: 'rgba(255, 176, 32, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
            Edit Mode
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label className="form-label">Day</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="form-select"
            required
          >
            {Array.from({ length: 10 }, (_, i) => `Day ${i + 1}`).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
            required
          >
            <option value="Lower Primary">Lower Primary</option>
            <option value="Upper Primary">Upper Primary</option>
            <option value="High School">High School</option>
            <option value="Junior">Junior</option>
            <option value="Higher Secondary">Higher Secondary</option>
            <option value="Senior">Senior</option>
            <option value="Campus">Campus</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Program Name</label>
          <input
            type="text"
            value={programName}
            onChange={(e) => setProgramName(e.target.value)}
            placeholder="e.g. Classical Flute Solo"
            className="form-input"
            required
          />
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Starting Time</label>
            <input
              type="time"
              value={startingTime}
              onChange={(e) => handleStartingTimeChange(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Reporting Time</label>
            <input
              type="time"
              value={reportingTime}
              onChange={(e) => setReportingTime(e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>

        <div className="form-row-2" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
          <div className="form-group">
            <label className="form-label">Duration (minutes)</label>
            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Stage</label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="form-select"
              required
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: '4px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: '100%', borderStyle: 'dashed', color: '#4D90FE', borderColor: '#4D90FE', gap: '8px', height: '30px' }}
            onClick={handleSuggestClick}
          >
            <Sparkles size={13} />
            Suggest Time Slot
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Remarks (Optional)</label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add any special instructions or details..."
            className="form-textarea"
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #3C3C3C' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowResetConfirm(true)}
            style={{ flex: 1 }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ flex: 2 }}
          >
            {editItem ? <Check size={13} /> : <Plus size={13} />}
            {editItem ? 'Update Schedule' : 'Add Schedule'}
          </button>
        </div>
      </form>

      {/* Form Reset Confirmation Dialog Modal */}
      {showResetConfirm && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '340px' }}>
            <div className="modal-header">
              <span className="modal-title" style={{ color: '#FF5F56', fontWeight: 600 }}>Reset Form Fields</span>
            </div>
            <div className="modal-body">
              <p style={{ color: '#B3B3B3', fontSize: '12px' }}>
                Are you sure you want to clear the form? All active fields and any unsaved edits will be discarded.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowResetConfirm(false)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ backgroundColor: '#FF5F56', borderColor: '#FF5F56', color: '#FFF' }} onClick={() => {
                clearForm();
                onResetData();
                setShowResetConfirm(false);
              }}>
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
