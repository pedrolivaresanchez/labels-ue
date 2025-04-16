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
      // Usar la misma versión para todos los formatos
      // QRCode v1 para tipos 1-40 (21x21 a 177x177 módulos)
      // Nivel H = alta corrección de errores (30%)
      const typeNumber = 4; // Normalmente suficiente para URLs
      const qr = qrcode(typeNumber, 'H');
      qr.addData(wineUrl);
      qr.make();
      
      // Obtener la matriz de módulos QR
      const moduleCount = qr.getModuleCount();
      const cellSize = Math.floor(1000 / moduleCount);
      const totalSize = cellSize * moduleCount;
      
      // Añadir un margen del 5% alrededor del QR
      const margin = Math.floor(totalSize * 0.05);
      const svgSize = totalSize + (margin * 2);
      
      // Generar rectángulos para cada celda oscura
      let paths = '';
      for (let row = 0; row < moduleCount; row++) {
        for (let col = 0; col < moduleCount; col++) {
          if (qr.isDark(row, col)) {
            const x = col * cellSize + margin;
            const y = row * cellSize + margin;
            paths += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}"/>`;
          }
        }
      }
      
      // Crear un SVG con elementos vectoriales editables
      const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1000" height="1000" viewBox="0 0 ${svgSize} ${svgSize}">
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