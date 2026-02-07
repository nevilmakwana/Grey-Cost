import { CostCalculator } from '@/components/cost-calculator';
import { SidebarInset } from '@/components/ui/sidebar';


export default function Home() {
  return (
    <SidebarInset>
      <main className="flex-1 overflow-y-auto bg-background">
        <CostCalculator />
      </main>
    </SidebarInset>
  );
}
