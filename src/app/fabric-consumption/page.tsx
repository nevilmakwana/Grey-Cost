
import { FabricConsumptionCalculator } from '@/components/fabric-consumption-calculator';
import { SidebarInset } from '@/components/ui/sidebar';

export default function FabricConsumptionPage() {
  return (
    <SidebarInset>
      <main className="flex-1 overflow-y-auto bg-background">
        <FabricConsumptionCalculator />
      </main>
    </SidebarInset>
  );
}
