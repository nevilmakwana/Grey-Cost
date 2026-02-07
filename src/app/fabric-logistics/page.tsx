
import { FabricLogisticsCalculator } from '@/components/fabric-logistics-calculator';
import { SidebarInset } from '@/components/ui/sidebar';

export default function FabricLogisticsPage() {
  return (
    <SidebarInset>
      <main className="flex-1 overflow-y-auto bg-background">
        <FabricLogisticsCalculator />
      </main>
    </SidebarInset>
  );
}
