import React from 'react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
}

const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, selectedCount }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Export Selected Highlights</h2>
        <p>You have selected {selectedCount} highlights to export.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ExportModal; 