import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { HighlightCard } from './components/HighlightCard';
import { parseClippings } from './utils/parser';
import { Highlight } from './types/Highlight';
import './App.css';

function App() {
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [backgroundColor, setBackgroundColor] = useState('#f0f0f0');

  const handleFileUpload = (content: string) => {
    const parsedHighlights = parseClippings(content);
    setHighlights(parsedHighlights);
  };

  return (
    <div className="App">
      <header>
        <h1>Kindle Highlights to Wallpaper</h1>
      </header>
      
      <div className="controls">
        <FileUpload onFileUpload={handleFileUpload} />
        <input 
          type="color" 
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
        />
      </div>

      <div className="highlights-container">
        {highlights.map((highlight, index) => (
          <HighlightCard 
            key={index}
            highlight={highlight}
            backgroundColor={backgroundColor}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
