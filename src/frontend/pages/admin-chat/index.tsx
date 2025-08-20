import { setupView } from "../../../utils/view.tsx";
import { ChatLayout } from "../../components/chat-layout.tsx";

function AdminChat() {
  return (
    <ChatLayout>
      <div>Admin Chat</div>
    </ChatLayout>
  );
}

setupView(AdminChat);
