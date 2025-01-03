import React from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onExport: () => Promise<void>;
  isExporting?: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ 
  isOpen, 
  onClose, 
  selectedCount, 
  onExport,
  isExporting = false 
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Export Selected Highlights</h2>
        <p className="text-black mb-6">You have selected {selectedCount} highlights to export.</p>
        <div className="modal-buttons">
          <button 
            className="export-button" 
            onClick={onExport}
            disabled={isExporting}
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </button>
          <button 
            className="close-button" 
            onClick={onClose}
            disabled={isExporting}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal; 