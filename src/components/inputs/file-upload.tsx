"use client";

import { Upload } from "lucide-react";

interface FileUploadInputProps {
  placeholder?: string;
  disabled?: boolean;
}

export function FileUploadInput({ placeholder, disabled }: FileUploadInputProps) {
  return (
    <div
      className={`border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors ${
        disabled ? "opacity-50" : "hover:border-primary/30 cursor-pointer"
      }`}
    >
      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
      <p className="text-sm font-medium mb-1">
        Drop files here or click to browse
      </p>
      <p className="text-xs text-muted-foreground">
        PDF, Excel, Word documents accepted
      </p>
      {placeholder && (
        <p className="text-xs text-muted-foreground mt-2 italic">{placeholder}</p>
      )}
      <p className="text-xs text-amber-600 mt-3">
        File upload is not yet enabled. Please use the notes field below to
        describe what you&apos;d upload, or email files directly to the team.
      </p>
    </div>
  );
}
