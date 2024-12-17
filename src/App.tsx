import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { HighlightCard } from './components/HighlightCard';
import { parseClippings } from './utils/parser';
import { Highlight } from './types/Highlight';
import { ScreenDimension, SCREEN_DIMENSIONS } from './types/Dimensions';
import './App.css';
import ExportModal from './components/ExportModal';

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [selectedDimension, setSelectedDimension] = useState<ScreenDimension>(SCREEN_DIMENSIONS[0]);
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [selectedHighlights, setSelectedHighlights] = useState<Set<number>>(new Set());
  const [metadataFontSize, setMetadataFontSize] = useState(16);
  const [quoteHorizontalAlign, setQuoteHorizontalAlign] = useState('center');
  const [quoteVerticalAlign, setQuoteVerticalAlign] = useState('center');
  const [metadataHorizontalAlign, setMetadataHorizontalAlign] = useState('right');
  const [metadataVerticalAlign, setMetadataVerticalAlign] = useState('bottom');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFileUpload = (content: string) => {
    const parsedHighlights = parseClippings(content);
    setHighlights(parsedHighlights);
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = SCREEN_DIMENSIONS.find(d => d.name === e.target.value);
    if (selected) setSelectedDimension(selected);
  };

  const exportSelected = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="App">
      <header>
        <h1>Kindle Highlights to Wallpaper</h1>
      </header>
      
      <div className="controls">
        {/* Layer 1: File, Colors, Screen Size */}
        <div className="control-layer">
          <div className="control-group">
            <FileUpload onFileUpload={handleFileUpload} />
            
            <label>Background Color:</label>
            <input 
              type="color" 
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            />
            
            <label>Font Color:</label>
            <input 
              type="color" 
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
            />
            
            <label>Screen Size:</label>
            <select onChange={handleDimensionChange} value={selectedDimension.name}>
              {SCREEN_DIMENSIONS.map(dim => (
                <option key={dim.name} value={dim.name}>{dim.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Layer 2: Font Controls */}
        <div className="control-layer">
          <div className="control-group">
            <label>Font:</label>
            <select 
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
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
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              min="12"
              max="72"
            />

            <label>Metadata Size:</label>
            <input
              type="number"
              value={metadataFontSize}
              onChange={(e) => setMetadataFontSize(parseInt(e.target.value))}
              min="8"
              max="48"
            />
          </div>
        </div>

        {/* Layer 3: Alignment Controls */}
        <div className="control-layer">
          <div className="control-group">
            <label>Quote Align:</label>
            <div className="icon-group">
              <div 
                className={`icon ${quoteHorizontalAlign === 'left' ? 'active' : ''}`} 
                onClick={() => setQuoteHorizontalAlign('left')}
              >
                &#x2190;
              </div>
              <div 
                className={`icon ${quoteHorizontalAlign === 'center' ? 'active' : ''}`} 
                onClick={() => setQuoteHorizontalAlign('center')}
              >
                &#x25B6;
              </div>
              <div 
                className={`icon ${quoteHorizontalAlign === 'right' ? 'active' : ''}`} 
                onClick={() => setQuoteHorizontalAlign('right')}
              >
                &#x2192;
              </div>
            </div>

            <div className="icon-group">
              <div 
                className={`icon ${quoteVerticalAlign === 'top' ? 'active' : ''}`} 
                onClick={() => setQuoteVerticalAlign('top')}
              >
                &#x25B2;
              </div>
              <div 
                className={`icon ${quoteVerticalAlign === 'center' ? 'active' : ''}`} 
                onClick={() => setQuoteVerticalAlign('center')}
              >
                &#x25BC;
              </div>
              <div 
                className={`icon ${quoteVerticalAlign === 'bottom' ? 'active' : ''}`} 
                onClick={() => setQuoteVerticalAlign('bottom')}
              >
                &#x25BC;
              </div>
            </div>

            <label>Metadata Align:</label>
            <div className="icon-group">
              <div 
                className={`icon ${metadataHorizontalAlign === 'left' ? 'active' : ''}`} 
                onClick={() => setMetadataHorizontalAlign('left')}
              >
                &#x2190;
              </div>
              <div 
                className={`icon ${metadataHorizontalAlign === 'center' ? 'active' : ''}`} 
                onClick={() => setMetadataHorizontalAlign('center')}
              >
                &#x25B6;
              </div>
              <div 
                className={`icon ${metadataHorizontalAlign === 'right' ? 'active' : ''}`} 
                onClick={() => setMetadataHorizontalAlign('right')}
              >
                &#x2192;
              </div>
            </div>

            <div className="icon-group">
              <div 
                className={`icon ${metadataVerticalAlign === 'top' ? 'active' : ''}`} 
                onClick={() => setMetadataVerticalAlign('top')}
              >
                &#x25B2;
              </div>
              <div 
                className={`icon ${metadataVerticalAlign === 'center' ? 'active' : ''}`} 
                onClick={() => setMetadataVerticalAlign('center')}
              >
                &#x25BC;
              </div>
              <div 
                className={`icon ${metadataVerticalAlign === 'bottom' ? 'active' : ''}`} 
                onClick={() => setMetadataVerticalAlign('bottom')}
              >
                &#x25BC;
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Button Popup */}
      {selectedHighlights.size > 0 && (
        <div className="export-popup">
          <button 
            onClick={exportSelected}
            className="export-button"
          >
            Export Selected ({selectedHighlights.size})
          </button>
        </div>
      )}

      <div className="highlights-container">
        {highlights.map((highlight, index) => (
          <HighlightCard 
            key={index}
            index={index}
            highlight={highlight}
            backgroundColor={backgroundColor}
            width={selectedDimension.width * 0.2}
            height={selectedDimension.height * 0.2}
            fontSize={fontSize * 0.2}
            fontFamily={fontFamily}
            metadataFontSize={metadataFontSize * 0.2}
            quoteHorizontalAlign={quoteHorizontalAlign}
            quoteVerticalAlign={quoteVerticalAlign}
            metadataHorizontalAlign={metadataHorizontalAlign}
            metadataVerticalAlign={metadataVerticalAlign}
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
          />
        ))}
      </div>

      <ExportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        selectedCount={selectedHighlights.size} 
      />
    </div>
  );
}

export default App;
