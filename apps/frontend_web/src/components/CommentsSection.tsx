import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Comentario } from '@/components/Comentario';
import { AddCommentForm } from '@/components/AddCommentForm';
import { StarRating } from '@/components/StarRating';
import { useComments } from '@/hooks/useComments';
import { IoAddOutline, IoStarSharp } from 'react-icons/io5';

interface CommentsSectionProps {
  productId: string;
}

export const CommentsSection = ({ productId }: CommentsSectionProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const { 
    getCommentsByProduct, 
    addComment, 
    getAverageRating, 
    getTotalComments 
  } = useComments();

  // Información del usuario (por ahora hardcodeada como en el navbar)
  const userInfo = {
    name: 'Mayela Díaz',
    email: 'Mayela@gmail.com',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b9b8e82e?w=150&h=150&fit=crop&crop=face'
  };

  const comments = getCommentsByProduct(productId);
  const averageRating = getAverageRating(productId);
  const totalComments = getTotalComments(productId);

  const handleAddComment = (comment: string, rating: number) => {
    addComment({
      productId,
      userName: userInfo.name,
      userEmail: userInfo.email,
      userImage: userInfo.image,
      rating,
      comment
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header con estadísticas y botón agregar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900">
            Comentarios {totalComments > 0 && `(${totalComments})`}
          </h2>
          
          {totalComments > 0 && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-full">
              <IoStarSharp className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {averageRating.toFixed(1)} de 5
              </span>
            </div>
          )}
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#DE1484] hover:bg-[#c41374] text-white flex items-center gap-2"
        >
          <IoAddOutline className="w-4 h-4" />
          Agregar comentario
        </Button>
      </div>

      {/* Formulario para agregar comentario */}
      {showAddForm && (
        <AddCommentForm
          productId={productId}
          onSubmit={handleAddComment}
          onCancel={() => setShowAddForm(false)}
          userInfo={userInfo}
        />
      )}

      {/* Lista de comentarios */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <IoStarSharp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500 text-lg font-medium">
              Aún no hay comentarios
            </p>
            <p className="text-gray-400 text-sm">
              Sé el primero en compartir tu opinión sobre este producto
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <Comentario
              key={comment.id}
              imagen={comment.userImage}
              nombre={comment.userName}
              calificacion={comment.rating}
              puntaje={comment.rating}
              fecha={comment.date}
              comentario={comment.comment}
            />
          ))
        )}
      </div>
    </div>
  );
};
