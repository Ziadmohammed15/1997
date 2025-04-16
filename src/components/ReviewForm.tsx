import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReviewFormProps {
  serviceId: number;
  onSubmit: (rating: number, comment: string) => void;
  onCancel: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ serviceId, onSubmit, onCancel }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      onSubmit(rating, comment);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="card p-6"
    >
      <h2 className="text-xl font-bold mb-4">إضافة تقييم</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <p className="text-secondary-700 mb-2">تقييمك للخدمة</p>
          <div className="flex justify-center space-x-2 rtl:space-x-reverse">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-500 fill-yellow-500'
                      : 'text-secondary-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center mt-2 text-secondary-600">
              {rating === 5 ? 'ممتاز' : 
               rating === 4 ? 'جيد جداً' : 
               rating === 3 ? 'جيد' : 
               rating === 2 ? 'مقبول' : 'ضعيف'}
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="comment" className="block text-sm font-medium text-secondary-700 mb-2">
            تعليقك
          </label>
          <textarea
            id="comment"
            rows={4}
            className="input-field"
            placeholder="اكتب تعليقك هنا..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3 rtl:space-x-reverse">
          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={rating === 0}
          >
            إرسال التقييم
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReviewForm;