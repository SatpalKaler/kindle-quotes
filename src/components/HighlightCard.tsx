import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Highlight } from '../types/Highlight';

interface Props {
  highlight: Highlight;
  backgroundColor: string;
}

export const HighlightCard: React.FC<Props> = ({ highlight, backgroundColor }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `highlight-${Date.now()}.jpeg`);
        }
      });
    }
  };

  return (
    <div className="highlight-card">
      <div 
        ref={cardRef}
        style={{
          backgroundColor,
          padding: '40px',
          width: '800px',
          height: '400px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <p className="quote">"{highlight.text}"</p>
        <div className="metadata">
          <p>Page {highlight.page}</p>
          <p>{highlight.book}</p>
          <p>{highlight.author}</p>
        </div>
      </div>
      <button onClick={exportAsImage}>Export as Image</button>
    </div>
  );
}; 