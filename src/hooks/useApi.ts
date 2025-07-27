/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, loading: true, error: null });
      
      try {
        const result = await apiFunction(...args);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setState({ data: null, loading: false, error: errorMessage });
        return null;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hooks for common operations
export function useApiMutation<T = any>(
  mutationFunction: (...args: any[]) => Promise<T>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await mutationFunction(...args);
        setLoading(false);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [mutationFunction]
  );

  return {
    mutate,
    loading,
    error,
  };
}

export function useApiQuery<T = any>(
  queryFunction: (...args: any[]) => Promise<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      
      try {
        const result = await queryFunction(...args);
        setData(result);
        setLoading(false);
        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [queryFunction]
  );

  return {
    data,
    loading,
    error,
    refetch,
  };
} 