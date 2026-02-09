import { InvitationsAdmin } from "@/components/InvitationsAdmin";
import { requireAdmin } from "@/lib/auth";

export default async function AdminInvitationsPage() {
  await requireAdmin();
  return <InvitationsAdmin />;
}
