import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Comment {
  id: string;
  productId: string;
  userName: string;
  userEmail: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

interface CommentsState {
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id' | 'date'>) => void;
  getCommentsByProduct: (productId: string) => Comment[];
  getAverageRating: (productId: string) => number;
  getTotalComments: (productId: string) => number;
}

export const useCommentsStore = create<CommentsState>()(
  persist(
    (set, get) => ({
      comments: [],
      
      addComment: (newComment) => {
        const comment: Comment = {
          ...newComment,
          id: Date.now().toString(),
          date: new Date().toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        };
        
        set((state) => ({
          comments: [comment, ...state.comments]
        }));
      },
      
      getCommentsByProduct: (productId) => {
        return get().comments.filter(comment => comment.productId === productId);
      },
      
      getAverageRating: (productId) => {
        const productComments = get().comments.filter(comment => comment.productId === productId);
        if (productComments.length === 0) return 0;
        
        const totalRating = productComments.reduce((sum, comment) => sum + comment.rating, 0);
        return totalRating / productComments.length;
      },
      
      getTotalComments: (productId) => {
        return get().comments.filter(comment => comment.productId === productId).length;
      }
    }),
    {
      name: 'comments-storage',
    }
  )
);
