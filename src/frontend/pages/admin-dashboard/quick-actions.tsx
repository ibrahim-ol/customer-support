import { ActionCard } from "../../components/cards/action-card.tsx";
import { ContentCard } from "../../components/cards/content-card.tsx";

export function QuickActions() {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-black mb-4">Quick Actions</h2>
      <ContentCard>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <ActionCard
            title="Manage Products"
            icon="📦"
            href="/admin/products"
          />
          <ActionCard
            title="View Conversations"
            icon="💬"
            href="/admin/conversations"
          />
          <ActionCard title="Analytics" icon="📈" href="/admin/analytics" />
        </div>
      </ContentCard>
    </div>
  );
}
