import React from 'react';
import { TimeConflict } from '../types';
import { AlertTriangle, X } from 'lucide-react';

interface ConflictModalProps {
  isOpen: boolean;
  conflict: TimeConflict | null;
  onProceed: () => void;
  onCancel: () => void;
  isReadOnly?: boolean;
  suggestions?: string[];
  onSelectSuggestion?: (time: string) => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  conflict,
  onProceed,
  onCancel,
  isReadOnly = false,
  suggestions = [],
  onSelectSuggestion,
}) => {
  if (!isOpen || !conflict) return null;

  const isCategory = conflict.type === 'category';

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '540px' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid #27272A' }}>
          <div className="top-nav-logo" style={{ color: '#FFB020', gap: '8px' }}>
            <AlertTriangle size={16} className="text-warning" style={{ color: '#FFB020' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFF', background: 'none', WebkitTextFillColor: 'initial' }}>
              {isReadOnly ? 'Conflict Details' : (isCategory ? 'Category Conflict Detected' : 'Stage Conflict Detected')}
            </span>
          </div>
          <button className="action-icon-btn" onClick={onCancel} aria-label="Close modal">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#B3B3B3', marginBottom: '14px', fontSize: '12px' }}>
            {isReadOnly ? (
              isCategory
                ? 'The following two schedules belong to the same category and overlap in time.'
                : 'The following two schedules use the same stage and overlap in time.'
            ) : (
              isCategory
                ? 'Two schedules belong to the same category and overlap in time. What would you like to do?'
                : 'Two schedules use the same stage and overlap in time. What would you like to do?'
            )}
          </p>

          <div className="conflict-card">
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FFB020', display: 'block', marginBottom: '8px' }}>
              {isCategory ? 'Category Conflict' : 'Stage Conflict'}
            </span>

            <div className="conflict-details-grid">
              {/* Existing Schedule */}
              <div className="conflict-item-detail">
                <h4>{isReadOnly ? 'Schedule Item 1' : 'Existing Item'}</h4>
                <div className="detail-row">
                  <span className="detail-label">Program:</span>
                  <span className="detail-val" style={{ color: '#FFF' }}>{conflict.existing.programName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-val">{conflict.existing.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Day:</span>
                  <span className="detail-val">{conflict.existing.day}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-val" style={{ color: '#22C55E' }}>{conflict.existing.startingTime}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-val">{conflict.existing.duration}m</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Stage:</span>
                  <span className="detail-val">{conflict.existing.stage}</span>
                </div>
              </div>

              {/* Incoming Schedule */}
              <div className="conflict-item-detail">
                <h4>{isReadOnly ? 'Schedule Item 2' : 'Incoming Item'}</h4>
                <div className="detail-row">
                  <span className="detail-label">Program:</span>
                  <span className="detail-val" style={{ color: '#FFF' }}>{conflict.incoming.programName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category:</span>
                  <span className="detail-val">{conflict.incoming.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Day:</span>
                  <span className="detail-val">{conflict.incoming.day}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time:</span>
                  <span className="detail-val" style={{ color: '#22C55E' }}>{conflict.incoming.startingTime}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-val">{conflict.incoming.duration}m</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Stage:</span>
                  <span className="detail-val">{conflict.incoming.stage}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conflict Resolution Suggestions */}
          {suggestions.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #27272A' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#22C55E', display: 'block', marginBottom: '8px' }}>
                Conflict Resolution Suggestions
              </span>
              <p style={{ color: '#B3B3B3', marginBottom: '10px', fontSize: '11px' }}>
                Reschedule the conflicting item (<strong>{conflict.incoming.programName}</strong>) to one of these free slots:
              </p>
              <div className="slots-container" style={{ margin: '8px 0' }}>
                {suggestions.map((time, idx) => (
                  <button
                    key={idx}
                    className="slot-btn"
                    onClick={() => onSelectSuggestion && onSelectSuggestion(time)}
                  >
                    <span className="slot-btn-time">{time}</span>
                    <span style={{ fontSize: '9px', color: '#B3B3B3', marginTop: '4px' }}>Apply Slot</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {isReadOnly ? (
            <button className="btn btn-primary" onClick={onCancel} style={{ backgroundColor: '#22C55E', borderColor: '#22C55E' }}>
              Close
            </button>
          ) : (
            <>
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" style={{ backgroundColor: '#FFB020', borderColor: '#FFB020' }} onClick={onProceed}>
                Proceed
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
