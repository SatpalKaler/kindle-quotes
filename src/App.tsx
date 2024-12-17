import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { HighlightCard } from './components/HighlightCard';
import { parseClippings } from './utils/parser';
import { Highlight } from './types/Highlight';
import { ScreenDimension, SCREEN_DIMENSIONS } from './types/Dimensions';
import './App.css';

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');
  const [selectedDimension, setSelectedDimension] = useState<ScreenDimension>(SCREEN_DIMENSIONS[0]);
  const [customDimensions, setCustomDimensions] = useState({ width: 800, height: 400 });
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [selectedHighlights, setSelectedHighlights] = useState<Set<number>>(new Set());

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
    // We'll implement this in HighlightCard
    for (const _highlight of selectedCards) {
      // Trigger export for each selected card
      // Implementation will be shown in HighlightCard
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Kindle Highlights to Wallpaper</h1>
      </header>
      
      <div className="controls">
        <FileUpload onFileUpload={handleFileUpload} />
        
        <div className="control-group">
          <label>Background Color:</label>
          <input 
            type="color" 
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>Screen Size:</label>
          <select onChange={handleDimensionChange} value={selectedDimension.name}>
            {SCREEN_DIMENSIONS.map(dim => (
              <option key={dim.name} value={dim.name}>{dim.name}</option>
            ))}
          </select>
        </div>

        {selectedDimension.name === 'Custom' && (
          <div className="control-group">
            <input
              type="number"
              placeholder="Width"
              value={customDimensions.width}
              onChange={(e) => setCustomDimensions(prev => ({
                ...prev,
                width: parseInt(e.target.value)
              }))}
            />
            <input
              type="number"
              placeholder="Height"
              value={customDimensions.height}
              onChange={(e) => setCustomDimensions(prev => ({
                ...prev,
                height: parseInt(e.target.value)
              }))}
            />
          </div>
        )}

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
          
          <input
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            min="12"
            max="72"
          />
        </div>

        <button 
          onClick={exportSelected}
          disabled={selectedHighlights.size === 0}
        >
          Export Selected ({selectedHighlights.size})
        </button>
      </div>

      <div className="highlights-container">
        {highlights.map((highlight, index) => (
          <HighlightCard 
            key={index}
            index={index}
            highlight={highlight}
            backgroundColor={backgroundColor}
            width={(selectedDimension.name === 'Custom' ? customDimensions.width : selectedDimension.width) * 0.2}
            height={(selectedDimension.name === 'Custom' ? customDimensions.height : selectedDimension.height) * 0.2}
            fontSize={fontSize * 0.2}
            fontFamily={fontFamily}
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
    </div>
  );
}

export default App;
