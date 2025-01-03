import React, { useState, useEffect } from 'react';

export const DeviceWarning: React.FC = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (!isSmallScreen || dismissed) return null;

  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999,
      }} />
      <div style={{
        position: 'fixed',
        top: '300px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: '4px',
        padding: '15px 20px',
        zIndex: 1000,
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        maxWidth: '90%',
        width: '400px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ margin: 0, color: '#856404' }}>
            ⚠️ For the best experience, please use this application on a computer.
          </p>
          <button 
            onClick={() => setDismissed(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '10px',
              color: '#856404',
              fontSize: '20px',
              padding: '0 5px',
            }}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}; 