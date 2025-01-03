import React, { useRef, useEffect, useState } from 'react';
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
  onDimensionsChange?: (width: number, height: number) => void;
  isCustomDimension?: boolean;
  onExportImage?: (exportFn: () => Promise<void>) => void;
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
  fontColor,
  onDimensionsChange,
  isCustomDimension,
  onExportImage,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTransparent, setIsTransparent] = useState(false);

  const exportAsImage = async () => {
    if (!cardRef.current) {
      console.error('Card reference is null');
      return;
    }

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 5,
        useCORS: true,
        logging: false,
        backgroundColor: isTransparent ? 'transparent' : backgroundColor
      });
      
      return new Promise<void>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            saveAs(blob, `highlight-${highlight.book}-${index}.png`);
            resolve();
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        }, 'image/png', 1.0);
      });
    } catch (error) {
      console.error('Error exporting image:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (onExportImage) {
      onExportImage(exportAsImage);
    }
  }, [onExportImage, exportAsImage]);

  const toggleTransparency = () => {
    setIsTransparent(!isTransparent);
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
        {isCustomDimension && onDimensionsChange && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div>
              <label>Width: </label>
              <input
                type="number"
                value={width}
                onChange={(e) => onDimensionsChange(parseInt(e.target.value) || width, height)}
                style={{ width: '60px' }}
              />
            </div>
            <div>
              <label>Height: </label>
              <input
                type="number"
                value={height}
                onChange={(e) => onDimensionsChange(width, parseInt(e.target.value) || height)}
                style={{ width: '60px' }}
              />
            </div>
          </div>
        )}
        <label>
          <input type="checkbox" id="transparentBackground" onChange={toggleTransparency} /> Transparent Background
        </label>
      </div>
      
      <div 
        ref={cardRef}
        style={{
          backgroundColor: isTransparent ? 'transparent' : backgroundColor,
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
          position: 'relative',
        }}>
          <p style={{ 
            fontSize: `${fontSize}px`,
            lineHeight: '1.4',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: fontColor,
          }}>
            "{highlight.text}"
          </p>
          <div style={{
            fontSize: `${metadataFontSize}px`,
            textAlign: metadataHorizontalAlign as 'left' | 'center' | 'right',
            width: '100%',
            color: fontColor,
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