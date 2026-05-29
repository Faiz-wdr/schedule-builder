import React, { useState } from 'react';
import { X, FileDown, FileText, Image } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onExport: (format: 'pdf' | 'jpg') => void;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onExport,
  onClose,
}) => {
  const [format, setFormat] = useState<'pdf' | 'jpg'>('pdf');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ width: '380px' }}>
        <div className="modal-header">
          <div className="top-nav-logo" style={{ color: '#4D90FE', gap: '8px' }}>
            <FileDown size={16} />
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#FFF', background: 'none', WebkitTextFillColor: 'initial' }}>
              Export Schedule
            </span>
          </div>
          <button className="action-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={14} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#B3B3B3', marginBottom: '16px', fontSize: '12px' }}>
            Select your preferred export format. Both formats will generate a professional printable layout (black text on a clean white background).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
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
              <FileText size={20} style={{ color: format === 'pdf' ? '#4D90FE' : '#B3B3B3' }} />
              <div>
                <span style={{ fontWeight: 600, display: 'block', fontSize: '12px' }}>PDF Document (.pdf)</span>
                <span style={{ fontSize: '10px', color: '#B3B3B3' }}>Best for high-quality multi-page printing</span>
              </div>
            </label>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px',
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
              <Image size={20} style={{ color: format === 'jpg' ? '#4D90FE' : '#B3B3B3' }} />
              <div>
                <span style={{ fontWeight: 600, display: 'block', fontSize: '12px' }}>JPG Image (.jpg)</span>
                <span style={{ fontSize: '10px', color: '#B3B3B3' }}>Best for WhatsApp sharing & notice boards</span>
              </div>
            </label>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={() => onExport(format)}>
            Download
          </button>
        </div>
      </div>
    </div>
  );
};
