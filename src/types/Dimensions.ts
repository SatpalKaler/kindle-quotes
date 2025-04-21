export interface ScreenDimension {
  name: string;
  width: number;
  height: number;
  isCustom?: boolean;
  editable?: boolean;
}

export const SCREEN_DIMENSIONS: ScreenDimension[] = [
  { name: 'Kindle Paperwhite 4 (10th Gen)', width: 1072, height: 1448 },
  { name: 'Kindle 10 (10th Gen)', width: 600, height: 800 },
  { name: 'Kindle Oasis 3 (10th Gen)', width: 1264, height: 1680 },
  { name: 'Kindle Paperwhite 5 (11th Gen)', width: 1236, height: 1648 },
  { name: 'Kindle Paperwhite 5 Signature Edition (11th Gen)', width: 1236, height: 1648 },
  { name: 'Kindle 11 (11th Gen)', width: 1072, height: 1448 },
  { name: 'Kindle Scribe (11th Gen)', width: 1860, height: 2480 },
  { name: 'Kindle 11 (2024) (11th Gen)', width: 1072, height: 1448 },
  { name: 'Kindle Paperwhite 6 (12th Gen)', width: 1264, height: 1680 },
  { name: 'Kindle Paperwhite 6 Signature Edition (12th Gen)', width: 1264, height: 1680 },
  { name: 'Kindle Colorsoft Signature Edition (12th Gen)', width: 1264, height: 1680 },
  { name: 'Kindle Scribe (2024) (12th Gen)', width: 1860, height: 2480 },
  { name: 'iPhone 12/13', width: 1080, height: 2536 },
  { name: 'iPhone 14/15/16', width: 1170, height: 2532 },
  { name: 'iPhone 12/13/14/15/16 Pro', width: 1170, height: 2532 },
  { name: 'iPhone 11/12/13 Pro Max', width: 1284, height: 2778 },
  { name: 'iPhone 14/15/16 Pro Max', width: 1290, height: 2796 },
  { name: 'Samsung S23 Ultra', width: 1440, height: 3088 },
  { name: 'Samsung S23', width: 1080, height: 2340 },
  { name: 'Google Pixel 7 Pro', width: 1440, height: 3120 },
  { name: 'Google Pixel 7', width: 1080, height: 2400 },
  { name: 'iPad Pro 12.9"', width: 2048, height: 2732 },
  { name: 'iPad Air', width: 1640, height: 2360 },
  { name: 'MacBook Pro 16"', width: 3456, height: 2234 },
  { name: 'MacBook Air 13"', width: 2560, height: 1664 },
  { name: '4K Desktop', width: 3840, height: 2160 },
  { name: '1080p Desktop', width: 1920, height: 1080 },
  { name: 'Instagram Post', width: 1080, height: 1080 },
  { name: 'Instagram Story', width: 1080, height: 1920 },
 
  { 
    name: 'Custom', 
    width: 1000, 
    height: 2000, 
    isCustom: true, 
    editable: true 
  }
];

// Preview dimensions (smaller display size for the cards)
export const PREVIEW_SCALE = 0.25; // This will make cards show at 25% of actual size