"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface YesNoToggleProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export function YesNoToggle({ value, onChange, disabled }: YesNoToggleProps) {
  return (
    <div className="flex items-center gap-3">
      <Switch
        checked={value === true}
        onCheckedChange={(checked) => onChange(checked)}
        disabled={disabled}
      />
      <Label className="text-sm">
        {value === null ? (
          <span className="text-muted-foreground">Not answered</span>
        ) : value ? (
          <span className="text-green-700 font-medium">Yes</span>
        ) : (
          <span className="text-red-600 font-medium">No</span>
        )}
      </Label>
    </div>
  );
}
