import { AppHeader } from "@/components/layout/app-header";
import { GuideContent } from "@/components/guide/guide-content";

export const dynamic = "force-dynamic";

export default function GuidePage() {
  return (
    <>
      <AppHeader
        breadcrumbs={[
          { label: "User Guide" },
        ]}
      />
      <div className="flex-1 overflow-y-auto">
        <GuideContent />
      </div>
    </>
  );
}
