import { AppLayout } from "@/layouts/app-layout";
import { DocumentManagement } from "@/components/documents/document-management";

export default function DocumentsPage() {
  return (
    <AppLayout>
      <DocumentManagement />
    </AppLayout>
  );
}