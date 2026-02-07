
import { ComboOfferCalculator } from '@/components/combo-offer-calculator';
import { SidebarInset } from '@/components/ui/sidebar';

export default function ComboOfferPage() {
  return (
    <SidebarInset>
      <main className="flex-1 overflow-y-auto bg-background">
        <ComboOfferCalculator />
      </main>
    </SidebarInset>
  );
}
