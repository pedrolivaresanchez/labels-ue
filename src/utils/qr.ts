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
        type: 'svg'
      });
      return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;
    }
    else if (format === 'pdf') {
      const dataUrl = await QRCode.toDataURL(wineUrl, qrOptions);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Código QR para su vino', 105, 20, { align: 'center' });
      
      // Calculate position to center the QR on the page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const qrWidth = 100; // QR width in mm
      const xPos = (pageWidth - qrWidth) / 2;
      
      pdf.addImage(dataUrl, 'PNG', xPos, 30, qrWidth, qrWidth);
      
      return pdf.output('datauristring');
    }
    
    throw new Error(`Formato no soportado: ${format}`);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}; 