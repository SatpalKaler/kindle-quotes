export interface Highlight {
  book: string;
  author: string;
  page: string;
  location: string;
  date: string;
  text: string;
  exportAsImage?: (exportFn: () => void) => void;
} 