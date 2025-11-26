import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/StarRating';
import { IoClose } from 'react-icons/io5';

interface AddCommentFormProps {
  productId: string;
  onSubmit: (comment: string, rating: number) => void;
  onCancel: () => void;
  userInfo: {
    name: string;
    email: string;
    image: string;
  };
}

export const AddCommentForm = ({ 
  productId, 
  onSubmit, 
  onCancel, 
  userInfo 
}: AddCommentFormProps) => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState<{ comment?: string; rating?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones
    const newErrors: { comment?: string; rating?: string } = {};
    
    if (!comment.trim()) {
      newErrors.comment = 'El comentario es requerido';
    }
    
    if (rating === 0) {
      newErrors.rating = 'La calificación es requerida';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Si todo está bien, enviar el comentario
    onSubmit(comment.trim(), rating);
    
    // Limpiar formulario
    setComment('');
    setRating(0);
    setErrors({});
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Agregar comentario</h3>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
        >
          <IoClose className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Información del usuario */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <img
            src={userInfo.image}
            alt={userInfo.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-900">{userInfo.name}</p>
            <p className="text-sm text-gray-500">{userInfo.email}</p>
          </div>
        </div>

        {/* Calificación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Calificación *
          </label>
          <StarRating 
            rating={rating} 
            onRatingChange={setRating}
            size="lg"
          />
          {errors.rating && (
            <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
          )}
        </div>

        {/* Comentario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentario *
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Escribe tu comentario sobre este producto..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
          />
          {errors.comment && (
            <p className="text-sm text-red-600 mt-1">{errors.comment}</p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            className="bg-[#DE1484] hover:bg-[#c41374] text-white px-6"
          >
            Publicar comentario
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="px-6"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};
