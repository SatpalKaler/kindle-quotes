import React, { ChangeEvent } from 'react';

interface Props {
  onFileUpload: (highlights: string) => void;
}

export const FileUpload: React.FC<Props> = ({ onFileUpload }) => {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onFileUpload(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".txt"
        onChange={handleFileChange}
        className="file-input"
      />
    </div>
  );
}; 