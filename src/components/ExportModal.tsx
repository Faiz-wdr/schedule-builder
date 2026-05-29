import React, { useState, useEffect } from 'react';
import { X, FileDown, FileText, Image, FileSpreadsheet, ListOrdered } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onExport: (format: 'pdf' | 'jpg' | 'xlsx', order: 'time' | 'stage' | 'category') => void;
  onClose: () => void;
  defaultOrder?: 'time' | 'stage' | 'category';
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onExport,
  onClose,
  defaultOrder = 'time',
}) => {
  const [format, setFormat] = useState<'pdf' | 'jpg' | 'xlsx'>('pdf');
  const [order, setOrder] = useState<'time' | 'stage' | 'category'>('time');

  // Synchronize local order with active preview sort when modal opens
  useEffect(() => {
    if (isOpen) {
      setOrder(defaultOrder);
    }
  }, [isOpen, defaultOrder]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '440px' }}>
        <div className="modal-header">
          <div className="top-nav-logo" style={{ color: '#4D90FE', gap: '8px' }}>
            <FileDown size={16} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFF', background: 'none', WebkitTextFillColor: 'initial' }}>
              Export Festival Schedule
            </span>
          </div>
          <button className="action-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Format selection */}
          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '6px' }}>Select Format</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              
              {/* PDF card */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${format === 'pdf' ? '#4D90FE' : '#3C3C3C'}`,
                  backgroundColor: format === 'pdf' ? 'rgba(77, 144, 254, 0.08)' : '#252526',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                <input
                  type="radio"
                  name="export-format"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                  style={{ cursor: 'pointer', accentColor: '#4D90FE' }}
                />
                <FileText size={18} style={{ color: format === 'pdf' ? '#4D90FE' : '#B3B3B3' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, display: 'block', fontSize: '12px' }}>PDF Document (.pdf)</span>
                  <span style={{ fontSize: '10px', color: '#B3B3B3' }}>Printable document layout (black text on white page)</span>
                </div>
              </label>

              {/* JPG card */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${format === 'jpg' ? '#4D90FE' : '#3C3C3C'}`,
                  backgroundColor: format === 'jpg' ? 'rgba(77, 144, 254, 0.08)' : '#252526',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                <input
                  type="radio"
                  name="export-format"
                  checked={format === 'jpg'}
                  onChange={() => setFormat('jpg')}
                  style={{ cursor: 'pointer', accentColor: '#4D90FE' }}
                />
                <Image size={18} style={{ color: format === 'jpg' ? '#4D90FE' : '#B3B3B3' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, display: 'block', fontSize: '12px' }}>JPG Image (.jpg)</span>
                  <span style={{ fontSize: '10px', color: '#B3B3B3' }}>High-fidelity screenshot for WhatsApp & notice boards</span>
                </div>
              </label>

              {/* XLSX card */}
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: `1px solid ${format === 'xlsx' ? '#4D90FE' : '#3C3C3C'}`,
                  backgroundColor: format === 'xlsx' ? 'rgba(77, 144, 254, 0.08)' : '#252526',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease-in-out',
                }}
              >
                <input
                  type="radio"
                  name="export-format"
                  checked={format === 'xlsx'}
                  onChange={() => setFormat('xlsx')}
                  style={{ cursor: 'pointer', accentColor: '#4D90FE' }}
                />
                <FileSpreadsheet size={18} style={{ color: format === 'xlsx' ? '#4D90FE' : '#B3B3B3' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, display: 'block', fontSize: '12px' }}>Excel Spreadsheet (.xlsx)</span>
                  <span style={{ fontSize: '10px', color: '#B3B3B3' }}>Raw spreadsheet columns to open in MS Excel/Sheets</span>
                </div>
              </label>
            </div>
          </div>

          {/* Layout Sorting selection */}
          <div className="form-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <ListOrdered size={12} style={{ color: '#B3B3B3' }} />
              <label className="form-label">Layout Sorting Order</label>
            </div>
            
            <select
              value={order}
              onChange={(e) => setOrder(e.target.value as any)}
              className="form-select"
              style={{ width: '100%', height: '30px' }}
            >
              <option value="time">Time Based (Chronological by Start Time)</option>
              <option value="stage">Stage Wise (Grouped primarily by Stage number)</option>
              <option value="category">Category Wise (Grouped primarily by Age Group Category)</option>
            </select>
            
            <p style={{ fontSize: '10px', color: '#B3B3B3', marginTop: '4px' }}>
              {format === 'xlsx'
                ? 'The spreadsheet rows will be pre-sorted in this order.'
                : 'The printed tables will be visually structured and grouped in this order.'}
            </p>
          </div>

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onExport(format, order)}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
