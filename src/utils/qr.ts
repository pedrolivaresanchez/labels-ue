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
      // Generar el QR como SVG
      const svgString = await QRCode.toString(wineUrl, {
        type: 'svg',
        errorCorrectionLevel: 'H',
        margin: 1,
      });
      
      // Extraer el viewBox del SVG original para obtener dimensiones correctas
      const viewBoxMatch = svgString.match(/viewBox=['"]([^'"]*)['"]/);
      let viewBox = "0 0 29 29";
      if (viewBoxMatch && viewBoxMatch[1]) {
        viewBox = viewBoxMatch[1];
      }
      
      // Eliminar las etiquetas svg de apertura y cierre
      const contentOnly = svgString
        .replace(/<\?xml[^>]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '');
      
      // Crear un nuevo SVG con dimensiones fijas y correctas
      const enhancedSvg = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg 
   xmlns="http://www.w3.org/2000/svg"
   width="1000"
   height="1000"
   viewBox="${viewBox}"
   version="1.1">
   <rect width="100%" height="100%" fill="white"/>
   ${contentOnly}
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