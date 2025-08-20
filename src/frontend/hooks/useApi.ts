import { useState, useCallback } from "hono/jsx";

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface ApiHook<T> extends ApiState<T> {
  execute: (url: string, options?: RequestInit) => Promise<void>;
  reset: () => void;
}

export function useApi<T = any>(): ApiHook<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, options?: RequestInit) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setState({
        data,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState({
        data: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
