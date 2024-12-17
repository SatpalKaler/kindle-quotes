import { Highlight } from '../types/Highlight';

export const parseClippings = (content: string): Highlight[] => {
  const highlights: Highlight[] = [];
  const sections = content.split('==========').filter(section => section.trim());

  sections.forEach(section => {
    const lines = section.trim().split('\n').filter(line => line.trim());
    
    if (lines.length >= 3) {
      // Parse book and author
      const bookLine = lines[0];
      const [book, author] = bookLine.split('(').map(s => s.trim());
      const cleanAuthor = author ? author.replace(')', '') : '';

      // Parse metadata
      const metadataLine = lines[1];
      const pageMatch = metadataLine.match(/page (\d+)/);
      const locationMatch = metadataLine.match(/Location (\d+-\d+)/);
      const dateMatch = metadataLine.match(/Added on (.+)/);

      // Parse highlight text
      const text = lines.slice(2).join(' ').trim();

      highlights.push({
        book: book,
        author: cleanAuthor,
        page: pageMatch ? pageMatch[1] : '',
        location: locationMatch ? locationMatch[1] : '',
        date: dateMatch ? dateMatch[1] : '',
        text: text
      });
    }
  });

  return highlights;
}; 