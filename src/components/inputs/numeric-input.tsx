"use client";

import { Input } from "@/components/ui/input";
import { NumericValidation } from "@/lib/types";

interface NumericInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  validation?: NumericValidation;
  placeholder?: string;
  disabled?: boolean;
}

export function NumericInput({
  value,
  onChange,
  validation,
  placeholder,
  disabled,
}: NumericInputProps) {
  return (
    <div className="flex items-center gap-2 max-w-xs">
      {validation?.prefix && (
        <span className="text-sm text-muted-foreground font-medium">
          {validation.prefix}
        </span>
      )}
      <Input
        type="number"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? null : Number(v));
        }}
        min={validation?.min}
        max={validation?.max}
        step={validation?.step}
        placeholder={placeholder}
        disabled={disabled}
        className="text-sm"
      />
      {(validation?.suffix || validation?.unit) && (
        <span className="text-sm text-muted-foreground">
          {validation.suffix || validation.unit}
        </span>
      )}
    </div>
  );
}
