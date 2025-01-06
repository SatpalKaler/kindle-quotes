import { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { HighlightCard } from './components/HighlightCard';
import { parseClippings } from './utils/parser';
import { Highlight } from './types/Highlight';
import { ScreenDimension, SCREEN_DIMENSIONS } from './types/Dimensions';
import './App.css';
import ExportModal from './components/ExportModal';
import { DeviceWarning } from './components/DeviceWarning';

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [selectedDimension, setSelectedDimension] = useState<ScreenDimension>(SCREEN_DIMENSIONS[0]);
  const [fontSize, setFontSize] = useState(75);
  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [selectedHighlights, setSelectedHighlights] = useState<Set<number>>(new Set());
  const [metadataFontSize, setMetadataFontSize] = useState(50);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [exportFunctions, setExportFunctions] = useState<{ [key: number]: () => Promise<void> }>({});
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [useRandomColors, setUseRandomColors] = useState(false);
  const [randomColorMap, setRandomColorMap] = useState<{[key: number]: string}>({});
  const [hasFileUploaded, setHasFileUploaded] = useState(false);

  const calculateContrastRatio = (color1: string, color2: string) => {
    // Convert hex to RGB
    const getRGB = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return [r, g, b];
    };

    // Calculate relative luminance
    const getLuminance = (r: number, g: number, b: number) => {
      const [rs, gs, bs] = [r/255, g/255, b/255].map(c => 
        c <= 0.03928 ? c/12.92 : Math.pow((c + 0.055)/1.055, 2.4)
      );
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const [r1, g1, b1] = getRGB(color1);
    const [r2, g2, b2] = getRGB(color2);
    
    const l1 = getLuminance(r1, g1, b1);
    const l2 = getLuminance(r2, g2, b2);
    
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  const generateRandomColor = () => {
    const minContrastRatio = 4.5; // WCAG AA standard for normal text
    let attempts = 0;
    let randomColor;
    
    do {
      randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      attempts++;
    } while (calculateContrastRatio(randomColor, fontColor) < minContrastRatio && attempts < 50);
    
    // If we couldn't find a good contrast after 50 attempts, darken/lighten based on font color
    if (attempts >= 50) {
      const [r, g, b] = fontColor.match(/[A-Za-z0-9]{2}/g)?.map(c => parseInt(c, 16)) || [0, 0, 0];
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      if (brightness > 128) {
        // If font is light, make background dark
        return '#' + Math.floor(Math.random()*8388607).toString(16).padStart(6, '0');
      } else {
        // If font is dark, make background light
        return '#' + (Math.floor(Math.random()*8388607) + 8388608).toString(16).padStart(6, '0');
      }
    }
    
    return randomColor;
  };

  const handleFileUpload = (content: string) => {
    const parsedHighlights = parseClippings(content);
    setHighlights(parsedHighlights);
    setHasFileUploaded(true);
    
    if (useRandomColors) {
      const newColorMap = parsedHighlights.reduce((acc, _, index) => {
        acc[index] = generateRandomColor();
        return acc;
      }, {} as {[key: number]: string});
      setRandomColorMap(newColorMap);
    }
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = SCREEN_DIMENSIONS.find(d => d.name === e.target.value);
    if (selected) setSelectedDimension(selected);
  };

  const exportSelected = async () => {
    setIsExporting(true);
    setExportProgress(0);
    const totalItems = selectedHighlights.size;
    let completed = 0;

    for (const index of selectedHighlights) {
      const exportFn = exportFunctions[index];
      if (exportFn) {
        try {
          await exportFn();
          completed++;
          setExportProgress((completed / totalItems) * 100);
        } catch (error) {
          console.error(`Error exporting highlight ${index}:`, error);
        }
      }
    }
    
    setIsExporting(false);
    setIsModalOpen(false);
  };

  const registerExportFunction = useCallback((index: number, exportFn: () => Promise<void>) => {
    setExportFunctions(prev => {
      if (prev[index] !== exportFn) {
        return { ...prev, [index]: exportFn };
      }
      return prev;
    });
  }, []);

  return (
    <div className="App">
      {!hasFileUploaded && (
        <div className="instructions-overlay">
          <div className="instructions-modal">
            <ol>
              <li>Find the MyClippings.txt document from your Kindle</li>
              <li>Click Choose File below and select the MyClippings.txt file</li>
            </ol>
            <div className="file-upload-container">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
            <img 
              src="public/kindleinstruction.jpg" 
              alt="Screenshot showing MyClippings.txt location" 
              className="instruction-image"
            />
          </div>
        </div>
      )}
      
      <DeviceWarning />
      <header className="centered-header">
        <h1 className="text-center">Kindle Highlights to Wallpaper</h1>
      </header>
      
      <div className="main-content">
        <div className="controls">
          <div className="control-layer">
            <div className="control-group">
              <div className={!hasFileUploaded ? 'disabled-controls' : ''}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label>Font Color:</label>
                  <input 
                    type="color" 
                    value={fontColor}
                    onChange={(e) => setFontColor(e.target.value)}
                    disabled={!hasFileUploaded}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <label>Background Color:</label>
                  <input 
                    type="color" 
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    disabled={isTransparent}
                  />
                </div>
<br></br>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '70px' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={isTransparent}
                      onChange={(e) => setIsTransparent(e.target.checked)}
                    />
                    Transparent
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={useRandomColors}
                      onChange={(e) => {
                        setUseRandomColors(e.target.checked);
                        if (e.target.checked) {
                          const newColorMap = highlights.reduce((acc, _, index) => {
                            acc[index] = generateRandomColor();
                            return acc;
                          }, {} as {[key: number]: string});
                          setRandomColorMap(newColorMap);
                        }
                      }}
                    />
                    Random Colors
                  </label>
                </div>
                <hr className="divider" />
                
                <label>Screen Size:</label>
                <select onChange={handleDimensionChange} value={selectedDimension.name}>
                  {SCREEN_DIMENSIONS.map(dim => (
                    <option key={dim.name} value={dim.name}>{dim.name}</option>
                  ))}
                </select>
                {selectedDimension.isCustom && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <div>
                      <label>Width: </label>
                      <input
                        type="number"
                        value={selectedDimension.width}
                        onChange={(e) => setSelectedDimension(prev => ({
                          ...prev,
                          width: parseInt(e.target.value) || prev.width
                        }))}
                        style={{ width: '80px' }}
                      />
                    </div>
                    <div>
                      <label>Height: </label>
                      <input
                        type="number"
                        value={selectedDimension.height}
                        onChange={(e) => setSelectedDimension(prev => ({
                          ...prev,
                          height: parseInt(e.target.value) || prev.height
                        }))}
                        style={{ width: '80px' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="control-layer">
            <div className="control-group">
              <label>Font:</label>
              <select 
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                disabled={!hasFileUploaded}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Roboto">Roboto</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="Merriweather">Merriweather</option>
                <option value="Lora">Lora</option>
              </select>
              
              <label>Quote Size:</label>
              <input
                type="range"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                min="50"
                max="120"
                disabled={!hasFileUploaded}
              />
              <span>{fontSize}</span>

              <label>Metadata Size:</label>
              <input
                type="range"
                value={metadataFontSize}
                onChange={(e) => setMetadataFontSize(parseInt(e.target.value))}
                min="20"
                max="120"
                disabled={!hasFileUploaded}
              />
              <span>{metadataFontSize}</span>
            </div>
          </div>
        </div>

        {selectedHighlights.size > 0 && (
          <div className="export-popup">
            <button 
              onClick={exportSelected}
              className="export-button"
              disabled={isExporting}
            >
              {isExporting 
                ? `Exporting... ${Math.round(exportProgress)}%`
                : `Export Selected (${selectedHighlights.size})`
              }
            </button>
            {isExporting && (
              <div className="progress-bar-container">
                <div 
                  className="progress-bar"
                  style={{ width: `${exportProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        <div className="highlights-grid">
          {highlights.map((highlight, index) => (
            <HighlightCard 
              key={index}
              index={index}
              highlight={highlight}
              backgroundColor={
                isTransparent 
                  ? 'transparent' 
                  : useRandomColors 
                    ? randomColorMap[index] || backgroundColor
                    : backgroundColor
              }
              width={selectedDimension.width * 0.2}
              height={selectedDimension.height * 0.2}
              fontSize={fontSize * 0.2}
              fontFamily={fontFamily}
              metadataFontSize={metadataFontSize * 0.2}
              quoteHorizontalAlign="center"
              quoteVerticalAlign="center"
              metadataHorizontalAlign="center"
              metadataVerticalAlign="bottom"
              fontColor={fontColor}
              isSelected={selectedHighlights.has(index)}
              onSelect={() => {
                setSelectedHighlights(prev => {
                  const next = new Set(prev);
                  if (next.has(index)) {
                    next.delete(index);
                  } else {
                    next.add(index);
                  }
                  return next;
                });
              }}
              onExportImage={(exportFn) => registerExportFunction(index, exportFn)}
            />
          ))}
        </div>
      </div>

      <ExportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedCount={selectedHighlights.size}
        onExport={exportSelected}
      />
    </div>
  );
}

export default App;
