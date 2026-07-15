import { useState, useCallback } from 'react';

/**
 * Reusable hook to handle async API request states.
 * Wraps any promise-returning function with loading, error, and data variables.
 */
export const useApi = (apiFunc) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message || 'An error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, execute, setData, setError };
};

export default useApi;
