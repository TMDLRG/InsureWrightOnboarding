"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { SelectOption } from "@/lib/types";

interface SingleSelectInputProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function SingleSelectInput({
  options,
  value,
  onChange,
  disabled,
}: SingleSelectInputProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      className="space-y-3"
    >
      {options.map((opt) => (
        <div key={opt.value} className="flex items-start space-x-3">
          <RadioGroupItem value={opt.value} id={opt.value} className="mt-0.5" />
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
    </RadioGroup>
  );
}
