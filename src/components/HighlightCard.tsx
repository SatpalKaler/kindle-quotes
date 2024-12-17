import React, { useRef } from 'react';
import ReactDOM from 'react-dom/client';
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
  metadataFontSize: number;
  quoteHorizontalAlign: string;
  quoteVerticalAlign: string;
  metadataHorizontalAlign: string;
  metadataVerticalAlign: string;
  fontColor: string;
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
  metadataFontSize,
  quoteHorizontalAlign,
  quoteVerticalAlign,
  metadataHorizontalAlign,
  metadataVerticalAlign,
  fontColor,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const exportAsImage = async () => {
    const exportDiv = document.createElement('div');
    exportDiv.style.position = 'absolute';
    exportDiv.style.left = '-9999px';
    exportDiv.style.top = '-9999px';
    document.body.appendChild(exportDiv);

    // Use the same proportions as the display version
    const fullSizeContent = (
      <div 
        style={{
          backgroundColor,
          width: `${width * 5}px`,
          height: `${height * 5}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontFamily,
          position: 'relative', // Add this for consistent positioning
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '40px',
        }}>
          <p style={{ 
            fontSize: `${fontSize * 5}px`,
            lineHeight: '1.4',
            marginBottom: '20px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            "{highlight.text}"
          </p>
          <div style={{
            fontSize: `${metadataFontSize * 5}px`,
            textAlign: 'right',
            width: '100%',
          }}>
            <p style={{ margin: '5px 0' }}>Page {highlight.page}</p>
            <p style={{ margin: '5px 0' }}>{highlight.book}</p>
            <p style={{ margin: '5px 0' }}>{highlight.author}</p>
          </div>
        </div>
      </div>
    );

    // Render the full-size version
    const root = ReactDOM.createRoot(exportDiv);
    root.render(fullSizeContent);

    // Wait a bit for rendering
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      const canvas = await html2canvas(exportDiv, {
        scale: 2, // Increase quality
        useCORS: true,
        logging: false,
      });
      
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `highlight-${highlight.book}-${index}.jpeg`);
        }
      }, 'image/jpeg', 1.0);
    } finally {
      // Clean up
      root.unmount();
      document.body.removeChild(exportDiv);
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
          width: `${width}px`,
          height: `${height}px`,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: quoteVerticalAlign === 'top' ? 'flex-start' : quoteVerticalAlign === 'bottom' ? 'flex-end' : 'center',
          alignItems: quoteHorizontalAlign === 'left' ? 'flex-start' : quoteHorizontalAlign === 'right' ? 'flex-end' : 'center',
          fontFamily,
          position: 'relative',
          overflow: 'hidden',
          maxHeight: `${height}px`,
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
          padding: '40px',
        }}>
          <p style={{ 
            fontSize: `${fontSize}px`,
            lineHeight: '1.4',
            marginBottom: '20px',
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: fontColor,
          }}>
            "{highlight.text}"
          </p>
          <div style={{
            fontSize: `${metadataFontSize}px`,
            textAlign: metadataHorizontalAlign,
            width: '100%',
            position: 'absolute',
            bottom: metadataVerticalAlign === 'bottom' ? '0' : metadataVerticalAlign === 'top' ? 'auto' : '50%',
            transform: metadataVerticalAlign === 'center' ? 'translateY(-50%)' : 'none',
          }}>
            <p style={{ margin: '5px 0', color: fontColor }}>Page {highlight.page}</p>
            <p style={{ margin: '5px 0', color: fontColor }}>{highlight.book}</p>
            <p style={{ margin: '5px 0', color: fontColor }}>{highlight.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 