import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (user) redirect("/chat");
  return children;
}
