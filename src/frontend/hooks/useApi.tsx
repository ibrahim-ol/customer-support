import { useState, useCallback } from "hono/jsx";

export interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: (url: string, options?: RequestInit) => Promise<T | null>;
  reset: () => void;
  setError: (error: string | null) => void;
}

export function useApi<T = any>(): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(async (url: string, options?: RequestInit): Promise<T | null> => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        const errorMessage = `Request failed: ${response.status} ${response.statusText}`;
        setState({
          data: null,
          isLoading: false,
          error: errorMessage,
        });
        console.error("API Error:", errorText);
        return null;
      }

      const data = await response.json();
      setState({
        data,
        isLoading: false,
        error: null,
      });

      return data;
    } catch (err) {
      const errorMessage = "Network error - could not complete request";
      setState({
        data: null,
        isLoading: false,
        error: errorMessage,
      });
      console.error("Network Error:", err);
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({
      ...prev,
      error,
    }));
  }, []);

  return {
    ...state,
    execute,
    reset,
    setError,
  };
}

// Specialized hook for chat messages
export function useChatMessages() {
  const api = useApi<{ data: any[] }>();

  const fetchMessages = useCallback(async (conversationId: string) => {
    const result = await api.execute(`/chat/${conversationId}`);
    return result?.data || [];
  }, [api.execute]);

  const sendMessage = useCallback(async (conversationId: string, message: string) => {
    const result = await api.execute("/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: conversationId,
        message: message.trim(),
      }),
    });
    return result;
  }, [api.execute]);

  return {
    messages: api.data?.data || [],
    isLoading: api.isLoading,
    error: api.error,
    fetchMessages,
    sendMessage,
    setError: api.setError,
    reset: api.reset,
  };
}
