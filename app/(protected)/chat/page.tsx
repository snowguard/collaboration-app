import { ChatApp } from "@/components/ChatApp";
import { requireUser } from "@/lib/auth";

export default async function ChatHomePage() {
  const user = await requireUser();

  return (
    <ChatApp
      currentUser={{ id: user.id, name: user.name, email: user.email, role: user.role }}
    />
  );
}
