import QRCode from 'qrcode';

export const generateQRCode = async (wineId: string): Promise<string> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://app.vinoveo.com';
    const wineUrl = `${baseUrl}/public/wines/${wineId}`;
    
    console.log('Generated URL:', wineUrl); // For debugging
    
    const qrDataUrl = await QRCode.toDataURL(wineUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    });
    
    return qrDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}; 