import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface CostInputProps {
  id?: string
  label: string
  value: string
  setValue: (v: string) => void
  unit?: string
}

export function CostInput({
  label,
  value,
  setValue,
  unit,
}: CostInputProps) {
  return (
    <div>
      <Label>{label}</Label>

      <div className="relative">
        <Input
  name={`cost-${label.replace(/\s+/g, "-").toLowerCase()}`}
  autoComplete="off"
  type="number"
  inputMode="numeric"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>


        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}
