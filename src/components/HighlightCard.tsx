import React, { useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
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
  onExportImage?: (exportFn: () => Promise<string | null>) => void;
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

  const exportAsImage = useCallback(async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 5,
        useCORS: true,
        logging: false,
        backgroundColor
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error exporting image:', error);
      return null;
    }
  }, [backgroundColor, index]);

  useEffect(() => {
    if (onExportImage) {
      // The prop now expects a function returning Promise<string | null>
      onExportImage(exportAsImage);
    }
  }, [exportAsImage, onExportImage]);

  return (
    <div
      className={`highlight-card ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-header">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          onClick={e => e.stopPropagation()} // Prevents card click when clicking checkbox
        />
        {isCustomDimension && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div>
              <label>Width: </label>
              <input
                type="number"
                value={width}
                onChange={(e) => onDimensionsChange?.(parseInt(e.target.value) || width, height)}
                style={{ width: '60px' }}
              />
            </div>
            <div>
              <label>Height: </label>
              <input
                type="number"
                value={height}
                onChange={(e) => onDimensionsChange?.(width, parseInt(e.target.value) || height)}
                style={{ width: '60px' }}
              />
            </div>
          </div>
        )}
      </div>
      
      <div 
        ref={cardRef}
        style={{
          backgroundColor: backgroundColor,
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
            fontWeight: 'bold',
            fontStyle: 'italic',
          }}>
            {highlight.text}
          </p>
          <div style={{
            fontSize: `${metadataFontSize}px`,
            textAlign: metadataHorizontalAlign as 'left' | 'center' | 'right',
            width: '100%',
            color: fontColor,
          }}>
            {highlight.page && <p style={{ margin: '1px 0', color: fontColor }}>Page {highlight.page}</p>}
            <p style={{ margin: '1px 0', color: fontColor }}>{highlight.book}</p>
            <p style={{ margin: '1px 0', color: fontColor }}>{highlight.author}</p>
          </div>
        </div>
      </div>
    </div>
  );
}; 