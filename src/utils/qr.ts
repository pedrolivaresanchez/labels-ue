import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

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
      const svgString = await QRCode.toString(wineUrl, {
        ...qrOptions,
        type: 'svg',
        margin: 1,
        errorCorrectionLevel: 'H'
      });
      
      // Añadir XML declaration y viewport para asegurar que el SVG es válido
      const enhancedSvg = `<?xml version="1.0" standalone="yes"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1000" height="1000" viewBox="0 0 1000 1000">
  <rect x="0" y="0" width="1000" height="1000" fill="#ffffff"/>
  <g transform="scale(${1000 / (33 + 2 * 1)})" transform-origin="center">
    ${svgString.replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
</svg>`;
      
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(enhancedSvg)}`;
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