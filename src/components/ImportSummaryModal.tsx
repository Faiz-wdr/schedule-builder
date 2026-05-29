import React from 'react';
import { ImportSummary } from '../types';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface ImportSummaryModalProps {
  isOpen: boolean;
  summary: ImportSummary | null;
  onImportAll: () => void;
  onCancel: () => void;
}

export const ImportSummaryModal: React.FC<ImportSummaryModalProps> = ({
  isOpen,
  summary,
  onImportAll,
  onCancel,
}) => {
  if (!isOpen || !summary) return null;

  const totalConflicts = summary.conflictingItems.length;
  const totalSchedules = summary.total;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '560px' }}>
        <div className="modal-header">
          <div className="top-nav-logo" style={{ color: totalConflicts > 0 ? '#FFB020' : '#4CAF50', gap: '8px' }}>
            {totalConflicts > 0 ? (
              <AlertTriangle size={16} style={{ color: '#FFB020' }} />
            ) : (
              <CheckCircle size={16} style={{ color: '#4CAF50' }} />
            )}
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFF', background: 'none', WebkitTextFillColor: 'initial' }}>
              Import Completed
            </span>
          </div>
          <button className="action-icon-btn" onClick={onCancel} aria-label="Close modal">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body" style={{ maxHeight: '60vh' }}>
          <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
            <div style={{ flex: 1, backgroundColor: '#1E1E1E', padding: '10px', borderRadius: '4px', border: '1px solid #3C3C3C', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#B3B3B3', textTransform: 'uppercase' }}>Schedules Detected</span>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#FFF', marginTop: '4px' }}>{totalSchedules}</div>
            </div>
            <div style={{ flex: 1, backgroundColor: '#1E1E1E', padding: '10px', borderRadius: '4px', border: '1px solid #3C3C3C', textAlign: 'center' }}>
              <span style={{ fontSize: '10px', color: '#B3B3B3', textTransform: 'uppercase' }}>Conflicts Found</span>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: totalConflicts > 0 ? '#FF5F56' : '#4CAF50', marginTop: '4px' }}>
                {totalConflicts}
              </div>
            </div>
          </div>

          {totalConflicts > 0 ? (
            <div>
              <p style={{ color: '#B3B3B3', marginBottom: '10px', fontSize: '11px' }}>
                The following rows have conflicts. If you select <strong>Import All</strong>, they will be imported and flagged in the schedule table.
              </p>

              <div style={{ border: '1px solid #3C3C3C', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#1E1E1E' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#252526', borderBottom: '1px solid #3C3C3C', color: '#B3B3B3', textAlign: 'left' }}>
                      <th style={{ padding: '6px 8px' }}>Day</th>
                      <th style={{ padding: '6px 8px' }}>Program</th>
                      <th style={{ padding: '6px 8px' }}>Stage</th>
                      <th style={{ padding: '6px 8px' }}>Time</th>
                      <th style={{ padding: '6px 8px' }}>Conflict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.conflictingItems.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: idx < summary.conflictingItems.length - 1 ? '1px solid #3C3C3C' : 'none' }}>
                        <td style={{ padding: '6px 8px', color: '#B3B3B3' }}>{item.day}</td>
                        <td style={{ padding: '6px 8px', color: '#FFF', fontWeight: 500 }}>{item.programName}</td>
                        <td style={{ padding: '6px 8px' }}>{item.stage}</td>
                        <td style={{ padding: '6px 8px', color: '#4D90FE' }}>{item.startingTime}</td>
                        <td style={{ padding: '6px 8px' }}>
                          <span style={{ color: '#FF5F56', fontWeight: 600 }}>
                            {item.conflictTypes.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(' & ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p style={{ color: '#B3B3B3', textAlign: 'center', margin: '20px 0', fontSize: '12px' }}>
              Clean import! No conflicts detected. Click <strong>Import All</strong> to import all schedules.
            </p>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel Import
          </button>
          <button className="btn btn-primary" onClick={onImportAll}>
            Import All
          </button>
        </div>
      </div>
    </div>
  );
};
