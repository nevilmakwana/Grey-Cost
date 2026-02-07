import { SewingThreadCalculator } from '@/components/sewing-thread-calculator';
import { SidebarInset } from '@/components/ui/sidebar';

export default function SewingThreadsPage() {
  return (
    <SidebarInset>
      <main className="flex-1 overflow-y-auto bg-background">
        <SewingThreadCalculator />
      </main>
    </SidebarInset>
  );
}
