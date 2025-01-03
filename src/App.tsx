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
  const [fontSize, setFontSize] = useState(75);
  const [fontFamily, setFontFamily] = useState('Montserrat');
  const [selectedHighlights, setSelectedHighlights] = useState<Set<number>>(new Set());
  const [metadataFontSize, setMetadataFontSize] = useState(50);
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

  const exportSelected = async () => {
    const selectedCards = Array.from(selectedHighlights).map(index => highlights[index]);
    
    // Log the selected cards for debugging
    console.log('Selected Cards:', selectedCards);

    for (const highlight of selectedCards) {
      if (highlight) {
        // Trigger export for each selected card
        if (typeof highlight.exportAsImage === 'function') {
          highlight.exportAsImage(() => {
            console.log('Exporting highlight:', highlight);
            // Add your export logic here
          });
        } else {
          console.error('exportAsImage is not a function for highlight:', highlight);
        }
      }
    }
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <header className="centered-header">
        <h1>Kindle Highlights to Wallpaper</h1>
      </header>
      
      <div className="main-content">
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
                min="50"
                max="120"
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

        <div className="highlights-grid">
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
              quoteHorizontalAlign="center"
              quoteVerticalAlign="center"
              metadataHorizontalAlign="right"
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
              onExportImage={(exportFn) => {
                // Check if highlight is defined and has exportAsImage property
                if (highlight && typeof highlight.exportAsImage === 'function') {
                    highlight.exportAsImage = exportFn;
                } else {
                    console.error('highlight is undefined or exportAsImage is not a function', highlight);
                }
              }}
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
