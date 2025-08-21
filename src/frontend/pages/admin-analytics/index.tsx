import { setupView } from "../../../utils/view.tsx";
import {
  AdminAlternateHeader,
  AdminHeader,
} from "../../components/admin-header.tsx";
import { ActionCard } from "../../components/cards/action-card.tsx";
import { ContentCard } from "../../components/cards/content-card.tsx";
import { CustomerMoodAnalytics } from "../../components/mood/customer-mood-analytics.tsx";

function AdminAnalytics() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header */}
      <AdminHeader
        title="Analytics"
        back={{ text: "Back to Dashboard", link: "/admin/dashboard" }}
      />

      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <CustomerMoodAnalytics />
        </div>
      </main>
    </div>
  );
}

// Client view setup
setupView(AdminAnalytics);
