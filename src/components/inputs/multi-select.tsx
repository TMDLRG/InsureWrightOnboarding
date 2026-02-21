"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/lib/types";

interface MultiSelectInputProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
}

export function MultiSelectInput({
  options,
  value,
  onChange,
  disabled,
}: MultiSelectInputProps) {
  const toggle = (optValue: string) => {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  return (
    <div className="space-y-3">
      {options.map((opt) => (
        <div key={opt.value} className="flex items-start space-x-3">
          <Checkbox
            id={opt.value}
            checked={value.includes(opt.value)}
            onCheckedChange={() => toggle(opt.value)}
            disabled={disabled}
            className="mt-0.5"
          />
          <Label htmlFor={opt.value} className="cursor-pointer flex-1">
            <span className="text-sm font-medium">{opt.label}</span>
            {opt.description && (
              <span className="block text-xs text-muted-foreground mt-0.5">
                {opt.description}
              </span>
            )}
          </Label>
        </div>
      ))}
    </div>
  );
}
