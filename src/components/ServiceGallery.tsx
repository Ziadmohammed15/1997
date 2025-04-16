import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Image as ImageIcon } from 'lucide-react';

interface ServiceGalleryProps {
  images: string[];
  onAddImages: (files: File[]) => void;
  onRemoveImage: (index: number) => void;
}

const ServiceGallery: React.FC<ServiceGalleryProps> = ({
  images,
  onAddImages,
  onRemoveImage
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onAddImages(acceptedFiles);
  }, [onAddImages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: true
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-secondary-200 dark:border-secondary-700 hover:border-primary-500'
        }`}
      >
        <input {...getInputProps()} />
        <Camera className="w-8 h-8 mx-auto mb-2 text-secondary-400" />
        {isDragActive ? (
          <p className="text-primary-600 dark:text-primary-400">أفلت الصور هنا...</p>
        ) : (
          <div>
            <p className="text-secondary-600 dark:text-secondary-300">
              اسحب وأفلت الصور هنا، أو انقر للاختيار
            </p>
            <p className="text-sm text-secondary-400 mt-1">
              PNG, JPG, WEBP حتى 5 ميجابايت
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <AnimatePresence>
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="relative aspect-square rounded-xl overflow-hidden group"
            >
              <img
                src={image}
                alt={`صورة ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onRemoveImage(index)}
                  className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-xl border-2 border-dashed border-secondary-200 dark:border-secondary-700 flex items-center justify-center"
          >
            <div className="text-center text-secondary-400">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">لا توجد صور</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ServiceGallery;