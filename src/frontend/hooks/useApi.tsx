import { useState, useCallback, useEffect } from "hono/jsx";

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

  const execute = useCallback(
    async (url: string, options?: RequestInit): Promise<T | null> => {
      setState((prev) => ({
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
    },
    [],
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({
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

interface Message {
  id: string;
  message: string;
  role: "user" | "assistant";
  conversationId: string;
  createdAt: Date;
}
// Specialized hook for chat messages
export function useChatMessages(conversationId: string | null) {
  const fetchApi = useApi<{ data: Message[] }>();
  const sendApi = useApi<{ data: Message }>();

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      const result = await fetchApi.execute(`/chat/${conversationId}`);
      return result?.data || [];
    },
    [fetchApi.execute],
  );

  const sendMessage = useCallback(
    async (conversationId: string, message: string) => {
      const result = await sendApi.execute("/chat", {
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
    },
    [sendApi.execute],
  );

  // Load messages when conversation ID is available
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
    }
  }, [conversationId, fetchMessages]);

  return {
    messages: {
      list: fetchApi.data?.data || [],
      isLoading: fetchApi.isLoading,
      error: fetchApi.error,
      refresh: fetchMessages,
      setError: fetchApi.setError,
    },
    send: {
      isSending: sendApi.isLoading,
      error: sendApi.error,
      execute: sendMessage,
      setError: sendApi.setError,
    },
  };
}
