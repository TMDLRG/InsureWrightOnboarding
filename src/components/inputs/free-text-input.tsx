"use client";

import { Textarea } from "@/components/ui/textarea";

interface FreeTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function FreeTextInput({
  value,
  onChange,
  placeholder,
  disabled,
}: FreeTextInputProps) {
  return (
    <Textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      rows={6}
      className="resize-y min-h-[120px] text-sm"
    />
  );
}
