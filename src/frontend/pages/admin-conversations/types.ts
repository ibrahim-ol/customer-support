import { MoodCategory } from "../../../types/mood.ts";

interface Message {
  id: string;
  message: string;
  mood: MoodCategory;
  role: "user" | "assistant";
  userId: string | null;
  createdAt: string;
}

interface ConversationListItem {
  id: string;
  customerName: string;
  channel: string;
  status: "active" | "killed";
  mood: MoodCategory;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string;
  summaryPreview: string;
}

export interface ConversationDetails extends ConversationListItem {
  messages: Message[];
  summary: string;
}

export interface ConversationsResponse {
  success: boolean;
  data: ConversationListItem[];
}

export interface ConversationDetailResponse {
  success: boolean;
  data: ConversationDetails;
}
