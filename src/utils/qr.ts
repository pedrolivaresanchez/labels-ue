import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import qrcode from 'qrcode-generator';

export type QRFormat = 'png' | 'svg' | 'pdf';

export const generateQRCode = async (wineId: string, format: QRFormat = 'png'): Promise<string> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://app.vinoveo.com';
    const wineUrl = `${baseUrl}/public/wines/${wineId}`;
    
    console.log('Generated URL:', wineUrl); // For debugging
    
    const qrOptions = {
      width: 1000,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    };

    if (format === 'png') {
      return await QRCode.toDataURL(wineUrl, qrOptions);
    } 
    else if (format === 'svg') {
      // Crear un código QR editable con elementos vectoriales
      const qr = qrcode(0, 'H'); // 0 = la versión mínima, H = corrección de errores alta
      qr.addData(wineUrl);
      qr.make();
      
      // Obtener la matriz de módulos QR
      const moduleCount = qr.getModuleCount();
      const cellSize = Math.floor(1000 / moduleCount);
      const totalSize = cellSize * moduleCount;
      
      // Generar rectángulos para cada celda oscura
      let paths = '';
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = col * cellSize;
            const y = row * cellSize;
            paths += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}"/>`;
          }
        }
      }
      
      // Crear un SVG con elementos vectoriales editables
      const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1000" height="1000" viewBox="0 0 ${totalSize} ${totalSize}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  <g fill="#000000">
    ${paths}
  </g>
</svg>`;
      
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
    }
    else if (format === 'pdf') {
      const dataUrl = await QRCode.toDataURL(wineUrl, qrOptions);
      
      // Crear un PDF cuadrado del tamaño exacto del QR
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 100] // Formato cuadrado personalizado de 100x100mm
      });
      
      // Añadir el QR ocupando todo el espacio disponible
      pdf.addImage(dataUrl, 'PNG', 0, 0, 100, 100);
      
      return pdf.output('datauristring');
    }
    
    throw new Error(`Formato no soportado: ${format}`);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}; 