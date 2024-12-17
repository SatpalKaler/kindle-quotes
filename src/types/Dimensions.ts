export interface ScreenDimension {
  name: string;
  width: number;
  height: number;
}

export const SCREEN_DIMENSIONS: ScreenDimension[] = [
  { name: 'iPhone 14 Pro Max', width: 1290, height: 2796 },
  { name: 'iPhone 14/13', width: 1170, height: 2532 },
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
  { name: 'Custom', width: 800, height: 400 }
];

// Preview dimensions (smaller display size for the cards)
export const PREVIEW_SCALE = 0.25; // This will make cards show at 25% of actual size 