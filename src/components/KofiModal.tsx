import React from 'react';

interface KofiModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const KofiModal: React.FC<KofiModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>&times;</button>
        <iframe 
          id='kofiframe' 
          src='https://ko-fi.com/satpalkaler' 
          style={{
            border: 'none',
            width: '100%',
            padding: '1px',
            background: '#f9f9f9',
            height: '600px'
          }}
          title='Ko-fi donations'
        />
      </div>
    </div>
  );
};

export default KofiModal; 