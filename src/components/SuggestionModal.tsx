import React from 'react';
import { X, Clock } from 'lucide-react';

interface SuggestionModalProps {
  isOpen: boolean;
  slots: string[];
  day: string;
  category: string;
  stage: string;
  duration: number;
  onSelectSlot: (time: string) => void;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({
  isOpen,
  slots,
  day,
  category,
  stage,
  duration,
  onSelectSlot,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '400px' }}>
        <div className="modal-header">
          <div className="top-nav-logo" style={{ color: '#4D90FE', gap: '8px' }}>
            <Clock size={16} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFF', background: 'none', WebkitTextFillColor: 'initial' }}>
              Available Slots
            </span>
          </div>
          <button className="action-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#B3B3B3', marginBottom: '12px', fontSize: '11px' }}>
            Scanning schedules on <strong>{day}</strong> at <strong>{stage || 'Any Stage'}</strong> for <strong>{category || 'Any Category'}</strong> ({duration} min):
          </p>

          {slots.length > 0 ? (
            <div className="slots-container">
              {slots.map((time, idx) => (
                <button
                  key={idx}
                  className="slot-btn"
                  onClick={() => onSelectSlot(time)}
                >
                  <span className="slot-btn-time">{time}</span>
                  <span style={{ fontSize: '9px', color: '#B3B3B3', marginTop: '4px' }}>Select Slot</span>
                </button>
              ))}
            </div>
          ) : (
            <p style={{ color: '#FF5F56', textAlign: 'center', margin: '20px 0', fontSize: '12px' }}>
              No conflict-free slots found for these settings.
            </p>
          )}

          <p style={{ color: '#B3B3B3', fontSize: '10px', textAlign: 'center', marginTop: '8px' }}>
            Clicking a slot will automatically fill the Starting Time in the form.
          </p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
