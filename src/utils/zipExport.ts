import JSZip from 'jszip';

export async function exportImagesAsZip(images: { filename: string; dataUrl: string }[], zipName: string = 'highlights.zip') {
  const zip = new JSZip();
  images.forEach(({ filename, dataUrl }) => {
    // Remove the data URL prefix to get the base64 string
    const base64 = dataUrl.split(',')[1];
    zip.file(filename, base64, { base64: true });
  });
  const blob = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = zipName;
  link.click();
  // Clean up
  setTimeout(() => URL.revokeObjectURL(link.href), 5000);
}
