// Error types for API responses

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface ApiError {
  response?: {
    data?: ApiErrorResponse;
    status?: number;
  };
  message?: string;
}

export const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as ApiError;
    return apiError.response?.data?.message || 'An unexpected error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};
