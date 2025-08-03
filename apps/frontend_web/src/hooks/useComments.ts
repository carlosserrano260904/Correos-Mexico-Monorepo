import { useCommentsStore } from '@/stores/useCommentsStore';

export const useComments = () => {
  const {
    comments,
    addComment,
    getCommentsByProduct,
    getAverageRating,
    getTotalComments
  } = useCommentsStore();

  return {
    comments,
    addComment,
    getCommentsByProduct,
    getAverageRating,
    getTotalComments
  };
};
