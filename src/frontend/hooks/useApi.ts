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
          let errorMessage = `Request failed: ${response.status} ${response.statusText}`;

          // Try to parse JSON error response
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (e) {
            // If parsing fails, use the status message
          }

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

interface ConversationInfo {
  id: string;
  status: "active" | "killed";
  customerName: string;
  channel: string;
}

interface ChatResponse {
  data: Message[];
  conversation?: ConversationInfo;
  error?: string;
}

// Specialized hook for chat messages with optimistic updates
export function useChatMessages(conversationId: string | null) {
  const fetchApi = useApi<ChatResponse>();
  const sendApi = useApi<{ data: { request: Message; reply: Message } }>();
  const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);
  const [isConversationKilled, setIsConversationKilled] = useState(false);

  const fetchMessages = useCallback(
    async (conversationId: string) => {
      const result = await fetchApi.execute(`/chat/${conversationId}`);

      // Check if conversation is killed from the response
      if (result?.conversation?.status === "killed") {
        setIsConversationKilled(true);
      } else if (
        result?.error &&
        result?.error.includes("closed and cannot accept new messages")
      ) {
        setIsConversationKilled(true);
      } else {
        setIsConversationKilled(false);
      }

      // Clear optimistic messages when we get fresh data
      setOptimisticMessages([]);
      return result?.data || [];
    },
    [fetchApi.execute],
  );

  const sendMessage = useCallback(
    async (conversationId: string, message: string) => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage) return null;

      // Create optimistic message with unique ID
      const optimisticMessage: Message = {
        id: `optimistic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        message: trimmedMessage,
        role: "user",
        conversationId,
        createdAt: new Date(),
      };

      // Add optimistic message immediately
      setOptimisticMessages((prev) => [...prev, optimisticMessage]);

      try {
        const result = await sendApi.execute("/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            message: trimmedMessage,
          }),
        });
        // Remove the optimistic message and refresh to get the real message + AI response
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id),
        );

        if (result?.data) {
          setOptimisticMessages((prev) => [
            ...prev,
            result.data.request,
            result.data.reply,
          ]);
        }

        return result;
      } catch (error) {
        // Remove optimistic message on error
        setOptimisticMessages((prev) =>
          prev.filter((msg) => msg.id !== optimisticMessage.id),
        );
        throw error;
      }
    },
    [sendApi.execute, fetchMessages],
  );

  // Load messages and check conversation status when conversation ID is available
  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      // Also check if conversation is killed by trying to fetch messages
      // The API will return conversation status along with messages
    }
  }, [conversationId, fetchMessages]);

  // Check if conversation is killed based on send error or fetch error
  useEffect(() => {
    if (
      sendApi.error &&
      sendApi.error.includes("closed and cannot accept new messages")
    ) {
      setIsConversationKilled(true);
    }
  }, [sendApi.error]);

  // Also check fetch errors for conversation status
  useEffect(() => {
    if (
      fetchApi.error &&
      (fetchApi.error.includes("closed and cannot accept new messages") ||
        fetchApi.error.includes("conversation has been killed"))
    ) {
      setIsConversationKilled(true);
    }
  }, [fetchApi.error]);

  // Combine real messages with optimistic messages and sort by creation date
  const allMessages = [
    ...(fetchApi.data?.data || []),
    ...optimisticMessages,
  ].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  return {
    messages: {
      list: allMessages,
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
    conversation: {
      isKilled: isConversationKilled,
      setKilled: setIsConversationKilled,
    },
  };
}

export function useFetch<TResponse>(
  url: string,
  auth: boolean,
  enabled = true,
) {
  const { execute, ...api } = useApi<TResponse>();
  const refresh = () => {
    if (!enabled) {
      return;
    }

    return execute(url, auth ? { credentials: "include" } : {});
  };

  useEffect(() => {
    refresh();
  }, [url, enabled]);

  return {
    ...api,
    refresh,
  };
}

export type UseFetchReturn<T> = ReturnType<typeof useFetch<T>>;
