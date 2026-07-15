/**
 * Extracts and normalizes the message from an API error response.
 * Handles Axios error shapes and standard JavaScript errors.
 */
export const handleApiError = (error) => {
  if (error?.response) {
    // Server responded with a status code that falls out of the range of 2xx
    const data = error.response.data;
    if (data && typeof data === 'object') {
      return data.message || data.error || JSON.stringify(data);
    }
    return `Server Error: ${error.response.statusText || error.response.status}`;
  } else if (error?.request) {
    // Request was made but no response was received
    return 'Network Error: No response received from server. Please check your connection.';
  }
  // Something happened in setting up the request that triggered an Error
  return error?.message || 'An unexpected error occurred. Please try again.';
};
