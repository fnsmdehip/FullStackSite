import { AppLayout } from "@/layouts/app-layout";
import { ComplianceDashboard } from "@/components/compliance/compliance-dashboard";

export default function CompliancePage() {
  return (
    <AppLayout>
      <ComplianceDashboard />
    </AppLayout>
  );
}