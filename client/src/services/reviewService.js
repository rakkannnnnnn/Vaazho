import { api } from "@/lib/api";

export const createReview = (reviewData) => api.createReview(reviewData);
export const getPropertyReviews = (propertyId) => api.getPropertyReviews(propertyId);
export const updateReview = (reviewId, reviewData) => api.updateReview(reviewId, reviewData);
export const deleteReview = (reviewId) => api.deleteReview(reviewId);
export const respondToReview = (reviewId, ownerResponse) =>
  api.respondToReview(reviewId, { ownerResponse });
