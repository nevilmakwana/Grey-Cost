import { ShrinkageReport } from '@/components/shrinkage-report';
import { SidebarInset } from '@/components/ui/sidebar';

export default function ShrinkageReportPage() {
  return (
    <SidebarInset>
      <main className="flex-1 overflow-y-auto bg-background">
        <ShrinkageReport />
      </main>
    </SidebarInset>
  );
}
