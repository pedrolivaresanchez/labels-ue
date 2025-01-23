import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const BUCKET_NAME = 'wine-images';
const MAX_IMAGE_DIMENSIONS = 3000;

export async function uploadWineImage(file: File, wineId: string) {
  try {
    console.log('Starting image upload process...');
    console.log('File type:', file.type);
    console.log('File size:', file.size);

    // Validate file type
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      throw new Error('Tipo de archivo no válido. Por favor, sube una imagen JPG, PNG o WebP.');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('La imagen es demasiado grande. El tamaño máximo es 2MB.');
    }

    // Create image element to check dimensions
    const image = await createImageFromFile(file);
    console.log('Image dimensions:', { width: image.width, height: image.height });
    
    if (image.width < 400 || image.height < 400) {
      throw new Error('La imagen es demasiado pequeña. Las dimensiones mínimas son 400x400px.');
    }
    if (image.width > MAX_IMAGE_DIMENSIONS || image.height > MAX_IMAGE_DIMENSIONS) {
      throw new Error(`La imagen es demasiado grande. Las dimensiones máximas son ${MAX_IMAGE_DIMENSIONS}x${MAX_IMAGE_DIMENSIONS}px.`);
    }

    const supabase = createClientComponentClient();
    console.log('Supabase client created');

    // Upload file with specific options
    const fileExt = file.name.split('.').pop();
    const fileName = `${wineId}-${Date.now()}.${fileExt}`;
    console.log('Attempting to upload file:', fileName);

    const { error: uploadError, data } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw new Error(`Error al subir la imagen: ${uploadError.message}`);
    }

    console.log('Upload successful, data:', data);

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error('Detailed error information:', {
      error,
      message: error.message,
      name: error.name,
      stack: error.stack,
      details: error.details,
      statusCode: error.statusCode,
      hint: error.hint
    });
    throw error instanceof Error ? error : new Error('Error desconocido al subir la imagen');
  }
}

export async function deleteWineImage(imageUrl: string) {
  try {
    console.log('Starting image deletion process...');
    const supabase = createClientComponentClient();
    const fileName = imageUrl.split('/').pop();
    if (!fileName) throw new Error('Invalid image URL');

    console.log('Attempting to delete file:', fileName);
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([fileName]);

    if (error) {
      console.error('Delete error details:', error);
      throw new Error(`Error al eliminar la imagen: ${error.message}`);
    }
    console.log('File deleted successfully');
  } catch (error: any) {
    console.error('Detailed delete error information:', {
      error,
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error instanceof Error ? error : new Error('Error desconocido al eliminar la imagen');
  }
}

// Helper function to create an image element from a file
function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const image = new Image();

    reader.onload = (e) => {
      image.src = e.target?.result as string;
      image.onload = () => resolve(image);
      image.onerror = reject;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
} 