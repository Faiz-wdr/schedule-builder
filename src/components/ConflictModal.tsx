import React from 'react';
import { TimeConflict } from '../types';
import { AlertTriangle, X } from 'lucide-react';

interface ConflictModalProps {
  isOpen: boolean;
  conflict: TimeConflict | null;
  onProceed: () => void;
  onCancel: () => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  conflict,
  onProceed,
  onCancel,
}) => {
  if (!isOpen || !conflict) return null;

  const isCategory = conflict.type === 'category';

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '540px' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid #3C3C3C' }}>
          <div className="top-nav-logo" style={{ color: '#FFB020', gap: '8px' }}>
            <AlertTriangle size={16} className="text-warning" style={{ color: '#FFB020' }} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFF', background: 'none', WebkitTextFillColor: 'initial' }}>
              {isCategory ? 'Category Conflict Detected' : 'Stage Conflict Detected'}
            </span>
          </div>
          <button className="action-icon-btn" onClick={onCancel} aria-label="Close modal">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#B3B3B3', marginBottom: '14px', fontSize: '12px' }}>
            {isCategory
              ? 'Two schedules belong to the same category and overlap in time. What would you like to do?'
              : 'Two schedules use the same stage and overlap in time. What would you like to do?'}
          </p>

          <div className="conflict-card">
            <span style={{ fontSize: '11px', fontWeight: 600, color: '#FFB020', display: 'block', marginBottom: '8px' }}>
              {isCategory ? 'Category Conflict' : 'Stage Conflict'}
            </span>

            <div className="conflict-details-grid">
              {/* Existing Schedule */}
              <div className="conflict-item-detail">
                <h4>Existing Item</h4>
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
                  <span className="detail-val" style={{ color: '#4D90FE' }}>{conflict.existing.startingTime}</span>
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
                <h4>Incoming Item</h4>
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
                  <span className="detail-val" style={{ color: '#4D90FE' }}>{conflict.incoming.startingTime}</span>
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
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" style={{ backgroundColor: '#FFB020', borderColor: '#FFB020' }} onClick={onProceed}>
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};
