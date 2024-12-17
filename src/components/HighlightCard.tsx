import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { Highlight } from '../types/Highlight';

interface Props {
  index: number;
  highlight: Highlight;
  backgroundColor: string;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const HighlightCard: React.FC<Props> = ({
  index,
  highlight,
  backgroundColor,
  width,
  height,
  fontSize,
  fontFamily,
  isSelected,
  onSelect,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    if (cardRef.current) {
      const canvas = await html2canvas(cardRef.current);
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `highlight-${highlight.book}-${index}.jpeg`);
        }
      });
    }
  };

  return (
    <div className={`highlight-card ${isSelected ? 'selected' : ''}`}>
      <div className="card-header">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
        />
        <button onClick={exportAsImage}>Export</button>
      </div>
      
      <div 
        ref={cardRef}
        style={{
          backgroundColor,
          padding: '40px',
          width: `${width}px`,
          height: `${height}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontFamily,
        }}
      >
        <p className="quote" style={{ fontSize: `${fontSize}px` }}>
          "{highlight.text}"
        </p>
        <div className="metadata">
          <p>Page {highlight.page}</p>
          <p>{highlight.book}</p>
          <p>{highlight.author}</p>
        </div>
      </div>
    </div>
  );
}; 