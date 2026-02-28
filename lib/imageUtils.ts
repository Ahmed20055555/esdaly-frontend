/**
 * دالة مساعدة لبناء URL كامل للصور من Backend
 */
export const getImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath || imagePath.trim() === '') {
    return '/placeholder.jpg';
  }
  if (imagePath.endsWith(',') || imagePath.endsWith('/') || imagePath === '/uploads/categories') {
    return '/placeholder.jpg';
  }

  // إذا كان URL كامل بالفعل
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // الحصول على API URL من متغيرات البيئة
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005';
  const baseUrl = API_URL.replace('/api', ''); // إزالة /api إذا كان موجوداً

  // إذا كان مسار نسبي يبدأ بـ /
  if (imagePath.startsWith('/')) {
    return `${baseUrl}${imagePath}`;
  }

  // إذا كان مسار نسبي بدون /
  return `${baseUrl}/${imagePath}`;
};

/**
 * دالة لبناء URL الصورة الأولى من مصفوفة الصور
 */
export const getFirstImageUrl = (images: any[] | undefined | null, index: number = 0): string => {
  if (!images || images.length === 0) {
    return '/placeholder.jpg';
  }

  const targetImage = images[index] || images[0];

  if (!targetImage) {
    return '/placeholder.jpg';
  }

  let imagePath: string;

  if (typeof targetImage === 'string') {
    imagePath = targetImage.trim();
  } else if (targetImage?.url) {
    imagePath = String(targetImage.url).trim();
  } else if (targetImage?.path) {
    imagePath = String(targetImage.path).trim();
  } else if (targetImage) {
    imagePath = String(targetImage).trim();
  } else {
    return '/placeholder.jpg';
  }

  // إذا كان المسار فارغاً بعد trim
  if (!imagePath || imagePath === '') {
    return '/placeholder.jpg';
  }

  const fullUrl = getImageUrl(imagePath);

  return fullUrl;
};
